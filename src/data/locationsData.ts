
import { Location } from '../types/game';

// Locations data with descriptions and requirements
const locationsData: Record<string, Location> = {
  // Main locations - always available from start
  "Hauptstadt": {
    name: "Hauptstadt",
    beschreibung: "Das Zentrum des Königreichs mit vielen Händlern und Dienstleistungen.",
    entdeckt: true,
    istDorf: true
  },
  "Wald": {
    name: "Wald",
    beschreibung: "Ein dichter Wald voller Leben und Gefahren.",
    entdeckt: true,
    monsterLevel: 1
  },
  "Berge": {
    name: "Berge",
    beschreibung: "Raue und gefährliche Berge mit starken Gegnern.",
    entdeckt: true,
    monsterLevel: 5
  },
  "See": {
    name: "See",
    beschreibung: "Ein großer See mit mysteriösen Kreaturen.",
    entdeckt: true,
    monsterLevel: 3
  },
  "Höhle": {
    name: "Höhle",
    beschreibung: "Eine dunkle Höhle voller Monster.",
    entdeckt: true,
    monsterLevel: 7
  },
  "Wüste": {
    name: "Wüste",
    beschreibung: "Eine heiße und unwirtliche Wüste.",
    entdeckt: true,
    monsterLevel: 10
  },
  
  // Discoverable villages
  "Dornendorf": {
    name: "Dornendorf",
    beschreibung: "Ein kleines Dorf am Rande des Waldes.",
    entdeckt: false,
    istDorf: true,
    minLevel: 3
  },
  "Bergfried": {
    name: "Bergfried",
    beschreibung: "Ein Dorf in den Bergen, bekannt für seine Schmiede.",
    entdeckt: false,
    istDorf: true,
    minLevel: 8
  },
  "Seehain": {
    name: "Seehain",
    beschreibung: "Ein Fischerdorf am Ufer des großen Sees.",
    entdeckt: false,
    istDorf: true,
    minLevel: 5
  },
  
  // Discoverable dungeons
  "Verlorene Ruinen": {
    name: "Verlorene Ruinen",
    beschreibung: "Uralte Ruinen mit gefährlichen Untoten.",
    entdeckt: false,
    monsterLevel: 12,
    minLevel: 10
  },
  "Tiefer Wald": {
    name: "Tiefer Wald",
    beschreibung: "Der tiefste Teil des Waldes mit mächtigen Kreaturen.",
    entdeckt: false,
    monsterLevel: 8,
    minLevel: 7
  },
  "Verlassene Mine": {
    name: "Verlassene Mine",
    beschreibung: "Eine alte Mine voller Monster und Schätze.",
    entdeckt: false,
    monsterLevel: 15,
    minLevel: 12
  },
  
  // Higher level areas
  "Frostgipfel": {
    name: "Frostgipfel",
    beschreibung: "Ein verschneiter Berggipfel mit eisigen Kreaturen.",
    entdeckt: false,
    monsterLevel: 18,
    minLevel: 15
  },
  "Vulkankrater": {
    name: "Vulkankrater",
    beschreibung: "Ein aktiver Vulkan voller Feuerwesen.",
    entdeckt: false,
    monsterLevel: 22,
    minLevel: 18
  },
  "Mystischer Hain": {
    name: "Mystischer Hain",
    beschreibung: "Ein magischer Wald mit uralten Naturwesen.",
    entdeckt: false,
    monsterLevel: 20,
    minLevel: 17
  },
  "Verwunschene Ruinen": {
    name: "Verwunschene Ruinen",
    beschreibung: "Ruinen einer alten Zivilisation, bewacht von mächtigen Wächtern.",
    entdeckt: false,
    monsterLevel: 25,
    minLevel: 20
  },
  "Chaosportal": {
    name: "Chaosportal",
    beschreibung: "Ein Portal in eine andere Dimension, voller Chaoswesen.",
    entdeckt: false,
    monsterLevel: 30,
    minLevel: 25
  },
  "Schattental": {
    name: "Schattental",
    beschreibung: "Ein düsteres Tal, in dem kaum Licht eindringt.",
    entdeckt: false,
    monsterLevel: 35,
    minLevel: 30
  },
  "Drachenhöhle": {
    name: "Drachenhöhle",
    beschreibung: "Die Höhle des legendären Drachens.",
    entdeckt: false,
    monsterLevel: 40,
    minLevel: 35
  },
  "Elementarebene": {
    name: "Elementarebene",
    beschreibung: "Eine Ebene reiner Elementarkraft.",
    entdeckt: false,
    monsterLevel: 45,
    minLevel: 40
  },
  "Götterfestung": {
    name: "Götterfestung",
    beschreibung: "Eine Festung der alten Götter.",
    entdeckt: false,
    monsterLevel: 50,
    minLevel: 45
  }
};

export default locationsData;
