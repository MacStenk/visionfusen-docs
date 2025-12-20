---
title: Schnellstart
description: In 5 Minuten deine erste Datei signieren
---

Signiere deine erste Datei in unter 5 Minuten.

## Unterstützte Formate

| Typ | Formate | Autor-Feld |
|-----|---------|------------|
| **Bilder** | WebP, PNG, JPEG, GIF | XMP `dc:creator` |
| **Dokumente** | PDF | PDF-Info `/Author` |
| **Text** | Markdown, TXT | YAML Frontmatter `author:` |

## Voraussetzung: Autor einbetten

VisionFusen erfordert einen **Autor**. Ohne Autor wird die Signierung abgelehnt.

### Bilder: XMP-Metadaten

**Option A: CodeBack Image Optimizer (empfohlen)**

1. Gehe zu [codeback.de/image-optimizer](https://codeback.de/image-optimizer)
2. Lade dein Bild hoch
3. Fülle das Feld "Autor" aus
4. Klicke "Optimieren & Herunterladen"

**Option B: ExifTool**

```bash
exiftool -XMP:Creator="Dein Name" bild.jpg
```

### Markdown/Text: YAML Frontmatter

```markdown
---
title: Mein Dokument
author: Dein Name
description: Kurze Beschreibung
---

# Inhalt hier...
```

### PDF: Dokument-Eigenschaften

Setze den Autor in deinem PDF-Editor unter Dokument-Eigenschaften.

## Datei signieren

### Web-Interface (empfohlen)

1. Gehe zu [visionfusen.org/tools/sign](https://visionfusen.org/tools/sign)
2. Ziehe deine Datei in den Upload-Bereich
3. Prüfe die erkannten Metadaten
4. Klicke "Signieren"

Fertig! Du erhältst:
- CDN-URL deiner Datei
- Verifizierungs-Link
- LLM-optimierte Event-Page
- NIP-94 Event für Nostr

### Via API

```bash
# Bild signieren
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -F "file=@mein-bild.webp"

# Markdown signieren
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -F "file=@mein-dokument.md"

# PDF signieren
curl -X POST https://visionfusen.org/api/sign-image-v2 \
  -F "file=@mein-dokument.pdf"
```

Antwort:
```json
{
  "success": true,
  "hash": "8a97b9bedaddf...",
  "file_type": "text",
  "mime_type": "text/markdown",
  "metadata": {
    "author": "Steven Noack",
    "title": "VisionFusen - Roadmap & Ideen"
  },
  "urls": {
    "file": "https://cdn.visionfusen.org/documents/...",
    "static_page": "https://cdn.visionfusen.org/events/.../index.html",
    "verify": "https://visionfusen.org/verify?hash=8a97b9be..."
  }
}
```

## Signatur verifizieren

Jeder kann die Signatur prüfen:

```bash
curl "https://visionfusen.org/api/verify?hash=8a97b9be..."
```

Oder via Web: [visionfusen.org/verify](https://visionfusen.org/verify)

## Nächste Schritte

- [Konzepte: NIP-94](/concepts/nip94/) — Wie funktioniert die Signierung?
- [API Reference](/api/) — Vollständige API-Dokumentation
- [Badge einbetten](/guides/embed-badge/) — Verifizierungs-Badge auf deiner Seite
