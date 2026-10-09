# Krume & Kanne – Demo-Website für ein Café mit Bäckerei in Leipzig

> **Fiktives Projekt.** Café, Inhaber, Adresse, Preise, Öffnungszeiten, Gerichte und Kontaktdaten sind erfunden.
> Die Fotos sind frei lizenzierte Musterbilder von Wikimedia Commons und zeigen nicht das Café.
> Impressum, Datenschutz und Allergenangaben sind Platzhalter – **vor echtem Einsatz rechtlich prüfen lassen.**

**Live:** https://alper3019-ux.github.io/krume-und-kanne/

Eine verkaufsfertige Vorlage für ein Café mit eigener Backstube: warm, handgezeichnet, ohne Stockfoto-Optik.
Alle Illustrationen sind eigene SVG-Zeichnungen (Linien + versetzte Farbflächen im Risografie-Look) – kein 3D, kein WebGL.

| Desktop | Mobil |
| --- | --- |
| ![Hero](screens/desktop-hero.png) | ![Hero mobil](screens/mobile-hero.png) |
| ![Linien zeichnen sich beim Scrollen](screens/desktop-signatur-zeichnen.png) | ![Karte mobil](screens/mobile-karte.png) |
| ![Allergenfilter](screens/desktop-allergenfilter.png) | ![Signatur mobil](screens/mobile-signatur.png) |

## Was drin ist

- **Hero mit Live-Status:** „Jetzt geöffnet · bis 18:00 Uhr“ bzw. „Geschlossen · öffnet morgen 7:30 Uhr“, berechnet in Europe/Berlin (`Intl.DateTimeFormat`), minütlich aktualisiert. Daneben der Mittagstisch von heute und die aktuelle Kalenderwoche (ISO-KW).
- **Signatur – Zeichnen beim Scrollen:** Die SVG-Linien (`pathLength="1"`) zeichnen sich über `stroke-dashoffset` mit CSS Scroll-driven Animations (`animation-timeline: view()`), die Farbflächen blenden versetzt ein. Ohne Unterstützung oder bei „Bewegung reduzieren“: fertige, statische Zeichnung. Der Stempel im Hero dreht sich mit dem Scrollen (`scroll(root)`), nicht in Dauerschleife.
- **Speisekarte mit Allergenfilter:** 23 Gerichte in 5 Kategorien, serverseitig (beim Build) als HTML vorgerendert – funktioniert ohne JavaScript und ist für Suchmaschinen lesbar. Filter nach Ernährungsform und „ohne Gluten/Milch/Ei/Schalenfrüchte/Sesam …“ (alle 14 Allergene), Live-Zähler, Wechsel per View Transition.
- **Allergene nach LMIV/LMIDV:** Ein Datenmodell (Gericht → Kennbuchstaben A–N der 14 Hauptallergene, Anhang II LMIV) erzeugt Filter, Legende, Fußnoten an jedem Gericht, die Matrix auf `allergene.html` und die Allergene in der Vorbestellung. Hinweis zu Spuren; nichts wird als „glutenfrei“ beworben.
- **Mittagstisch:** Di–Fr, heutiger Tag hervorgehoben, Tafel-Optik.
- **Kuchen vorbestellen (Demo):** Blech/halbes Blech/Torte, Anzahl, Abholtag (frühestens übermorgen, montags geschlossen → wird abgelehnt), Uhrzeit, Live-Zusammenfassung mit Preis und Allergenen. Aus der Speisekarte heraus vorbelegbar („Als ganzes Blech vorbestellen“).
- **Geschichte:** drei illustrierte Kapitel + zwei Musterfotos.
- **Anfahrt/Öffnungszeiten:** Tabelle mit heutigem Tag, eigene Lageskizze; OpenStreetMap wird **erst nach Klick** geladen (vorher keine Anfrage an Dritte).
- **Catering-Anfrage (Demo):** Anlass, Datum, Personen (10–120), Ernährungswünsche, Nachricht.
- **Ehrliche Formulare:** Kein vorgetäuschter Versand. Ergebnis: „Demo-Modus: Es wurde nichts gesendet und nichts gespeichert“. Barrierefreie Validierung (`aria-invalid`, Fehlertext per `aria-describedby`, Fokus aufs erste Fehlerfeld). Über `VITE_FORM_MODE=mailto` auf E-Mail-Programm umschaltbar.
- **Seitenübergreifende View Transitions** (`@view-transition { navigation: auto; }`), Kopfzeile bleibt stehen.
- **Rechtliches:** Impressum (§ 5 DDG, Platzhalter), Datenschutz (Hosting GitHub Pages, keine Cookies, Karte nach Klick), Bildrechte, Allergene, 404 („Hier ist nur Krume.“).

## Technik

Vite 8 · Vanilla JS/CSS · kein Framework, kein GSAP (nicht nötig) · selbst gehostete Schriften (Fraunces, Figtree, Caveat – SIL OFL, auf Latein-Zeichen reduziert).

```bash
npm install
npm run dev                       # http://localhost:47110/krume-und-kanne/
npm run build                     # dist/
BASE=/krume-und-kanne node scripts/serve-dist.mjs dist 47111   # wie Produktion (Brotli)
npm run audit -- <url> reports/<name> 5    # Lighthouse mobil+desktop (Median) + axe
node scripts/axe-pages.mjs <url> <datei>   # axe auf den Unterseiten
URL=<url> node scripts/interaction-test.mjs
npm run screenshots               # screens/
bash scripts/deploy-gh-pages.sh   # Build + normaler Push auf Branch gh-pages
```

Inhalte: `src/data/menu.js` (Gerichte, Preise, Allergene, Mittagstisch, Öffnungszeiten). Daraus rendert `vite.config.js` beim Build Karte, Legende, Matrix, Mittagstisch, Kuchenauswahl und Öffnungszeiten in die Seiten.
Konfiguration über `.env`: `VITE_BASE`, `VITE_SITE_URL`, `VITE_FORM_MODE` (`demo` | `mailto`), `VITE_CONTACT_EMAIL`.
Fotos: `scripts/process-photos.mjs` (Original → AVIF + WebP, Zuschnitt), Nachweise in `photos/sources.json` → `bildrechte.html`.

## Messwerte

<!--MESSWERTE-->

## Recherche – genutzte Quellen (alle geöffnet)

X-Posts dienten nur als Hinweise; geprüft wurde über die verlinkten Seiten.

- Webflow – Web Design Trends 2026 (Kunst und Interface verschmelzen, knappe Texte): https://webflow.com/blog/web-design-trends-2026
- Codrops – „Ten Years Away“, interaktiver Comic für Studio375 (08.07.2026) und die Seite selbst: https://tympanus.net/codrops/2026/07/08/ten-years-away-designing-an-interactive-comic-for-studio375s-tenth-anniversary/ · https://ten.375.studio/en – übernommen wurde nur die illustrative Haltung, nicht die WebGL-Technik.
- Codrops – Goodside / Henri & Hélène (05.10.2026; handgezeichnete Illustration auf Karte, Streichholzbriefen, Druck): https://tympanus.net/codrops/2026/10/05/goodside/ · Hinweis: https://x.com/codrops/status/2107035369774489675
- web.dev – Interop 2026 (Scroll-driven Animations und View Transitions als Schwerpunkte): https://web.dev/blog/interop-2026
- MeasuringU – UX von Restaurant-Websites (Bestellen und Speisekarte sind die häufigsten Aufgaben; klare Kategorien): https://measuringu.com/ux-restaurant/ → deshalb Karte weit oben und „vorbestellen“ direkt aus der Karte.
- § 4 LMIDV (Allergeninformation bei loser Ware, vor Kaufabschluss, auch elektronisch, Fußnoten bei deutlichem Hinweis): https://www.gesetze-im-internet.de/lmidv/__4.html
- BMLEH – Allergenkennzeichnung (14 Hauptallergene, Pflicht auch bei loser Ware): https://www.bmleh.de/DE/themen/ernaehrung/lebensmittel-kennzeichnung/pflichtangaben/allergenkennzeichnung.html

## Bildrechte

Alle Fotos stammen von Wikimedia Commons, werden selbst gehostet und sind nur zugeschnitten/skaliert:

| Motiv | Urheber | Lizenz |
| --- | --- | --- |
| Sauerteigbrot | Nutrition, Food Safety & Health | CC0 |
| Kaffee mit Sahne | karl chor | CC0 |
| Streuselkuchen | Anja Osenberg | CC0 |
| Bienenstich | Alice Wiegand | CC BY-SA 4.0 |
| Pflaumenkuchen | Benreis | CC BY 3.0 |
| Käsekuchen (Pistazie) | Andy Li | CC0 |

Vollständige Nachweise mit Links: `bildrechte.html` bzw. `photos/sources.json`. Schriften: SIL Open Font License (Lizenztexte in `src/assets/fonts/`).

## Grenzen / offen

- Fiktive Inhalte; Allergenangaben sind Beispiele und müssen für echte Rezepturen von der Küche gepflegt und geprüft werden.
- Impressum/Datenschutz sind Platzhalter, keine Rechtsberatung – rechtliche Prüfung erforderlich.
- Formulare senden nichts (Demo) bzw. öffnen nur das E-Mail-Programm (`mailto`); für echten Betrieb braucht es ein Backend/Formular-Dienst inkl. Datenschutzhinweis.
- Feiertage sind in den Öffnungszeiten nicht berücksichtigt.
- Browser ohne Scroll-driven Animations (derzeit u. a. Firefox ohne Flag) zeigen die fertige Zeichnung (Fallback).
