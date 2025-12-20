/**
 * VisionFusen Auto-Sign Script
 * 
 * Signiert alle HTML-Seiten nach dem Build automatisch mit VF-1064
 * Nutzt die VisionFusen Bunker HTTP API für echte NIP-Signaturen
 * 
 * Usage: node scripts/sign-pages.js
 *        node scripts/sign-pages.js --dry-run
 *        node scripts/sign-pages.js --verbose
 * 
 * Environment:
 *   BUNKER_URL       - URL des Bunkers (default: https://bunker.visionfusen.org)
 *   BUNKER_API_TOKEN - API Token für Authentifizierung
 *   BUNKER_KEY_NAME  - Name des Keys zum Signieren (default: visionfusen)
 *   RELAY_URL        - Relay für Publishing (default: wss://relay.visionfusen.org)
 *   BASE_URL         - Base URL der Website
 */

// Lade .env Datei (falls vorhanden)
import { config } from 'dotenv';
config();

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import * as cheerio from 'cheerio';

// ============================================
// KONFIGURATION
// ============================================

const CONFIG = {
  // Verzeichnis mit gebauten HTML-Dateien
  distDir: './dist',
  
  // Base URL der Website
  baseUrl: process.env.BASE_URL || 'https://docs.visionfusen.org',
  
  // Bunker-Konfiguration
  bunker: {
    url: process.env.BUNKER_URL || 'https://bunker.visionfusen.org',
    token: process.env.BUNKER_API_TOKEN || process.env.BUNKER_TOKEN || '',
    keyName: process.env.BUNKER_KEY_NAME || 'visionfusen',
  },
  
  // Relay für Event-Publishing
  relay: process.env.RELAY_URL || 'wss://relay.visionfusen.org',
  
  // Event Kind (1064 = regular, 30064 = replaceable)
  eventKind: 30064,
  
  // Cache-Datei für bereits signierte Hashes
  cacheFile: '.sign-cache.json',
  
  // Dry Run (nur anzeigen, nicht signieren)
  dryRun: process.argv.includes('--dry-run'),
  
  // Verbose Output
  verbose: process.argv.includes('--verbose'),
};

// ============================================
// HILFSFUNKTIONEN
// ============================================

/**
 * SHA-256 Hash berechnen
 */
function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Content normalisieren für konsistentes Hashing
 */
function normalizeContent(html) {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Main-Content aus HTML extrahieren (mit cheerio)
 */
function extractMainContent(html) {
  const $ = cheerio.load(html);
  
  // Priorität: main > article > body
  let content = $('main').html();
  if (!content) content = $('article').html();
  if (!content) content = $('body').html();
  
  return content || html;
}

/**
 * Titel aus HTML extrahieren (mit cheerio)
 */
function extractTitle(html) {
  const $ = cheerio.load(html);
  const title = $('title').text();
  return title ? title.split('|')[0].trim() : '';
}

/**
 * Meta-Tags in HTML injizieren (mit cheerio - robust!)
 */
function injectMetaTags(html, eventData) {
  const $ = cheerio.load(html);
  
  // Alte VisionFusen Meta-Tags entfernen (falls vorhanden)
  $('meta[name^="nostr:"]').remove();
  $('link[rel="nostr-verification"]').remove();
  $('head').find('*').filter(function() {
    return $(this).text().includes('VisionFusen Signature');
  }).prev('comment').remove();
  
  // Neue Meta-Tags am Ende von <head> einfügen
  const metaTags = `
    <!-- VisionFusen Signature (VF-1064) -->
    <meta name="nostr:event" content="${eventData.id}">
    <meta name="nostr:pubkey" content="${eventData.pubkey}">
    <meta name="nostr:hash" content="${eventData.hash}">
    <meta name="nostr:signed" content="${eventData.signedAt}">
    <link rel="nostr-verification" href="https://visionfusen.org/verify/${eventData.id}">
  `;
  
  $('head').append(metaTags);
  
  return $.html();
}

/**
 * Alle HTML-Dateien im Verzeichnis finden
 */
function findHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!['_astro', 'pagefind', 'node_modules'].includes(entry)) {
        findHtmlFiles(fullPath, files);
      }
    } else if (entry.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * URL aus Dateipfad generieren
 */
function pathToUrl(filePath, distDir, baseUrl) {
  let relativePath = relative(distDir, filePath);
  
  if (relativePath === 'index.html') {
    return baseUrl + '/';
  }
  
  if (relativePath.endsWith('/index.html')) {
    relativePath = relativePath.slice(0, -10);
  }
  
  if (relativePath.endsWith('.html')) {
    relativePath = relativePath.slice(0, -5);
  }
  
  return baseUrl + '/' + relativePath.replace(/\\/g, '/');
}

/**
 * Cache laden
 */
function loadCache(cacheFile) {
  if (existsSync(cacheFile)) {
    try {
      return JSON.parse(readFileSync(cacheFile, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Cache speichern
 */
function saveCache(cacheFile, cache) {
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

// ============================================
// BUNKER API
// ============================================

/**
 * Bunker Status prüfen
 */
async function checkBunkerStatus() {
  try {
    const response = await fetch(`${CONFIG.bunker.url}/api/status`, {
      headers: {
        'Authorization': `Bearer ${CONFIG.bunker.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Bunker nicht erreichbar: ${error.message}`);
  }
}

/**
 * Event mit Bunker signieren
 */
async function signWithBunker(event) {
  if (!CONFIG.bunker.token) {
    throw new Error('BUNKER_API_TOKEN nicht gesetzt');
  }
  
  try {
    const response = await fetch(`${CONFIG.bunker.url}/api/sign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.bunker.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyName: CONFIG.bunker.keyName,
        event: {
          kind: event.kind,
          content: event.content,
          tags: event.tags,
          created_at: event.created_at,
        },
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Status ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.event) {
      throw new Error('Ungültige Antwort vom Bunker');
    }
    
    return result.event;
  } catch (error) {
    throw new Error(`Signierung fehlgeschlagen: ${error.message}`);
  }
}

// ============================================
// RELAY PUBLISHING
// ============================================

/**
 * Event auf Relay publishen
 */
async function publishToRelay(event, relayUrl) {
  // Nutze native WebSocket (Node.js 22+) oder ws package
  const WebSocketImpl = globalThis.WebSocket || (await import('ws')).default;
  
  return new Promise((resolve, reject) => {
    let ws;
    let timeout;
    
    try {
      ws = new WebSocketImpl(relayUrl);
    } catch (e) {
      reject(new Error(`WebSocket Fehler: ${e.message}`));
      return;
    }
    
    timeout = setTimeout(() => {
      if (ws) ws.close();
      reject(new Error('Timeout beim Relay-Publishing'));
    }, 10000);
    
    ws.onopen = () => {
      // EVENT message senden: ["EVENT", event]
      const message = JSON.stringify(['EVENT', event]);
      ws.send(message);
    };
    
    ws.onmessage = (msg) => {
      try {
        const data = typeof msg.data === 'string' ? msg.data : msg.data.toString();
        const response = JSON.parse(data);
        
        // OK response: ["OK", event_id, success, message]
        if (response[0] === 'OK') {
          clearTimeout(timeout);
          ws.close();
          
          if (response[2] === true) {
            resolve({ success: true, eventId: response[1] });
          } else {
            reject(new Error(response[3] || 'Relay rejected event'));
          }
        }
      } catch (e) {
        // Ignoriere Parse-Fehler
      }
    };
    
    ws.onerror = (error) => {
      clearTimeout(timeout);
      if (ws) ws.close();
      reject(new Error(`WebSocket Fehler: ${error.message || 'Unknown'}`));
    };
    
    ws.onclose = () => {
      clearTimeout(timeout);
    };
  });
}

// ============================================
// HAUPTLOGIK
// ============================================

async function signPages() {
  console.log('\n🔏 VisionFusen Auto-Sign (VF-1064)\n');
  console.log(`   Dist:    ${CONFIG.distDir}`);
  console.log(`   Base:    ${CONFIG.baseUrl}`);
  console.log(`   Bunker:  ${CONFIG.bunker.url}`);
  console.log(`   Key:     ${CONFIG.bunker.keyName}`);
  console.log(`   Relay:   ${CONFIG.relay}`);
  console.log(`   Kind:    ${CONFIG.eventKind}`);
  console.log(`   Dry Run: ${CONFIG.dryRun}\n`);
  
  // Bunker-Verbindung prüfen (nicht bei dry-run)
  if (!CONFIG.dryRun) {
    if (!CONFIG.bunker.token) {
      console.log('❌ BUNKER_API_TOKEN nicht gesetzt!\n');
      console.log('   Setze die Umgebungsvariable:');
      console.log('   export BUNKER_API_TOKEN="dein-api-token"\n');
      process.exit(1);
    }
    
    try {
      console.log('🔌 Prüfe Bunker-Verbindung...');
      const status = await checkBunkerStatus();
      console.log(`   ✅ Bunker online`);
      console.log(`   Keys: ${status.keys?.active || 0} aktiv, ${status.keys?.locked || 0} gesperrt\n`);
    } catch (error) {
      console.log(`   ❌ ${error.message}\n`);
      process.exit(1);
    }
  }
  
  // HTML-Dateien finden
  const htmlFiles = findHtmlFiles(CONFIG.distDir);
  console.log(`📄 ${htmlFiles.length} HTML-Dateien gefunden\n`);
  
  // Cache laden
  const cache = loadCache(CONFIG.cacheFile);
  
  let signed = 0;
  let skipped = 0;
  let errors = 0;
  let published = 0;
  
  const results = [];
  
  for (const filePath of htmlFiles) {
    const url = pathToUrl(filePath, CONFIG.distDir, CONFIG.baseUrl);
    const relativePath = relative(CONFIG.distDir, filePath);
    
    try {
      // HTML lesen
      const html = readFileSync(filePath, 'utf8');
      
      // Content extrahieren und normalisieren
      const mainContent = extractMainContent(html);
      const normalized = normalizeContent(mainContent);
      
      // Hash berechnen
      const hash = sha256(normalized);
      const hash8 = hash.slice(0, 8);
      
      // Titel extrahieren
      const title = extractTitle(html);
      
      // Bereits signiert mit gleichem Hash?
      if (cache[url] === hash) {
        if (CONFIG.verbose) {
          console.log(`⏭️  ${relativePath} (unverändert)`);
        }
        skipped++;
        continue;
      }
      
      console.log(`📝 ${relativePath}`);
      console.log(`   URL:   ${url}`);
      console.log(`   Title: ${title}`);
      console.log(`   Hash:  ${hash8}...`);
      
      // Ergebnis speichern
      results.push({
        path: relativePath,
        url,
        title,
        hash,
        hash8,
      });
      
      if (CONFIG.dryRun) {
        console.log(`   ⏸️  Dry Run - übersprungen\n`);
        signed++;
        continue;
      }
      
      // Event erstellen
      const event = {
        kind: CONFIG.eventKind,
        content: '',
        tags: [
          ['d', url.replace(CONFIG.baseUrl, '')],
          ['url', url],
          ['x', hash],
          ['m', 'text/html'],
          ['title', title],
          ['selector', 'main'],
          ['snapshot', new Date().toISOString()],
          ['signed_by', 'VisionFusen'],
          ['signed_by_url', 'https://visionfusen.org'],
        ],
        created_at: Math.floor(Date.now() / 1000),
      };
      
      // Signieren via Bunker API
      const signedEvent = await signWithBunker(event);
      
      console.log(`   ✅ Signiert: ${signedEvent.id.slice(0, 8)}...`);
      
      // Auf Relay publishen
      try {
        await publishToRelay(signedEvent, CONFIG.relay);
        console.log(`   📡 Published zu ${CONFIG.relay}`);
        published++;
      } catch (relayError) {
        console.log(`   ⚠️  Relay-Fehler: ${relayError.message}`);
      }
      
      // Meta-Tags injizieren (mit cheerio - robust!)
      const updatedHtml = injectMetaTags(html, {
        id: signedEvent.id,
        pubkey: signedEvent.pubkey,
        hash: hash,
        signedAt: new Date().toISOString(),
      });
      
      // HTML speichern
      writeFileSync(filePath, updatedHtml);
      
      // Cache updaten
      cache[url] = hash;
      
      console.log(`   Pubkey: ${signedEvent.pubkey.slice(0, 8)}...\n`);
      signed++;
      
    } catch (error) {
      console.error(`   ❌ Fehler: ${error.message}\n`);
      errors++;
    }
  }
  
  // Cache speichern
  if (!CONFIG.dryRun) {
    saveCache(CONFIG.cacheFile, cache);
  }
  
  // Zusammenfassung
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Signiert:     ${signed}`);
  console.log(`📡 Published:    ${published}`);
  console.log(`⏭️  Unverändert:  ${skipped}`);
  console.log(`❌ Fehler:       ${errors}`);
  console.log('═══════════════════════════════════════\n');
  
  // Bei dry-run: Liste der zu signierenden Seiten
  if (CONFIG.dryRun && results.length > 0) {
    console.log('📋 Würde signiert werden:\n');
    for (const r of results) {
      console.log(`   ${r.url}`);
      console.log(`   → ${r.title}.vf${CONFIG.eventKind}-${r.hash8}.html\n`);
    }
  }
}

// ============================================
// START
// ============================================

signPages().catch(error => {
  console.error('❌ Fataler Fehler:', error.message);
  process.exit(1);
});
