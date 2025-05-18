
import { Item } from '../../types/game';

// Accessories
export const accessoryData: Record<string, Item> = {
  "glücksanhänger": {
    name: "Glücksanhänger",
    beschreibung: "Bringt seinem Träger Glück",
    boni: {"ausweichen": 3},
    preis: 35,
    verkaufspreis: 17,
    verkaufbar: true,
    typ: "accessoire"
  },
  "stärkering": {
    name: "Stärkering",
    beschreibung: "Verstärkt physische Kraft",
    boni: {"staerke": 2},
    preis: 45,
    verkaufspreis: 22,
    verkaufbar: true,
    typ: "accessoire",
    minLevel: 4
  },
  "magieamulett": {
    name: "Magieamulett",
    beschreibung: "Verstärkt magische Fähigkeiten und gewährt den Manaregeneration-Zauber",
    boni: {"intelligenz": 2},
    preis: 45,
    verkaufspreis: 22,
    verkaufbar: true,
    typ: "accessoire",
    minLevel: 4
  },
  "verteidigungsamulett": {
    name: "Verteidigungsamulett",
    beschreibung: "Erhöht die Verteidigung",
    boni: {"verteidigung": 3},
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "accessoire",
    minLevel: 6
  },
  "meisteramulett": {
    name: "Meisteramulett",
    beschreibung: "Legendäres Amulett eines großen Zauberers, gewährt den Zeitstillstand-Zauber",
    boni: {"intelligenz": 5, "ausweichen": 3, "verteidigung": 2},
    preis: 250,
    verkaufspreis: 125,
    verkaufbar: true,
    typ: "accessoire",
    minLevel: 15,
    spellGranted: "Zeitstillstand"
  }
};
