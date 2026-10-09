/**
 * Datenmodell der Speisekarte (fiktiv). Gericht -> Allergen-Codes.
 * Aus diesen Daten entstehen zur Build-Zeit: Karte, Filter, Fußnoten, Legende,
 * Allergen-Matrix (allergene.html) und die Allergen-Angaben im Vorbestell-Formular.
 *
 * Allergen-Codes = die 14 Hauptallergene nach Anhang II LMIV (Reihenfolge wie dort).
 * "detail" präzisiert z. B. Getreideart oder Nussart (BMLEH: "namentlich ...").
 * Alle Preise sind erfunden (Endpreise inkl. MwSt., Demo).
 */
export const ALLERGENS = [
  { code: 'A', name: 'Glutenhaltiges Getreide', short: 'Gluten' },
  { code: 'B', name: 'Krebstiere', short: 'Krebstiere' },
  { code: 'C', name: 'Eier', short: 'Ei' },
  { code: 'D', name: 'Fisch', short: 'Fisch' },
  { code: 'E', name: 'Erdnüsse', short: 'Erdnuss' },
  { code: 'F', name: 'Soja', short: 'Soja' },
  { code: 'G', name: 'Milch (inkl. Laktose)', short: 'Milch' },
  { code: 'H', name: 'Schalenfrüchte (Nüsse)', short: 'Nüsse' },
  { code: 'I', name: 'Sellerie', short: 'Sellerie' },
  { code: 'J', name: 'Senf', short: 'Senf' },
  { code: 'K', name: 'Sesam', short: 'Sesam' },
  { code: 'L', name: 'Schwefeldioxid und Sulfite', short: 'Sulfite' },
  { code: 'M', name: 'Lupinen', short: 'Lupine' },
  { code: 'N', name: 'Weichtiere', short: 'Weichtiere' },
];

/** Schnellfilter in der Karte (Teilmenge, alle 14 stehen im ausklappbaren Feld). */
export const QUICK = ['A', 'G', 'C', 'H', 'K'];

export const CATEGORIES = [
  { id: 'fruehstueck', name: 'Frühstück', note: 'Di–Fr 7:30–11:30, Sa & So bis 13:00' },
  { id: 'brot', name: 'Brot & Gebäck', note: 'Aus der eigenen Backstube, solange der Vorrat reicht' },
  { id: 'mittag', name: 'Mittag', note: 'Di–Fr 11:30–14:30 · wechselnder Mittagstisch siehe unten' },
  { id: 'kuchen', name: 'Kuchen', note: 'Stück im Café, ganze Bleche auf Vorbestellung' },
  { id: 'getraenke', name: 'Getränke', note: 'Kaffee aus einer kleinen Rösterei (fiktiv)' },
];

/** diet: 'vegan' | 'veg' | '' */
export const DISHES = [
  { id: 'krume-fruehstueck', cat: 'fruehstueck', name: 'Krume-Frühstück', desc: 'Zwei Scheiben Sauerteigbrot, Butter, Bergkäse, Hausmarmelade, weiches Ei', price: 12.5, a: ['A', 'C', 'G'], detail: { A: 'Weizen, Roggen' }, diet: 'veg' },
  { id: 'porridge', cat: 'fruehstueck', name: 'Porridge mit Ofenapfel', desc: 'Haferflocken, Hafer­drink, Zimt, geröstete Walnüsse', price: 8.9, a: ['A', 'H'], detail: { A: 'Hafer', H: 'Walnuss' }, diet: 'vegan' },
  { id: 'shakshuka', cat: 'fruehstueck', name: 'Shakshuka', desc: 'Tomaten, Paprika, zwei Eier, Koriander, dazu Brot', price: 11.8, a: ['A', 'C', 'K'], detail: { A: 'Weizen' }, diet: 'veg' },
  { id: 'dukkah-brot', cat: 'fruehstueck', name: 'Röstbrot mit Bohnencreme & Dukkah', desc: 'Weiße Bohnen, Zitrone, Haselnuss-Sesam-Dukkah', price: 9.6, a: ['A', 'H', 'K'], detail: { A: 'Weizen, Roggen', H: 'Haselnuss' }, diet: 'vegan' },

  { id: 'laib', cat: 'brot', name: 'Krume-Laib (1 kg)', desc: 'Weizen-Roggen-Sauerteig, 36 Stunden Teigführung', price: 6.2, a: ['A'], detail: { A: 'Weizen, Roggen' }, diet: 'vegan' },
  { id: 'saaten', cat: 'brot', name: 'Roggen-Saatenbrot (750 g)', desc: 'Roggenvollkorn, Sonnenblumenkerne, Sesam, Leinsaat', price: 5.9, a: ['A', 'K'], detail: { A: 'Roggen' }, diet: 'vegan' },
  { id: 'buchweizen', cat: 'brot', name: 'Buchweizen-Hirse-Brot (500 g)', desc: 'Ohne glutenhaltige Zutaten gebacken, aber in derselben Backstube: nicht „glutenfrei“, Spuren möglich', price: 6.4, a: [], diet: 'vegan', trace: true },
  { id: 'croissant', cat: 'brot', name: 'Buttercroissant', desc: 'Drei Tage Laminieren, französische Butter', price: 2.4, a: ['A', 'C', 'G'], detail: { A: 'Weizen' }, diet: 'veg' },
  { id: 'zimtknoten', cat: 'brot', name: 'Kardamom-Zimt-Knoten', desc: 'Hefeteig, braune Butter, Kardamom', price: 3.2, a: ['A', 'C', 'G'], detail: { A: 'Weizen' }, diet: 'veg' },
  { id: 'brezel', cat: 'brot', name: 'Laugenbrezel', desc: 'Klassisch, mit grobem Salz', price: 1.6, a: ['A'], detail: { A: 'Weizen' }, diet: 'vegan' },

  { id: 'suppe', cat: 'mittag', name: 'Suppe des Tages', desc: 'Mit einer Scheibe Krume-Laib; Allergene je nach Tag am Tresen und im Mittagstisch', price: 6.9, a: ['A', 'I'], detail: { A: 'Weizen, Roggen' }, diet: 'vegan' },
  { id: 'quiche', cat: 'mittag', name: 'Quiche Lauch & Bergkäse', desc: 'Mürbeteig, Lauch, Bergkäse, grüner Salat', price: 10.4, a: ['A', 'C', 'G', 'J'], detail: { A: 'Weizen' }, diet: 'veg' },
  { id: 'linsensalat', cat: 'mittag', name: 'Linsensalat', desc: 'Belugalinsen, Ofenkürbis, Senf-Vinaigrette, Kürbiskerne', price: 9.8, a: ['J', 'L'], detail: { L: 'Weißweinessig' }, diet: 'vegan' },

  { id: 'streusel', cat: 'kuchen', name: 'Kirsch-Streuselkuchen', desc: 'Hefeteig, Sauerkirschen, Butterstreusel', price: 3.6, a: ['A', 'C', 'G'], detail: { A: 'Weizen' }, diet: 'veg', cake: { photo: 'streusel', tray: 64, half: 34, unit: 'Blech (24 Stück)' } },
  { id: 'bienenstich', cat: 'kuchen', name: 'Bienenstich', desc: 'Hefeteig, Vanillecreme, Honig-Mandel-Kruste', price: 3.9, a: ['A', 'C', 'G', 'H'], detail: { A: 'Weizen', H: 'Mandel' }, diet: 'veg', cake: { photo: 'bienenstich', tray: 72, half: 38, unit: 'Blech (24 Stück)' } },
  { id: 'pflaume', cat: 'kuchen', name: 'Pflaumenkuchen mit Streusel', desc: 'Saison: August bis Oktober, mit Sahne +0,90 €', price: 3.8, a: ['A', 'C', 'G'], detail: { A: 'Weizen' }, diet: 'veg', cake: { photo: 'pflaume', tray: 68, half: 36, unit: 'Blech (24 Stück)' } },
  { id: 'kaesekuchen', cat: 'kuchen', name: 'Pistazien-Käsekuchen', desc: 'Quark, Pistaziencreme, Mürbeboden', price: 4.4, a: ['A', 'C', 'G', 'H'], detail: { A: 'Weizen', H: 'Pistazie' }, diet: 'veg', cake: { photo: 'cheesecake', tray: 46, half: null, unit: 'Torte (Ø 26 cm, 12 Stück)' } },
  { id: 'lerche', cat: 'kuchen', name: 'Leipziger Lerche', desc: 'Mürbeteig, Marzipan, Kirsche (Leipziger Klassiker)', price: 3.4, a: ['A', 'C', 'G', 'H'], detail: { A: 'Weizen', H: 'Mandel' }, diet: 'veg' },

  { id: 'filter', cat: 'getraenke', name: 'Filterkaffee', desc: 'Handgebrüht, wechselnde Bohne', price: 3.2, a: [], diet: 'vegan' },
  { id: 'cappuccino', cat: 'getraenke', name: 'Cappuccino', desc: 'Mit Kuhmilch; Haferdrink +0,40 € (enthält Hafer: A)', price: 3.8, a: ['G'], diet: 'veg' },
  { id: 'chai', cat: 'getraenke', name: 'Chai Latte', desc: 'Hausgemachter Gewürzsirup, Milch', price: 4.2, a: ['G'], diet: 'veg' },
  { id: 'rhabarber', cat: 'getraenke', name: 'Rhabarberschorle', desc: 'Direktsaft aus Sachsen, 0,4 l', price: 3.9, a: [], diet: 'vegan' },
  { id: 'kakao', cat: 'getraenke', name: 'Heiße Schokolade', desc: '70 % Kakao, Vollmilch, Sahnehaube auf Wunsch', price: 4.4, a: ['G', 'F'], detail: { F: 'Sojalecithin in der Schokolade' }, diet: 'veg' },
];

/** Mittagstisch der Woche (Wochentag 2=Di … 5=Fr; fiktiv). */
export const LUNCH = [
  { day: 2, name: 'Rotes Linsen-Dal', desc: 'Kokos, Spinat, Limette, Fladenbrot', price: 9.8, a: ['A', 'K'], detail: { A: 'Weizen' }, diet: 'vegan' },
  { day: 3, name: 'Kartoffelsuppe „Plagwitz“', desc: 'Majoran, Röstzwiebeln, Krume-Laib', price: 8.9, a: ['A', 'I', 'G'], detail: { A: 'Weizen, Roggen' }, diet: 'veg' },
  { day: 4, name: 'Ofengemüse-Quiche', desc: 'Kürbis, Feta, Thymian, Blattsalat', price: 10.4, a: ['A', 'C', 'G', 'J'], detail: { A: 'Weizen' }, diet: 'veg' },
  { day: 5, name: 'Ofenlachs auf Linsen', desc: 'Dill-Joghurt, Zitrone, Graupen', price: 12.5, a: ['A', 'D', 'G', 'J'], detail: { A: 'Gerste' }, diet: '' },
];

/** Öffnungszeiten (fiktiv). 0=So … 6=Sa; null = Ruhetag. */
export const HOURS = {
  0: ['09:00', '15:00'], 1: null, 2: ['07:30', '18:00'], 3: ['07:30', '18:00'], 4: ['07:30', '18:00'], 5: ['07:30', '18:00'], 6: ['08:00', '17:00'],
};
export const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
