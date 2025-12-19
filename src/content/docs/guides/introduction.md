---
title: Einführung
description: Was ist VisionFusen und warum brauchst du es?
---

# Willkommen bei VisionFusen

**VisionFusen** ist ein Service für kryptografische Urheberschaftsnachweise von Bildern.

## Das Problem

Du erstellst Bilder, Fotos, Grafiken. Im Internet werden sie geteilt, kopiert, verändert. Wer hat das Original erstellt? Wann wurde es erstellt? 

Klassische Lösungen wie Wasserzeichen sind leicht zu entfernen. Metadaten können manipuliert werden. Zentrale Register können verschwinden.

## Die Lösung: Dezentrale Signierung

VisionFusen signiert deine Bilder kryptografisch auf dem **Nostr-Protokoll**:

1. **Unveränderlich** - Einmal signiert, immer nachweisbar
2. **Dezentral** - Keine zentrale Instanz kann es löschen
3. **Offen** - Jeder kann die Signatur prüfen
4. **Standardisiert** - NIP-94 ist ein offener Standard

## Was passiert beim Signieren?

```
Bild → Hash berechnen → NIP-94 Event erstellen → Signieren → Auf Nostr publishen
```

Das Ergebnis:

- **SHA-256 Hash** - Eindeutige Identifikation deines Bildes
- **Nostr Event** - Unveränderlicher Eintrag auf dem dezentralen Netzwerk
- **Kryptografische Signatur** - Beweis, dass DU es signiert hast
- **Timestamp** - Nachweis, WANN es signiert wurde

## Für wen ist VisionFusen?

- **Fotografen** - Beweise deine Urheberschaft
- **Designer** - Schütze deine Grafiken
- **KI-Künstler** - Dokumentiere deine Prompts und Ergebnisse
- **Content Creator** - Sichere deine Original-Inhalte
- **Coaches & Consultants** - Signiere Präsentationen und Materialien
