---
title: Bild signieren
description: Verschiedene Wege zum Signieren deiner Bilder
---

# Bild signieren

Es gibt mehrere Wege, dein Bild mit VisionFusen zu signieren.

## Web-Interface

Der einfachste Weg für einzelne Bilder.

### Schritt 1: Bild vorbereiten

Stelle sicher, dass dein Bild XMP-Metadaten mit Autor hat:
- [CodeBack Image Optimizer](https://codeback.de/image-optimizer) nutzen
- Oder eigenes Tool (Lightroom, ExifTool, etc.)

### Schritt 2: Signierungsmethode wählen

Gehe zu [visionfusen.org/tools/sign](https://visionfusen.org/tools/sign) und wähle:

| Methode | Beschreibung | Kosten |
|---------|--------------|--------|
| **Browser Extension (NIP-07)** | Signiere mit deinem eigenen Nostr-Key | Kostenlos |
| **VisionFusen Zeitstempel** | VisionFusen signiert als Zeuge | 21 Sats |

## API

Für Automatisierung und Integration in eigene Workflows.

### cURL Beispiel

```bash
# Mit Datei-Upload
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -F "image=@mein-bild.webp"

# Mit URL
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/bild.webp"}'
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('https://visionfusen.org/api/sign-image-v2', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.urls.verify);
```

## Fehlerbehandlung

| Error Code | Bedeutung | Lösung |
|------------|-----------|--------|
| `AUTHOR_REQUIRED` | Kein Autor in XMP | Metadaten einbetten |
| `ALREADY_SIGNED` | Bild bereits signiert | Verifizierungs-URL nutzen |
| `FILE_TOO_LARGE` | Über 10MB | Bild komprimieren |
| `INVALID_FORMAT` | Falsches Format | WebP, PNG, JPEG, GIF nutzen |
