
import { Item } from '../../types/game';

// Armor and helmets
export const armorData: Record<string, Item> = {
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
    beschreibung: "Verstärkt magische Kräfte und gewährt die Gedankenlesen-Fähigkeit",
    boni: {"intelligenz": 3, "verteidigung": 2},
    preis: 65,
    verkaufspreis: 32,
    verkaufbar: true,
    typ: "helm",
    minLevel: 8,
    spellGranted: "Gedankenlesen"
  }
};
