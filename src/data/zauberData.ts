
import { ZauberDefinition } from '../types/game';

const zauberDefinitionen: Record<string, ZauberDefinition> = {
  "Feuerball": {
    name: "Feuerball",
    beschreibung: "Wirft einen Feuerball, der dem Gegner Schaden zufügt",
    schaden: 15,
    schadenFaktor: 0.5,
    statusEffekt: "Brennen",
    statusDauer: 3,
    minLevel: 1
  },
  "Eisstrahl": {
    name: "Eisstrahl",
    beschreibung: "Schießt einen Strahl aus Eis, der den Gegner einfriert",
    schaden: 12,
    schadenFaktor: 0.4,
    statusEffekt: "Gefroren",
    statusDauer: 2,
    minLevel: 3
  },
  "Heilung": {
    name: "Heilung",
    beschreibung: "Heilt deine Wunden",
    heilung: 20,
    heilungFaktor: 0.6,
    minLevel: 2
  },
  "Blitz": {
    name: "Blitz",
    beschreibung: "Ruft einen Blitz herbei, der hohen Schaden verursacht",
    schaden: 20,
    schadenFaktor: 0.6,
    minLevel: 5
  },
  "Feuersturm": {
    name: "Feuersturm",
    beschreibung: "Beschwört einen Sturm aus Feuer, der enormen Schaden anrichtet",
    schaden: 30,
    schadenFaktor: 0.8,
    statusEffekt: "Brennen",
    statusDauer: 3,
    minLevel: 8
  },
  "Frostnova": {
    name: "Frostnova",
    beschreibung: "Entfesselt eine Nova aus Frost, die Gegner stark verlangsamt",
    schaden: 25,
    schadenFaktor: 0.7,
    statusEffekt: "Gefroren",
    statusDauer: 3,
    minLevel: 10
  },
  "Betäubungszauber": {
    name: "Betäubungszauber",
    beschreibung: "Betäubt den Gegner für eine Runde",
    schaden: 5,
    schadenFaktor: 0.2,
    statusEffekt: "Betäubt",
    statusDauer: 1,
    minLevel: 7
  },
  "Lebensdiebstahl": {
    name: "Lebensdiebstahl",
    beschreibung: "Stiehlt Leben vom Gegner und heilt dich",
    schaden: 15,
    schadenFaktor: 0.4,
    heilung: 10,
    heilungFaktor: 0.3,
    minLevel: 12
  },
  "Göttliche Heilung": {
    name: "Göttliche Heilung",
    beschreibung: "Mächtige Heilung, die einen Großteil deiner Lebenspunkte wiederherstellt",
    heilung: 50,
    heilungFaktor: 1.0,
    minLevel: 15
  }
};

export default zauberDefinitionen;
