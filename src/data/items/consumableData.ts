
import { Item } from '../../types/game';

// Consumable items
export const consumableData: Record<string, Item> = {
  "heiltrank": {
    name: "Heiltrank",
    beschreibung: "Stellt 50 HP wieder her",
    boni: {"heilung": 50},
    preis: 20,
    verkaufspreis: 10,
    verkaufbar: true,
    typ: "verbrauchbar"
  },
  "grosser_heiltrank": {
    name: "Großer Heiltrank",
    beschreibung: "Stellt 100 HP wieder her",
    boni: {"heilung": 100},
    preis: 40,
    verkaufspreis: 20,
    verkaufbar: true,
    typ: "verbrauchbar"
  },
  "feuertrank": {
    name: "Feuertrank",
    beschreibung: "Verursacht Brennen beim Gegner",
    boni: {"statusSchaden": 5},
    statusEffekt: "Brennen",
    statusDauer: 3,
    preis: 25,
    verkaufspreis: 12,
    verkaufbar: true,
    typ: "verbrauchbar"
  },
  "frosttrank": {
    name: "Frosttrank",
    beschreibung: "Friert den Gegner ein",
    boni: {"statusSchaden": 3},
    statusEffekt: "Gefroren",
    statusDauer: 2,
    preis: 25,
    verkaufspreis: 12,
    verkaufbar: true,
    typ: "verbrauchbar"
  },
  "betaeubungstrank": {
    name: "Betäubungstrank",
    beschreibung: "Betäubt den Gegner für eine Runde",
    boni: {"statusSchaden": 1},
    statusEffekt: "Betäubt",
    statusDauer: 1,
    preis: 30,
    verkaufspreis: 15,
    verkaufbar: true,
    typ: "verbrauchbar"
  }
};
