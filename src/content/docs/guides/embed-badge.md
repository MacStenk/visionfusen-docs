---
title: Badge einbinden
description: Zeige die Verifizierung auf deiner Website
---

Zeige Besuchern, dass dein Bild verifiziert ist.

## Dynamisches Badge

Das Badge wird live generiert und zeigt aktuellen Status:

### HTML

```html
<img 
  src="https://visionfusen.org/api/badge?hash=cd4efae6..." 
  alt="NIP-94 Verified"
  height="20"
>
```

### Mit Link zum Event

```html
<a href="https://njump.me/EVENT_ID" target="_blank" rel="noopener">
  <img 
    src="https://visionfusen.org/api/badge?hash=cd4efae6..." 
    alt="NIP-94 Verified"
    height="20"
  >
</a>
```

### Markdown

```markdown
[![NIP-94 Verified](https://visionfusen.org/api/badge?hash=cd4efae6...)](https://njump.me/EVENT_ID)
```

## Badge-Parameter

| Parameter | Beschreibung |
|-----------|--------------|
| `hash` | SHA-256 Hash des Bildes |
| `event` | Nostr Event ID |
| `url` | Bild-URL (Hash wird berechnet) |

## Badge-Styles

| Status | Farbe | Text |
|--------|-------|------|
| Verifiziert | 🟢 Grün | Autor/Datum ✓ |
| Nicht verifiziert | 🟡 Orange | not verified |
| Fehler | 🔴 Rot | error |

## Embed-Code aus API

Die Verify-API liefert fertigen Embed-Code:

```json
{
  "embed": {
    "html_badge": "<a href=\"...\"><img src=\"...\" alt=\"Nostr Verified\"></a>",
    "markdown": "[![Nostr Verified](...)](https://njump.me/...)"
  }
}
```
