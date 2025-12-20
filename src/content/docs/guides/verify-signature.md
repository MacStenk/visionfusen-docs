---
title: Signatur verifizieren
description: Wie du prüfst ob ein Bild signiert wurde
---

Jeder kann prüfen, ob ein Bild auf Nostr signiert wurde.

## Web-Interface

Der einfachste Weg:

1. Gehe zu [visionfusen.org/verify](https://visionfusen.org/verify)
2. Gib den SHA-256 Hash ein ODER lade das Bild hoch
3. Ergebnis wird angezeigt

## API

### Per Hash

```bash
curl "https://visionfusen.org/api/verify?hash=cd4efae6..."
```

### Per Bild-URL

```bash
curl "https://visionfusen.org/api/verify?url=https://cdn.visionfusen.org/images/bild.webp"
```

### Antwort: Signiert

```json
{
  "verified": true,
  "hash": "cd4efae6...",
  "event": {
    "id": "9bc481...",
    "pubkey": "abc123...",
    "npub": "npub1...",
    "created_at": 1703001234
  },
  "metadata": {
    "author": "Steven Noack",
    "title": "Sonnenuntergang"
  },
  "relays_found": ["relay.damus.io", "nos.lol"]
}
```

### Antwort: Nicht signiert

```json
{
  "verified": false,
  "hash": "cd4efae6...",
  "message": "Keine Signatur gefunden",
  "sign_url": "https://visionfusen.org/tools/sign"
}
```

## Hash selbst berechnen

### JavaScript/Browser

```javascript
async function calculateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### Bash

```bash
sha256sum bild.webp | cut -d' ' -f1
```
