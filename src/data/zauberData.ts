
import { ZauberDefinition } from '../types/game';

export const zauberDefinitionen: Record<string, ZauberDefinition> = {
  "Feuerball": {
    name: "Feuerball",
    beschreibung: "Ein mächtiger Feuerzauber, der den Gegner verbrennt",
    schaden: 10,
    schadenFaktor: 1.2,
    statusEffekt: "Brennen",
    statusDauer: 3
  },
  "Eisstrahl": {
    name: "Eisstrahl",
    beschreibung: "Ein kalter Eisstrahl, der den Gegner verlangsamt",
    schaden: 8,
    schadenFaktor: 1.0,
    statusEffekt: "Gefroren",
    statusDauer: 2
  },
  "Heilung": {
    name: "Heilung",
    beschreibung: "Heilt einen Teil der verlorenen Lebenspunkte",
    heilung: 15,
    heilungFaktor: 1.5
  },
  "Blitz": {
    name: "Blitz",
    beschreibung: "Ein schneller Blitzschlag mit hohem Schaden",
    schaden: 15,
    schadenFaktor: 1.0
  },
  "Lebensraub": {
    name: "Lebensraub",
    beschreibung: "Stiehlt Leben vom Gegner",
    schaden: 8,
    schadenFaktor: 0.8,
    heilung: 4,
    heilungFaktor: 0.4
  },
  "Betäubung": {
    name: "Betäubung",
    beschreibung: "Betäubt den Gegner für eine Runde",
    schaden: 5,
    schadenFaktor: 0.5,
    statusEffekt: "Betäubt",
    statusDauer: 1
  }
};

export default zauberDefinitionen;
