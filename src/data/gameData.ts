import { Item, Monster, NPC, Quest } from '../types/game';
import items from './items/itemsData';
import monster_templates from './monsters/monstersData';
import locationsData from './locationsData';

// Export items
export { items };

// Orte
export const orte = Object.keys(locationsData);

// Export monster templates
export { monster_templates };

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
