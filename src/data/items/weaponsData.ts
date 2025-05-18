
import { Item } from '../../types/game';

// Weapons
export const weaponsData: Record<string, Item> = {
  "holzschwert": {
    name: "Holzschwert",
    beschreibung: "Ein einfaches Übungsschwert",
    boni: {"staerke": 2},
    preis: 10,
    verkaufspreis: 5,
    verkaufbar: true,
    typ: "waffe"
  },
  "eisenschwert": {
    name: "Eisenschwert",
    beschreibung: "Ein solides Schwert",
    boni: {"staerke": 5},
    preis: 30,
    verkaufspreis: 15,
    verkaufbar: true,
    typ: "waffe"
  },
  "giftschwert": {
    name: "Vergiftetes Schwert",
    beschreibung: "Vergiftet Gegner",
    boni: {"staerke": 7, "statusSchaden": 3},
    faehigkeit: "vergiften",
    statusEffekt: "Vergiftet",
    statusDauer: 3,
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 3
  },
  "flammenstab": {
    name: "Flammenstab",
    beschreibung: "Verursacht Feuerschaden und ermöglicht Feuerball-Zauber",
    boni: {"intelligenz": 7, "statusSchaden": 5},
    faehigkeit: "feuerschaden",
    statusEffekt: "Brennen",
    statusDauer: 3,
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 5,
    spellGranted: "Feuerball"
  },
  "frostwand": {
    name: "Frostwand",
    beschreibung: "Ein magischer Stab mit eisiger Kraft, ermöglicht Eiszapfen-Zauber",
    boni: {"intelligenz": 6, "statusSchaden": 4},
    faehigkeit: "eisschaden",
    statusEffekt: "Gefroren", 
    statusDauer: 2,
    preis: 60,
    verkaufspreis: 30,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 8,
    spellGranted: "Eiszapfen"
  },
  "lebensraeuber": {
    name: "Lebensräuber",
    beschreibung: "Ein Schwert, das deinem Gegner Leben stiehlt",
    boni: {"staerke": 6},
    faehigkeit: "lebensraub",
    preis: 65,
    verkaufspreis: 32,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 10
  },
  "betaeubungskeule": {
    name: "Betäubungskeule",
    beschreibung: "Kann den Gegner betäuben",
    boni: {"staerke": 5, "statusSchaden": 2},
    faehigkeit: "betaeubung",
    statusEffekt: "Betäubt",
    statusDauer: 1,
    preis: 55,
    verkaufspreis: 27,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 7
  },
  "zauberbuch": {
    name: "Zauberbuch",
    beschreibung: "Erhöht Intelligenz und gewährt den Arkaner Schuss-Zauber",
    boni: {"intelligenz": 3},
    preis: 40,
    verkaufspreis: 20,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 4,
    spellGranted: "Arkaner Schuss"
  },
  "magischer_bogen": {
    name: "Magischer Bogen",
    beschreibung: "Ein verzauberter Bogen",
    boni: {"staerke": 6, "ausweichen": 2},
    faehigkeit: "fernkampf",
    preis: 60,
    verkaufspreis: 30,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 9
  },
  "kristallstab": {
    name: "Kristallstab",
    beschreibung: "Erhöht magische Kräfte und gewährt den Energiestoß-Zauber",
    boni: {"intelligenz": 8},
    faehigkeit: "magieboost",
    preis: 70,
    verkaufspreis: 35,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 12,
    spellGranted: "Energiestoß"
  },
  "drachenzahn": {
    name: "Drachenzahn",
    beschreibung: "Ein scharfer Zahn eines erlegten Drachen, gewährt den Drachenatem-Zauber",
    boni: {"staerke": 12, "statusSchaden": 8},
    faehigkeit: "feuerschaden",
    statusEffekt: "Brennen",
    statusDauer: 4,
    preis: 200,
    verkaufspreis: 100,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 15,
    spellGranted: "Drachenatem"
  }
};
