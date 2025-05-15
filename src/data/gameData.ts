
import { Item, Monster, NPC, Quest } from '../types/game';

// Items definieren
export const items: Record<string, Item> = {
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
    typ: "waffe"
  },
  "flammenstab": {
    name: "Flammenstab",
    beschreibung: "Verursacht Feuerschaden",
    boni: {"intelligenz": 7, "statusSchaden": 5},
    faehigkeit: "feuerschaden",
    statusEffekt: "Brennen",
    statusDauer: 3,
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "waffe"
  },
  "frostwand": {
    name: "Frostwand",
    beschreibung: "Ein magischer Stab mit eisiger Kraft",
    boni: {"intelligenz": 6, "statusSchaden": 4},
    faehigkeit: "eisschaden",
    statusEffekt: "Gefroren", 
    statusDauer: 2,
    preis: 60,
    verkaufspreis: 30,
    verkaufbar: true,
    typ: "waffe"
  },
  "lebensraeuber": {
    name: "Lebensräuber",
    beschreibung: "Ein Schwert, das deinem Gegner Leben stiehlt",
    boni: {"staerke": 6},
    faehigkeit: "lebensraub",
    preis: 65,
    verkaufspreis: 32,
    verkaufbar: true,
    typ: "waffe"
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
    typ: "waffe"
  },
  "zauberbuch": {
    name: "Zauberbuch",
    beschreibung: "Erhöht Intelligenz",
    boni: {"intelligenz": 3},
    preis: 40,
    verkaufspreis: 20,
    verkaufbar: true,
    typ: "waffe"
  },
  "lederruestung": {
    name: "Lederrüstung",
    beschreibung: "Grundlegender Schutz",
    boni: {"verteidigung": 3},
    preis: 25,
    verkaufspreis: 12,
    verkaufbar: true,
    typ: "ruestung"
  },
  "eisenruestung": {
    name: "Eisenrüstung",
    beschreibung: "Solider Schutz",
    boni: {"verteidigung": 6},
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "ruestung"
  },
  "magischer_bogen": {
    name: "Magischer Bogen",
    beschreibung: "Ein verzauberter Bogen",
    boni: {"staerke": 6, "ausweichen": 2},
    faehigkeit: "fernkampf",
    preis: 60,
    verkaufspreis: 30,
    verkaufbar: true,
    typ: "waffe"
  },
  "kristallstab": {
    name: "Kristallstab",
    beschreibung: "Erhöht magische Kräfte",
    boni: {"intelligenz": 8},
    faehigkeit: "magieboost",
    preis: 70,
    verkaufspreis: 35,
    verkaufbar: true,
    typ: "waffe"
  },
  "spinnenfaden": {
    name: "Spinnenfaden",
    beschreibung: "Seltenes Material aus Spinnenseide",
    boni: {},
    preis: 15,
    verkaufspreis: 8,
    verkaufbar: true,
    typ: "material"
  },
  // Neue Helm-Items
  "lederhelm": {
    name: "Lederhelm",
    beschreibung: "Einfacher Kopfschutz",
    boni: {"verteidigung": 2},
    preis: 20,
    verkaufspreis: 10,
    verkaufbar: true,
    typ: "helm"
  },
  "eisenhelm": {
    name: "Eisenhelm",
    beschreibung: "Robuster Kopfschutz",
    boni: {"verteidigung": 4},
    preis: 40,
    verkaufspreis: 20,
    verkaufbar: true,
    typ: "helm"
  },
  "magischer_helm": {
    name: "Magischer Helm",
    beschreibung: "Verstärkt magische Kräfte",
    boni: {"intelligenz": 3, "verteidigung": 2},
    preis: 65,
    verkaufspreis: 32,
    verkaufbar: true,
    typ: "helm"
  },
  // Accessoires
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
    typ: "accessoire"
  },
  "magieamulett": {
    name: "Magieamulett",
    beschreibung: "Verstärkt magische Fähigkeiten",
    boni: {"intelligenz": 2},
    preis: 45,
    verkaufspreis: 22,
    verkaufbar: true,
    typ: "accessoire"
  },
  "verteidigungsamulett": {
    name: "Verteidigungsamulett",
    beschreibung: "Erhöht die Verteidigung",
    boni: {"verteidigung": 3},
    preis: 50,
    verkaufspreis: 25,
    verkaufbar: true,
    typ: "accessoire"
  },
  // Tränke mit Statuseffekten
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

// Orte
export const orte = ["Stadt", "Wald", "Berge", "See", "Höhle", "Wüste"];

// Monster definieren
export const monster_templates: Record<string, Monster[]> = {
  "Wald": [
    {
      name: "Goblin",
      hp: 30,
      max_hp: 30,
      staerke: 5,
      verteidigung: 2,
      loot: [items["holzschwert"]],
      xp: 15,
      wahrscheinlichkeit: 0.8,
      faehigkeiten: []
    },
    {
      name: "Wolf",
      hp: 25,
      max_hp: 25,
      staerke: 7,
      verteidigung: 1,
      loot: [],
      xp: 12,
      wahrscheinlichkeit: 0.7,
      faehigkeiten: []
    },
    {
      name: "Bandit",
      hp: 40,
      max_hp: 40,
      staerke: 8,
      verteidigung: 3,
      loot: [items["eisenschwert"]],
      xp: 20,
      wahrscheinlichkeit: 0.5,
      faehigkeiten: []
    },
    {
      name: "Wald-Spinne",
      hp: 20,
      max_hp: 20,
      staerke: 15,
      verteidigung: 1,
      loot: [items["spinnenfaden"]],
      xp: 20,
      wahrscheinlichkeit: 0.5,
      faehigkeiten: []
    }
  ],
  "Berge": [
    {
      name: "Bergtroll",
      hp: 60,
      max_hp: 60,
      staerke: 12,
      verteidigung: 5,
      loot: [items["eisenruestung"]],
      xp: 30,
      wahrscheinlichkeit: 0.4,
      faehigkeiten: []
    },
    {
      name: "Harpyie",
      hp: 35,
      max_hp: 35,
      staerke: 9,
      verteidigung: 2,
      loot: [],
      xp: 25,
      wahrscheinlichkeit: 0.6,
      faehigkeiten: []
    },
    {
      name: "Steingolem",
      hp: 80,
      max_hp: 80,
      staerke: 15,
      verteidigung: 8,
      loot: [],
      xp: 40,
      wahrscheinlichkeit: 0.3,
      faehigkeiten: []
    }
  ],
  "See": [
    {
      name: "Wassernixe",
      hp: 30,
      max_hp: 30,
      staerke: 6,
      verteidigung: 1,
      loot: [],
      xp: 18,
      wahrscheinlichkeit: 0.5,
      faehigkeiten: ["wasserzauber"]
    },
    {
      name: "Seeschlange",
      hp: 70,
      max_hp: 70,
      staerke: 14,
      verteidigung: 4,
      loot: [],
      xp: 35,
      wahrscheinlichkeit: 0.3,
      faehigkeiten: []
    },
    {
      name: "Krake",
      hp: 100,
      max_hp: 100,
      staerke: 20,
      verteidigung: 5,
      loot: [items["flammenstab"]],
      xp: 50,
      wahrscheinlichkeit: 0.2,
      faehigkeiten: []
    }
  ],
  "Höhle": [
    {
      name: "Fledermaus",
      hp: 20,
      max_hp: 20,
      staerke: 4,
      verteidigung: 0,
      loot: [],
      xp: 10,
      wahrscheinlichkeit: 0.9,
      faehigkeiten: []
    },
    {
      name: "Höhlentroll",
      hp: 70,
      max_hp: 70,
      staerke: 15,
      verteidigung: 6,
      loot: [items["eisenruestung"]],
      xp: 40,
      wahrscheinlichkeit: 0.3,
      faehigkeiten: []
    },
    {
      name: "Höhlenspinne",
      hp: 45,
      max_hp: 45,
      staerke: 8,
      verteidigung: 2,
      loot: [],
      xp: 25,
      wahrscheinlichkeit: 0.6,
      faehigkeiten: []
    }
  ],
  "Wüste": [
    {
      name: "Skorpion",
      hp: 35,
      max_hp: 35,
      staerke: 7,
      verteidigung: 3,
      loot: [],
      xp: 20,
      wahrscheinlichkeit: 0.7,
      faehigkeiten: []
    },
    {
      name: "Sandwurm",
      hp: 90,
      max_hp: 90,
      staerke: 18,
      verteidigung: 7,
      loot: [],
      xp: 45,
      wahrscheinlichkeit: 0.2,
      faehigkeiten: []
    },
    {
      name: "Mumie",
      hp: 50,
      max_hp: 50,
      staerke: 10,
      verteidigung: 4,
      loot: [items["kristallstab"]],
      xp: 30,
      wahrscheinlichkeit: 0.4,
      faehigkeiten: []
    }
  ]
};

// NPCs definieren
export const npcs: Record<string, NPC> = {
  "Händler": {
    name: "Hans der Händler",
    ort: "Stadt",
    dialog: {
      "gruss": "Willkommen in meinem Laden!",
      "handel": "Ich kaufe und verkaufe eine Vielzahl von Waren."
    },
    handel: [items["heiltrank"], items["eisenschwert"], items["grosser_heiltrank"]],
    kauft: ["waffe", "ruestung", "verbrauchbar"] // Types of items this NPC will buy
  },
  "Schmied": {
    name: "Goran der Schmied",
    ort: "Stadt",
    dialog: {
      "gruss": "Was kann ich für dich schmieden?",
      "handel": "Ich kaufe und verkaufe die besten Waffen und Rüstungen."
    },
    handel: [
      items["eisenschwert"], 
      items["eisenruestung"], 
      items["eisenhelm"], 
      items["giftschwert"], 
      items["lebensraeuber"],
      items["betaeubungskeule"]
    ],
    kauft: ["waffe", "ruestung", "helm"] // Types of items this NPC will buy
  },
  "Magier": {
    name: "Elara die Magierin",
    ort: "Stadt",
    dialog: {
      "gruss": "Suchst du arkanes Wissen?",
      "handel": "Diese magischen Gegenstände könnten dir helfen. Ich kaufe auch magische Artefakte."
    },
    handel: [
      items["flammenstab"], 
      items["kristallstab"], 
      items["zauberbuch"], 
      items["magieamulett"],
      items["frostwand"],
      items["feuertrank"],
      items["frosttrank"],
      items["betaeubungstrank"]
    ],
    kauft: ["waffe", "accessoire", "verbrauchbar"] // Types of items this NPC will buy
  },
  "Abenteurer": {
    name: "Finn der Abenteurer",
    ort: "Stadt",
    dialog: {
      "gruss": "Ah, ein Mitstreiter! Ich habe einige seltene Stücke auf meinen Reisen gefunden.",
      "handel": "Interesse an etwas Besonderem? Ich kaufe alles, was wertvoll ist."
    },
    handel: [
      items["magischer_helm"], 
      items["glücksanhänger"], 
      items["stärkering"],
      items["verteidigungsamulett"],
      items["magischer_bogen"]
    ],
    kauft: ["*"] // The * means this NPC buys all item types
  }
};

// Quests definieren
export const standard_quests: Quest[] = [
  {
    name: "Goblin Plage",
    beschreibung: "Besiege 5 Goblins",
    ziel_typ: "Goblin",
    ziel_anzahl: 5,
    aktuelle_anzahl: 0,
    belohnung_gold: 100,
    belohnung_xp: 50,
    belohnung_item: items["eisenschwert"],
    abgeschlossen: false
  },
  {
    name: "Wolfsjagd",
    beschreibung: "Erlege 3 Wölfe",
    ziel_typ: "Wolf",
    ziel_anzahl: 3,
    aktuelle_anzahl: 0,
    belohnung_gold: 75,
    belohnung_xp: 40,
    belohnung_item: items["lederruestung"],
    abgeschlossen: false
  },
  {
    name: "Trollgefahr",
    beschreibung: "Besiege einen Bergtroll",
    ziel_typ: "Bergtroll",
    ziel_anzahl: 1,
    aktuelle_anzahl: 0,
    belohnung_gold: 150,
    belohnung_xp: 80,
    belohnung_item: items["eisenruestung"],
    abgeschlossen: false
  },
  {
    name: "Wüstenplage",
    beschreibung: "Besiege 3 Skorpione",
    ziel_typ: "Skorpion",
    ziel_anzahl: 3,
    aktuelle_anzahl: 0,
    belohnung_gold: 120,
    belohnung_xp: 60,
    belohnung_item: items["magischer_bogen"],
    abgeschlossen: false
  },
  {
    name: "Höhlenforschung",
    beschreibung: "Besiege eine Höhlenspinne",
    ziel_typ: "Höhlenspinne",
    ziel_anzahl: 1,
    aktuelle_anzahl: 0,
    belohnung_gold: 100,
    belohnung_xp: 50,
    belohnung_item: items["kristallstab"],
    abgeschlossen: false
  }
];
