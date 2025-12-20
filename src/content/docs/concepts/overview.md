---
title: Konzepte
description: Grundlegende Konzepte hinter VisionFusen
---

Verstehe die Bausteine, auf denen VisionFusen aufbaut.

## Das große Bild

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Dein      │    │   SHA-256   │    │   NIP-94    │    │   Nostr     │
│   Bild      │ → │   Hash      │ → │   Event     │ → │   Relays    │
│   + XMP     │    │             │    │   Kind 1063 │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Die Bausteine

### 1. XMP Metadaten

Strukturierte Daten IN deinem Bild. VisionFusen liest:
- **dc:creator** (Autor) - PFLICHT
- **dc:title** (Titel)
- **dc:description** (Beschreibung)

[Mehr zu XMP Metadaten →](/concepts/xmp-metadata/)

### 2. SHA-256 Hash

Ein 64-Zeichen "Fingerabdruck" deines Bildes:
```
cd4efae6a87d2c4b8f9e3a7b1c5d2e4f6a8b0c3d5e7f9a1b3c5d7e9f1a3b5c7d
```

[Mehr zu Hash & Signatur →](/concepts/hash-signature/)

### 3. NIP-94 Event

Ein standardisiertes Nostr Event (Kind 1063) mit allen Metadaten.

[Mehr zu NIP-94 →](/concepts/nip94/)

### 4. Nostr Relays

Dezentrale Server, die Events speichern und verteilen.
