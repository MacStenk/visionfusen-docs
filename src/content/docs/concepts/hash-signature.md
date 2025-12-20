---
title: Hash & Signatur
description: Kryptografische Grundlagen von VisionFusen
---

VisionFusen nutzt zwei kryptografische Konzepte.

## SHA-256 Hash

Ein "digitaler Fingerabdruck" einer Datei:

```
Eingabe: Bild (beliebige Größe)
    ↓
SHA-256
    ↓
Ausgabe: cd4efae6a87d2c4b8f9e3a7b1c5d2e4f6a8b0c3d5e7f9a1b3c5d7e9f1a3b5c7d
         (immer 64 Zeichen)
```

### Eigenschaften

| Eigenschaft | Bedeutung |
|-------------|-----------|
| **Deterministisch** | Gleiche Eingabe → gleicher Hash |
| **Einweg** | Aus Hash kann Bild nicht rekonstruiert werden |
| **Lawineneffekt** | Kleinste Änderung → komplett anderer Hash |

## Digitale Signatur

Nostr nutzt **Schnorr-Signaturen**:

```
Private Key (geheim)        Public Key (öffentlich)
        nsec1...       →           npub1...
             ↓                        ↓
      Zum Signieren            Zur Verifikation
```

### Signatur-Prozess

1. Event erstellen (ohne sig)
2. Event ID berechnen = SHA-256 von Event-Daten
3. Event ID signieren mit Private Key
4. Signatur an Event anhängen

## In VisionFusen

Das **Nostr Event** wird signiert, nicht das Bild direkt:

```json
{
  "kind": 1063,
  "tags": [["x", "cd4efae6..."]],  // ← Hash des Bildes
  "sig": "def456..."               // ← Signatur des Events
}
```
