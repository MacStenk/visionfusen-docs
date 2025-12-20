---
title: NIP-94 erklärt
description: Was ist NIP-94 und wie funktioniert es?
---

**NIP-94** ist ein Nostr Improvement Proposal für Datei-Metadaten.

## Event Struktur

Ein NIP-94 Event hat **Kind 1063**:

```json
{
  "kind": 1063,
  "content": "Beschreibung des Bildes",
  "tags": [
    ["url", "https://cdn.example.com/bild.webp"],
    ["m", "image/webp"],
    ["x", "cd4efae6..."],
    ["size", "245760"],
    ["dim", "1920x1080"],
    ["title", "Sonnenuntergang"],
    ["author", "Steven Noack"]
  ],
  "pubkey": "abc123...",
  "created_at": 1703001234,
  "sig": "def456..."
}
```

## Pflicht-Tags

| Tag | Beschreibung |
|-----|--------------|
| `url` | URL zur Datei |
| `m` | MIME Type |
| `x` | SHA-256 Hash |

## Optionale Tags

| Tag | Beschreibung |
|-----|--------------|
| `size` | Dateigröße in Bytes |
| `dim` | Dimensionen |
| `title` | Titel |
| `author` | Autor |

## VisionFusen Erweiterungen

```json
["signed_by", "VisionFusen"],
["signed_by_url", "https://visionfusen.org"]
```

## Weiterführende Links

- [NIP-94 Spezifikation](https://github.com/nostr-protocol/nips/blob/master/94.md)
