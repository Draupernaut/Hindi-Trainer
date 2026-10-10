# CLAUDE.md — Hindi Trainer

## Projektziel

Eine kleine, robuste, installierbare Hindi-Lern-PWA für Apple-Geräte. Zielgruppe ist eine deutschsprachige Lernerin bzw. ein deutschsprachiger Lerner, die/der strukturiert über Grammatik, konkrete Textbeispiele und Spaced Repetition lernt.

## Unverhandelbare Architekturregeln

1. **Kein Framework und kein Build-System**, solange nicht ausdrücklich verlangt. Vanilla HTML/CSS/JavaScript behalten.
2. **GitHub Pages muss direkt aus dem Repository funktionieren.** Alle URLs relativ halten (`./...`), damit der Repo-Unterpfad funktioniert.
3. **Kursinhalt und App-Logik trennen.** Neue Lektionen/Karten primär in `data/content.js` ergänzen.
4. **Bestehenden Lernstand niemals durch Content-Updates löschen.** SRS-Daten sind über stabile `card.id` verknüpft. IDs existierender Karten nicht ändern.
5. **Keine Cloud, Accounts, Tracker oder externen APIs** ohne ausdrückliche Entscheidung.
6. Persönliche Daten ausschließlich lokal speichern. Für Persistenz `db.js`/IndexedDB verwenden.
7. iPhone/iPad sind Primärgeräte. Touch-Ziele mindestens ca. 44 px, Safe-Area beachten, keine Hover-Abhängigkeit.
8. Barrierearm arbeiten: semantische Buttons, lesbarer Kontrast, `aria-label` wo Icons allein stehen.
9. Hindi immer in Devanagari speichern. Transliteration separat halten und abschaltbar anzeigen.
10. Sprachinhalte nicht still „kreativ verbessern“, wenn grammatische Unsicherheit besteht. Bei größeren Content-Erweiterungen Grammatik und natürliche Formulierungen fachlich prüfen.

## Datenmodell

### Lektion

`course.lessons[]` enthält:
- `id` — stabil, z. B. `L09`
- `title`
- `description`
- `grammar[]` mit `heading`, `text`
- `examples[]`: `[deutsch, hindi, transliteration, note]`
- `dialog[]`: `[speaker, hindi, transliteration, deutsch]`
- `quiz[]`: `{ q, options, answer }`

### SRS-Karte

`cards[]` enthält:
- `id` — dauerhaft stabil und eindeutig
- `lessonId`
- `german`
- `hindi`
- `transliteration`

SRS-Zustand liegt getrennt in IndexedDB unter `cardStates[card.id]`.

## SRS-Regeln

`srs.js` ist bewusst klein und verständlich. Änderungen am Algorithmus müssen:
- bestehende Zustände migrieren oder abwärtskompatibel bleiben,
- keine negativen/NaN-Intervalle erzeugen,
- die vier Bewertungen `again`, `hard`, `good`, `easy` erhalten.

## Content-Prinzipien

- Grammatik vor bloßen Wortlisten.
- Neue Wörter möglichst in natürlichen Beispielsätzen verankern.
- Alltagsnahe Chunks fördern.
- Unterschiede zwischen deutscher und Hindi-Struktur explizit erklären.
- Genus-/Kongruenzformen sichtbar machen, ohne Lernende mit Vollständigkeit zu überfahren.
- Transliteration ist Stütze, nicht Ziel; Devanagari bleibt primär.

## Vor jedem Push prüfen

- `node --check app.js db.js srs.js data/content.js sw.js`
- App über HTTP öffnen.
- Navigation: Heute → Kurs → Lektion → Wiederholen → Fortschritt → Einstellungen.
- Eine Karte bewerten, Seite neu laden, prüfen ob SRS-Zustand bleibt.
- Backup exportieren und wieder importieren.
- PWA-Pfade dürfen den GitHub-Pages-Unterpfad nicht verlassen.
- Service-Worker-Cache-Version erhöhen, wenn gecachte Assets wesentlich geändert werden.
