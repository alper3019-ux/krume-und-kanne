# Changelog

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
- Barrierefreiheit: Demo-Hinweis als eigene Landmark (`aside`), axe 0 Verstöße auf allen Seiten.
