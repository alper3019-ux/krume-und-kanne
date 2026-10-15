# Changelog

## 15.10.2026 – Layout-Shift mobil behoben (Wochenrunde)

### Geändert
- **Klasse `js` wird per Inline-Skript im `<head>` gesetzt** (alle 6 HTML-Seiten), statt erst im Modul `main.js`.
  - Ursache (per Lighthouse-Diagnose `layout-shifts` und `long-tasks` belegt): Die Regel `.js .nav-toggle + .nav:not(.is-open) { display: none; }` klappt die mobile Navigation erst ein, wenn das Modul läuft. Lief das Modul nach dem ersten Paint, schrumpfte der Header, und `main#inhalt` sprang nach oben: live mobil CLS 0,307 in 2 von 5 Läufen, lokal in 1 von 5. Lief es vor dem Paint, fiel stattdessen ein langer Task von 914–916 ms in `main-*.js` nach dem FCP an (TBT 250–325 ms).
  - Quellen: https://web.dev/articles/cls · https://web.dev/articles/optimize-cls · https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script (Module-Skripte laufen verzögert)
- **Desktop-CLS 0,135 (Hero-SVG, 14.10.):** Am 15.10. trat er weder live (5/5 Läufe CLS ≤ 0,011) noch lokal (10/10) auf, mit verzögerten Schriften, CPU-Drosselung und Lighthouse-CLI gezielt nachgestellt. Die Spaltenbreiten des Hero-Grids und die SVG-Box sind mit Webfont und Fallback identisch. Eine Ursache ist damit nicht belegbar, deshalb keine Änderung dafür.

### Messung
Methode: Lighthouse 13 (Node-API, Headless Chrome), mobil = Standardprofil, Desktop = `desktop-config`; **je 5 Läufe**, Median; lokal Vorher/Nachher abwechselnd (Vorher = Build `main@a7ab37b`). axe-core 4.14 nach Scroll, Konsolen- und HTTP-Fehler per Playwright.

| | Perf | A11y | BP | SEO | LCP | CLS | TBT | axe | Konsolenfehler |
|---|---|---|---|---|---|---|---|---|---|
| live vorher mobil (15.10.) | 83 | 100 | 100 | 100 | 2595 ms | 0 (Läufe: 0,307 ×2) | 250 ms | 0 | 0 |
| live vorher Desktop | 99 | 100 | 100 | 100 | 672 ms | 0,002 | 15 ms | 0 | 0 |
| lokal vorher mobil | 97 | 100 | 100 | 100 | 1971 ms | 0,001 (Läufe: 0,307 ×1) | 0 ms | 0 | 0 |
| lokal nachher mobil | 98 | 100 | 100 | 100 | 1972 ms | 0,001 (max. 0,001) | 0 ms | 0 | 0 |
| lokal vorher Desktop | 100 | 100 | 100 | 100 | 457 ms | 0,002 | 0 ms | 0 | 0 |
| lokal nachher Desktop | 100 | 100 | 100 | 100 | 459 ms | 0,002 | 0 ms | 0 | 0 |

LCP lokal +1–2 ms liegt unter der Messauflösung der Einzelläufe (Streuung ±10 ms).

## 1.0.0 – 09.10.2026

Erste veröffentlichte Fassung.

- Startseite mit Live-Status „geöffnet/geschlossen“ (Europe/Berlin), Mittagstisch der Woche (KW automatisch), Speisekarte, Kuchen-Vorbestellung, Geschichte, Anfahrt, Catering-Anfrage.
- Eigene SVG-Illustrationen (Hero, Ofen, Sauerteig-Glas, Kanne, Schüssel, Kuchen, Wellenlinie, Logo, Lageskizze) im Risografie-Look; Linien zeichnen sich beim Scrollen (CSS Scroll-driven Animations, `animation-timeline: view()`), Fallback: fertige Zeichnung.
- Allergen-Datenmodell (14 Hauptallergene nach Anhang II LMIV, Kennbuchstaben A–N). Daraus erzeugt: Filter „ohne …“ + Ernährungsform, Legende, Kennzeichnung je Gericht, Allergen-Matrix (`allergene.html`), Allergene in der Vorbestell-Zusammenfassung.
- Filter mit View Transitions (`document.startViewTransition`, Fallback ohne Animation); seitenübergreifende View Transitions (`@view-transition`).
- Ehrliche Demo-Formulare (Vorbestellung, Catering): Validierung mit `aria-invalid`/Fehlertext/Fokus, Ergebnis „nichts gesendet, nichts gespeichert“; optional `mailto`-Modus.
- OpenStreetMap erst nach Klick (vorher keine Anfrage an Dritte).
- Impressum, Datenschutz, Bildrechte, Allergene, 404 – Platzhalter als fiktiv markiert, rechtliche Prüfung als offen gekennzeichnet.
- Performance: Stempel dreht sich mit dem Scrollen statt in Dauerschleife, Hero-Zeichnung verkürzt, Körnung als 1,3-KB-WebP statt SVG-Filter, kein `backdrop-filter`.
- Performance: `content-visibility: auto` für Karte, Mittagstisch, Vorbestellung und Geschichte (weniger Layout-Arbeit beim Laden).
- Barrierefreiheit: Demo-Hinweis als eigene Landmark (`aside`), axe 0 Verstöße auf allen Seiten.
