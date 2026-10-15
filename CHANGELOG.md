# Changelog

## 15.10.2026 – Wieder eingespielt: Inline-Skript für Klasse `js` (Freigabe durch Miguel)

- Miguel hat am 15.10.2026 ausdrücklich freigegeben, die Änderung trotz der knappen, vermutlich zufälligen Abweichung live zu stellen. Nach dem Revert lag die Live-TBT mobil ebenfalls bei 325 ms, die Abweichung kam also nicht von der Änderung.
- Änderung: `<script>document.documentElement.classList.add('js')</script>` im `<head>` aller 6 Seiten. Die mobile Navigation ist damit schon vor dem ersten Paint eingeklappt, und der Inhalt springt nicht mehr (vorher CLS 0,307 in 2 von 5 Live-Läufen).
- Quellen: https://web.dev/articles/optimize-cls · https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- Abbruchregel laut Freigabe: zurücknehmen nur bei Defekt (Konsolenfehler, axe-Verstoß, Funktion) oder bei deutlicher Verschlechterung (Perf > 3 Punkte, LCP/TBT > 100 ms).

## 15.10.2026 – Zurückgenommen: Inline-Skript für Klasse `js`

Live-Nachmessung nach dem Deploy (je 5 Läufe): Die CLS-Ausreißer 0,307 sind weg (0 von 5 statt 2 von 5), Perf mobil 83 → 85. Im Median ist aber TBT mobil schlechter (250 → 325 ms), weil jetzt jeder Lauf den langen Task von 604–928 ms in `main-*.js` nach dem FCP hat, und LCP mobil ebenfalls (2595 → 2605 ms). Nach der Regel „nichts darf schlechter werden“ per Revert-Commit zurückgenommen. Befund zur Ursache, weiter gültig: Die Regel `.js .nav-toggle + .nav:not(.is-open) { display: none; }` klappt die mobile Navigation erst ein, wenn das Modul `main.js` läuft. Lief es nach dem ersten Paint, sprang `main#inhalt` (CLS 0,307). Der Desktop-CLS 0,135 vom 14.10. war am 15.10. nicht reproduzierbar (live 5/5 und lokal 10/10 ≤ 0,011). Lokale Messwerte und Methode stehen in Commit d96ab24.

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
