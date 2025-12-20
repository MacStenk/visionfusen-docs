---
title: XMP Metadaten
description: Welche Metadaten werden von VisionFusen unterstützt?
---

**XMP** (Extensible Metadata Platform) ist ein Standard zum Einbetten von Metadaten in Dateien.

## Pflichtfeld

| XMP Feld | VisionFusen Tag | Beschreibung |
|----------|-----------------|--------------|
| `dc:creator` | `author` | **PFLICHT** - Name des Erstellers |

:::caution[Autor ist Pflicht]
Ohne gültigen Autor in `dc:creator` wird die Signierung abgelehnt.
:::

## Optionale Felder

| XMP Feld | VisionFusen Tag |
|----------|-----------------|
| `dc:title` | `title` |
| `dc:description` | `content` |
| `dc:rights` | - |

## XMP einbetten

### CodeBack Image Optimizer (empfohlen)

1. Gehe zu [codeback.de/image-optimizer](https://codeback.de/image-optimizer)
2. Lade dein Bild hoch
3. Fülle die Metadaten-Felder aus
4. Klicke "Optimieren & Herunterladen"

### ExifTool (Kommandozeile)

```bash
exiftool -XMP:Creator="Dein Name" bild.jpg
```

## Ungültige Autoren

Diese Werte werden abgelehnt:

- `unknown`, `unbekannt`
- `anonymous`, `anonym`
- `ai`, `ki`, `generated`
- `test`, `example`
- Alles unter 2 Zeichen
