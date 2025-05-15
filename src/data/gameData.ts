
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
    typ: "waffe",
    minLevel: 3
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
    typ: "waffe",
    minLevel: 5
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
    typ: "waffe",
    minLevel: 8
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
    beschreibung: "Erhöht Intelligenz",
    boni: {"intelligenz": 3},
    preis: 40,
    verkaufspreis: 20,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 4
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
    typ: "ruestung",
    minLevel: 6
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
    beschreibung: "Erhöht magische Kräfte",
    boni: {"intelligenz": 8},
    faehigkeit: "magieboost",
    preis: 70,
    verkaufspreis: 35,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 12
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
    typ: "helm",
    minLevel: 5
  },
  "magischer_helm": {
    name: "Magischer Helm",
    beschreibung: "Verstärkt magische Kräfte",
    boni: {"intelligenz": 3, "verteidigung": 2},
    preis: 65,
    verkaufspreis: 32,
    verkaufbar: true,
    typ: "helm",
    minLevel: 8
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
    typ: "accessoire",
    minLevel: 4
  },
  "magieamulett": {
    name: "Magieamulett",
    beschreibung: "Verstärkt magische Fähigkeiten",
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
  },
  // Neue hochstufige Items
  "drachenzahn": {
    name: "Drachenzahn",
    beschreibung: "Ein scharfer Zahn eines erlegten Drachen",
    boni: {"staerke": 12, "statusSchaden": 8},
    faehigkeit: "feuerschaden",
    statusEffekt: "Brennen",
    statusDauer: 4,
    preis: 200,
    verkaufspreis: 100,
    verkaufbar: true,
    typ: "waffe",
    minLevel: 15
  },
  "eisruestung": {
    name: "Eisrüstung",
    beschreibung: "Eine magische Rüstung aus ewigem Eis",
    boni: {"verteidigung": 10, "ausweichen": 3},
    preis: 180,
    verkaufspreis: 90,
    verkaufbar: true,
    typ: "ruestung",
    minLevel: 12
  },
  "meisteramulett": {
    name: "Meisteramulett",
    beschreibung: "Legendäres Amulett eines großen Zauberers",
    boni: {"intelligenz": 5, "ausweichen": 3, "verteidigung": 2},
    preis: 250,
    verkaufspreis: 125,
    verkaufbar: true,
    typ: "accessoire",
    minLevel: 15
  }
};

// Orte
export const orte = [
  "Hauptstadt", "Wald", "Berge", "See", "Höhle", "Wüste", 
  "Dornendorf", "Bergfried", "Seehain"
];

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
      faehigkeiten: [],
      level: 1
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
      faehigkeiten: [],
      level: 1
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
      faehigkeiten: [],
      level: 2
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
      faehigkeiten: [],
      level: 2
    }
  ],
  "Tiefer Wald": [
    {
      name: "Riesenwolf",
      hp: 70,
      max_hp: 70,
      staerke: 12,
      verteidigung: 5,
      loot: [items["lederruestung"]],
      xp: 35,
      wahrscheinlichkeit: 0.6,
      faehigkeiten: [],
      level: 8
    },
    {
      name: "Waldschrat",
      hp: 90,
      max_hp: 90,
      staerke: 14,
      verteidigung: 8,
      loot: [items["glücksanhänger"]],
      xp: 40,
      wahrscheinlichkeit: 0.4,
      faehigkeiten: [],
      level: 9
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
      faehigkeiten: [],
      level: 5
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
      faehigkeiten: [],
      level: 4
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
      faehigkeiten: [],
      level: 6
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
      faehigkeiten: ["wasserzauber"],
      level: 3
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
      faehigkeiten: [],
      level: 5
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
      faehigkeiten: [],
      level: 7
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
      faehigkeiten: [],
      level: 2
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
      faehigkeiten: [],
      level: 7
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
      faehigkeiten: [],
      level: 5
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
      faehigkeiten: [],
      level: 6
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
      faehigkeiten: [],
      level: 10
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
      faehigkeiten: [],
      level: 8
    }
  ],
  "Verlorene Ruinen": [
    {
      name: "Skelettkrieger",
      hp: 80,
      max_hp: 80,
      staerke: 16,
      verteidigung: 6,
      loot: [items["eisenschwert"]],
      xp: 45,
      wahrscheinlichkeit: 0.6,
      faehigkeiten: [],
      level: 10
    },
    {
      name: "Geist",
      hp: 60,
      max_hp: 60,
      staerke: 12,
      verteidigung: 3,
      loot: [items["magieamulett"]],
      xp: 40,
      wahrscheinlichkeit: 0.5,
      faehigkeiten: ["geisterstoß"],
      level: 12
    },
    {
      name: "Lich",
      hp: 120,
      max_hp: 120,
      staerke: 22,
      verteidigung: 10,
      loot: [items["kristallstab"]],
      xp: 80,
      wahrscheinlichkeit: 0.2,
      faehigkeiten: ["todeszauber"],
      level: 15
    }
  ],
  "Verlassene Mine": [
    {
      name: "Minengoblin",
      hp: 60,
      max_hp: 60,
      staerke: 14,
      verteidigung: 4,
      loot: [items["giftschwert"]],
      xp: 40,
      wahrscheinlichkeit: 0.7,
      faehigkeiten: [],
      level: 12
    },
    {
      name: "Tiefenzwerg",
      hp: 100,
      max_hp: 100,
      staerke: 18,
      verteidigung: 12,
      loot: [items["eisenruestung"]],
      xp: 60,
      wahrscheinlichkeit: 0.4,
      faehigkeiten: [],
      level: 14
    },
    {
      name: "Lavadämon",
      hp: 130,
      max_hp: 130,
      staerke: 25,
      verteidigung: 10,
      loot: [items["drachenzahn"]],
      xp: 90,
      wahrscheinlichkeit: 0.2,
      faehigkeiten: ["feueratem"],
      level: 16
    }
  ]
};

// NPCs definieren
export const npcs: Record<string, NPC> = {
  "Händler": {
    name: "Hans der Händler",
    ort: "Hauptstadt",
    dialog: {
      "gruss": "Willkommen in meinem Laden!",
      "handel": "Ich kaufe und verkaufe eine Vielzahl von Waren."
    },
    handel: [
      items["heiltrank"], 
      items["eisenschwert"], 
      items["grosser_heiltrank"], 
      items["lederruestung"],
      items["lederhelm"]
    ],
    kauft: ["waffe", "ruestung", "verbrauchbar"], // Types of items this NPC will buy
    quests: ["Goblin Plage", "Wolfsjagd"]
  },
  "Schmied": {
    name: "Goran der Schmied",
    ort: "Hauptstadt",
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
    kauft: ["waffe", "ruestung", "helm"], // Types of items this NPC will buy
    quests: ["Trollgefahr"]
  },
  "Magier": {
    name: "Elara die Magierin",
    ort: "Hauptstadt",
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
    kauft: ["waffe", "accessoire", "verbrauchbar"], // Types of items this NPC will buy
    quests: ["Höhlenforschung"]
  },
  "Abenteurer": {
    name: "Finn der Abenteurer",
    ort: "Hauptstadt",
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
    kauft: ["*"], // The * means this NPC buys all item types
    quests: ["Wüstenplage"]
  },
  "Dorfältester": {
    name: "Aldric der Älteste",
    ort: "Dornendorf",
    dialog: {
      "gruss": "Willkommen, Fremder. Unser kleines Dorf kann immer Hilfe gebrauchen.",
      "handel": "Ich habe ein paar Dinge, die dir vielleicht nützlich sein könnten."
    },
    handel: [
      items["heiltrank"],
      items["lederruestung"],
      items["holzschwert"]
    ],
    kauft: ["material", "verbrauchbar"],
    quests: ["Waldspinnen Bedrohung"]
  },
  "Dorfschmied": {
    name: "Brom der Schmied",
    ort: "Bergfried",
    dialog: {
      "gruss": "Die Berge geben uns das beste Erz. Meine Waffen sind unübertroffen!",
      "handel": "Hier, sieh dir diese Qualität an. Besser findest du es nirgendwo!"
    },
    handel: [
      items["eisenschwert"],
      items["eisenruestung"],
      items["eisenhelm"],
      items["stärkering"]
    ],
    kauft: ["waffe", "ruestung", "helm"],
    quests: ["Erzzwergenproblem"]
  },
  "Fischer": {
    name: "Marin der Fischer",
    ort: "Seehain",
    dialog: {
      "gruss": "Der See ist großzügig zu uns, aber auch gefährlich. Die Monster werden immer dreister.",
      "handel": "Ich handle nicht nur mit Fisch, sondern auch mit nützlichen Dingen für Abenteurer."
    },
    handel: [
      items["heiltrank"],
      items["grosser_heiltrank"],
      items["feuertrank"],
      items["glücksanhänger"]
    ],
    kauft: ["verbrauchbar", "material"],
    quests: ["Kraken Schrecken"]
  },
  "Zauberin": {
    name: "Lyra die Zauberin",
    ort: "Seehain",
    dialog: {
      "gruss": "Ich spüre eine magische Begabung in dir. Vielleicht kann ich dir helfen, sie zu entwickeln?",
      "handel": "Diese Artefakte enthalten uralte Magie. Nutze sie weise."
    },
    handel: [
      items["zauberbuch"],
      items["frosttrank"],
      items["magieamulett"],
      items["magischer_helm"]
    ],
    kauft: ["waffe", "accessoire"],
    quests: ["Magische Artefakte"]
  },
  "Waffenmeister": {
    name: "Thorne der Waffenmeister",
    ort: "Bergfried",
    dialog: {
      "gruss": "Wenn du überleben willst, brauchst du die besten Waffen - und das Können, sie zu benutzen!",
      "handel": "Ich verkaufe nur an diejenigen, die ich für würdig halte. Beweise dich!"
    },
    handel: [
      items["giftschwert"],
      items["betaeubungskeule"],
      items["magischer_bogen"],
      items["verteidigungsamulett"]
    ],
    kauft: ["waffe"],
    quests: ["Steingolem Bedrohung"]
  }
};

// Quests definieren
export const standard_quests: Quest[] = [
  {
    name: "Goblin Plage",
    beschreibung: "Besiege 5 Goblins im Wald",
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
    beschreibung: "Erlege 3 Wölfe im Wald",
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
    beschreibung: "Besiege einen Bergtroll in den Bergen",
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
    beschreibung: "Besiege 3 Skorpione in der Wüste",
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
    beschreibung: "Besiege eine Höhlenspinne in der Höhle",
    ziel_typ: "Höhlenspinne",
    ziel_anzahl: 1,
    aktuelle_anzahl: 0,
    belohnung_gold: 100,
    belohnung_xp: 50,
    belohnung_item: items["kristallstab"],
    abgeschlossen: false
  },
  {
    name: "Waldspinnen Bedrohung",
    beschreibung: "Beseitige 4 Wald-Spinnen, die das Dorf bedrohen",
    ziel_typ: "Wald-Spinne",
    ziel_anzahl: 4,
    aktuelle_anzahl: 0,
    belohnung_gold: 80,
    belohnung_xp: 45,
    belohnung_item: items["lederruestung"],
    abgeschlossen: false
  },
  {
    name: "Kraken Schrecken",
    beschreibung: "Töte den Kraken, der die Fischer bedroht",
    ziel_typ: "Krake",
    ziel_anzahl: 1,
    aktuelle_anzahl: 0,
    belohnung_gold: 200,
    belohnung_xp: 100,
    belohnung_item: items["flammenstab"],
    abgeschlossen: false
  },
  {
    name: "Erzzwergenproblem",
    beschreibung: "Sammle Erz von 3 Tiefenzwergen in der Verlassenen Mine",
    ziel_typ: "Tiefenzwerg",
    ziel_anzahl: 3,
    aktuelle_anzahl: 0,
    belohnung_gold: 250,
    belohnung_xp: 120,
    belohnung_item: items["eisruestung"],
    abgeschlossen: false
  },
  {
    name: "Magische Artefakte",
    beschreibung: "Besiege den Lich in den Verlorenen Ruinen und hole sein magisches Artefakt",
    ziel_typ: "Lich",
    ziel_anzahl: 1,
    aktuelle_anzahl: 0,
    belohnung_gold: 300,
    belohnung_xp: 150,
    belohnung_item: items["kristallstab"],
    abgeschlossen: false
  },
  {
    name: "Steingolem Bedrohung",
    beschreibung: "Zerstöre 2 gefährliche Steingolem in den Bergen",
    ziel_typ: "Steingolem",
    ziel_anzahl: 2,
    aktuelle_anzahl: 0,
    belohnung_gold: 180,
    belohnung_xp: 90,
    belohnung_item: items["betaeubungskeule"],
    abgeschlossen: false
  }
];
