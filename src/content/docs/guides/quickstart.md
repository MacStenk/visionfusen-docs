---
title: Schnellstart
description: In 5 Minuten dein erstes Bild signieren
---

# Schnellstart

Signiere dein erstes Bild in unter 5 Minuten.

## Voraussetzung: Metadaten einbetten

VisionFusen erfordert **XMP-Metadaten** mit mindestens einem Autor. Ohne Autor wird die Signierung abgelehnt.

### Option A: CodeBack Image Optimizer (empfohlen)

1. Gehe zu [codeback.de/image-optimizer](https://codeback.de/image-optimizer)
2. Lade dein Bild hoch
3. Fülle mindestens das Feld "Autor" aus
4. Klicke "Optimieren & Herunterladen"

### Option B: Eigenes Tool

Bette XMP-Metadaten mit deinem bevorzugten Tool ein (Lightroom, ExifTool, etc.):

```bash
# Mit ExifTool
exiftool -XMP:Creator="Dein Name" bild.jpg
```

## Bild signieren

### Web-Interface

1. Gehe zu [visionfusen.org/tools/sign](https://visionfusen.org/tools/sign)
2. Wähle "Browser Extension (NIP-07)" oder "VisionFusen Zeitstempel"
3. Lade dein Bild hoch
4. Klicke "Signieren"

### Via API

```bash
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -F "image=@mein-bild.webp"
```

Antwort:
```json
{
  "success": true,
  "hash": "cd4efae6...",
  "urls": {
    "image": "https://cdn.visionfusen.org/images/...",
    "verify": "https://visionfusen.org/verify?hash=cd4efae6..."
  }
}
```

## Signatur verifizieren

Jeder kann die Signatur prüfen:

```bash
curl "https://visionfusen.org/api/verify?hash=cd4efae6..."
```

Oder via Web: [visionfusen.org/verify](https://visionfusen.org/verify)
