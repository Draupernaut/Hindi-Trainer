# Hindi Trainer

Eine statische, installierbare Progressive Web App (PWA) für strukturiertes Hindi-Lernen auf iPhone, iPad und Mac.

## Funktionen

- 24 strukturierte Lektionen in 6 Modulen mit Grammatik, Beispielsätzen, Lesetexten und Dialogen
- 240 SRS-Karten mit stabilen IDs (bestehender Lernstand bleibt updatefest)
- eigenes Devanagari-Lesemodul mit Vokalen, Matras, Konsonanten und Zeichen
- dedizierter **Devanagari-Schrifttrainer** mit Lernen, Erkennen, Nachzeichnen und freiem Schreiben
- Touch-/Apple-Pencil-/Maus-Schreibfläche mit grober Formprüfung und lokal gespeichertem Schriftfortschritt
- Deutsch ↔ Hindi mit Devanagari und optionaler Umschrift
- Spaced Repetition mit **Nochmal / Schwer / Gut / Leicht**
- lokaler Lernstand in IndexedDB
- JSON-Backup und Wiederherstellung, z. B. über iCloud Drive; Schriftfortschritt wird automatisch mitgesichert
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
- `styles.css` – responsive iOS-orientierte Basisoberfläche
- `course.css` – Modul- und Lesetextdarstellung
- `india-theme.css` – Indien-inspiriertes Farbsystem und UI-Polish
- `app.js` – Navigation, Rendering, Lernfluss, Backup, TTS
- `quality.js` – aktive Schreibübungen und Lesetext-Qualitätsfunktionen
- `script-trainer.js` – Devanagari-Schriftcurriculum, Erkennungsquiz, Canvas-Zeichnen und Fortschritt
- `script-trainer.css` – Oberfläche des Schrifttrainers
- `db.js` – IndexedDB-Abstraktion
- `srs.js` – SRS-Planung
- `data/content.js` – stabiler Basiskurs L01–L08
- `data/expanded-content.js` – rückwärtskompatible Zusammenführung von Basis + Erweiterung
- `data/curriculum.js` – Module, Alt-Lesetexte und Kursaggregation
- `data/units/u3.js` bis `u6.js` – große A1-Erweiterungsmodule
- `sw.js` – Offline-Cache
- `manifest.webmanifest` – PWA-Metadaten
- `CLAUDE.md` – Arbeitsregeln für Claude Code

## Datenschutz

Alle persönlichen Lerndaten bleiben standardmäßig lokal im Browser/Web-App-Speicher des jeweiligen Geräts. Das Repository enthält nur die Kursinhalte und den Programmcode.
