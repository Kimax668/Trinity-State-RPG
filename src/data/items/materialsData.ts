
import { Item } from '../../types/game';

// Materials
export const materialsData: Record<string, Item> = {
  "spinnenfaden": {
    name: "Spinnenfaden",
    beschreibung: "Seltenes Material aus Spinnenseide",
    boni: {},
    preis: 15,
    verkaufspreis: 8,
    verkaufbar: true,
    typ: "material"
  },
  "wolfsfell": {
    name: "Wolfsfell",
    beschreibung: "Dickes, warmes Fell eines Wolfes",
    boni: {},
    preis: 20,
    verkaufspreis: 10,
    verkaufbar: true,
    typ: "material"
  },
  "drachenschuppe": {
    name: "Drachenschuppe",
    beschreibung: "Glänzende Schuppe eines Drachen",
    boni: {},
    preis: 100,
    verkaufspreis: 50,
    verkaufbar: true,
    typ: "material"
  }
};
