# Hindi Trainer

Eine statische, installierbare Progressive Web App (PWA) für strukturiertes Hindi-Lernen auf iPhone, iPad und Mac.

## Funktionen

- 8 strukturierte Lektionen mit Grammatik, Beispielsätzen und Dialogen
- Deutsch ↔ Hindi mit Devanagari und optionaler Umschrift
- Spaced Repetition mit **Nochmal / Schwer / Gut / Leicht**
- lokaler Lernstand in IndexedDB
- JSON-Backup und Wiederherstellung, z. B. über iCloud Drive
- Offline-Nutzung über Service Worker
- Hindi-Sprachausgabe über die Systemstimme, falls `hi-IN` verfügbar ist
- auswählbare Kartenrichtung und Sprecher-Geschlecht für ausgewählte Formen
- keine Accounts, keine Werbung, kein Tracking, kein Backend

## GitHub Pages

Das Projekt braucht keinen Build-Schritt. In GitHub unter **Settings → Pages** als Quelle **Deploy from a branch** wählen, Branch `main`, Ordner `/ (root)`. Danach ist die App unter der GitHub-Pages-URL des Repositories erreichbar.

Auf iPhone/iPad in Safari: **Teilen → Zum Home-Bildschirm**.

## Lokale Entwicklung

Die App nutzt ES-Module und sollte über einen kleinen HTTP-Server geöffnet werden, nicht direkt als `file://`.

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen.

## Architektur

- `index.html` – App-Shell
- `styles.css` – responsive iOS-orientierte Oberfläche
- `app.js` – Navigation, Rendering, Lernfluss, Backup, TTS
- `db.js` – IndexedDB-Abstraktion
- `srs.js` – SRS-Planung
- `data/content.js` – Lektionen und Karten
- `sw.js` – Offline-Cache
- `manifest.webmanifest` – PWA-Metadaten
- `CLAUDE.md` – Arbeitsregeln für Claude Code

## Datenschutz

Alle persönlichen Lerndaten bleiben standardmäßig lokal im Browser/Web-App-Speicher des jeweiligen Geräts. Das Repository enthält nur die Kursinhalte und den Programmcode.
