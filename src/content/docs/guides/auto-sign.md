---
title: "Auto-Sign Script"
description: "Automatisch alle Webseiten nach dem Build signieren"
---

# Auto-Sign Script

Das Auto-Sign Script signiert automatisch alle HTML-Seiten nach dem Astro-Build mit VF-1064.

## Schnellstart

```bash
# Dry Run (zeigt was passieren würde)
npm run sign:dry

# Echt signieren
npm run sign

# Build + Sign in einem
npm run build:sign
```

## Setup

### 1. Environment Variables

Erstelle `.env` im Projektroot:

```env
# Pflicht
BUNKER_API_TOKEN=dein-token

# Optional (hat Defaults)
BUNKER_KEY_NAME=steven
BUNKER_URL=https://bunker.visionfusen.org
```

:::caution[Wichtig]
Die `.env` Datei darf **nicht** nach GitHub gepusht werden. Sie ist bereits in `.gitignore`.
:::

### 2. Token bekommen

Der `BUNKER_API_TOKEN` kommt aus Railway:

1. Öffne [Railway Dashboard](https://railway.app)
2. Projekt: `visionfusen-bunker`
3. Tab: Variablen
4. Kopiere `BUNKER_API_TOKEN`

### 3. Key-Name finden

```bash
curl -H "Authorization: Bearer DEIN_TOKEN" \
  https://bunker.visionfusen.org/api/keys
```

Der `"name"` Wert ist dein `BUNKER_KEY_NAME`.

## Was passiert?

```
HTML-Datei
    │
    ▼
<main> Content extrahieren
    │
    ▼
SHA-256 Hash berechnen
    │
    ▼
Bunker API signiert
    │
    ▼
Meta-Tags einfügen
    │
    ▼
Signierte HTML-Datei
```

## Output

Nach dem Signieren enthält jede HTML-Datei:

```html
<!-- VisionFusen Signature (VF-1064) -->
<meta name="nostr:event" content="abc123..." />
<meta name="nostr:pubkey" content="bef829d0..." />
<meta name="nostr:hash" content="sha256..." />
<link rel="nostr-verification" 
      href="https://visionfusen.org/verify/abc123..." />
```

## Cache

Das Script cached Hashes in `.sign-cache.json`. Beim nächsten Run werden nur geänderte Seiten neu signiert:

```
✅ Signiert:     3   (geändert)
⏭️  Unverändert:  17  (aus Cache)
```

## Optionen

| Flag | Beschreibung |
|------|--------------|
| `--dry-run` | Zeigt was passieren würde, signiert nicht |
| `--verbose` | Ausführliche Ausgabe |

## Fehlerbehebung

### "BUNKER_API_TOKEN nicht gesetzt"

Die `.env` Datei fehlt oder der Token ist leer.

### "Key nicht gefunden"

Der `BUNKER_KEY_NAME` stimmt nicht. Prüfe mit:

```bash
curl -H "Authorization: Bearer TOKEN" \
  https://bunker.visionfusen.org/api/keys
```

### "Key ist gesperrt"

Der Key muss im Bunker entsperrt sein. Öffne das Admin-Dashboard oder nutze Auto-Unlock.

## Siehe auch

- [VF-1064 Spec](/reference/vf-1064) – Technische Spezifikation
- [Hash & Signatur](/concepts/hash-signature) – Wie Signaturen funktionieren
