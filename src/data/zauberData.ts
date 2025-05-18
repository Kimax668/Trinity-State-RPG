
import { ZauberDefinition } from '../types/game';

// Organize zauber by availability type
// Type: "stadt" - available in city magic shops
// Type: "npc_quest" - available from specific NPCs after quests
// Type: "npc_teach" - available from NPCs that teach magic
// Type: "npc_drop" - rare drop from NPCs or monsters
const zauberDefinitionen: Record<string, ZauberDefinition> = {
  // City shop spells (basic)
  "Feuerball": {
    name: "Feuerball",
    beschreibung: "Wirft einen Feuerball, der dem Gegner Schaden zufügt",
    schaden: 15,
    schadenFaktor: 0.5,
    statusEffekt: "Brennen",
    statusDauer: 3,
    manaBedarf: 5,
    minLevel: 1,
    verfuegbarkeit: "stadt"
  },
  "Eisstrahl": {
    name: "Eisstrahl",
    beschreibung: "Schießt einen Strahl aus Eis, der den Gegner einfriert",
    schaden: 12,
    schadenFaktor: 0.4,
    statusEffekt: "Gefroren",
    statusDauer: 2,
    manaBedarf: 5,
    minLevel: 3,
    verfuegbarkeit: "stadt"
  },
  "Heilung": {
    name: "Heilung",
    beschreibung: "Heilt deine Wunden",
    heilung: 20,
    heilungFaktor: 0.6,
    manaBedarf: 8,
    minLevel: 2,
    verfuegbarkeit: "stadt"
  },
  "Blitz": {
    name: "Blitz",
    beschreibung: "Ruft einen Blitz herbei, der hohen Schaden verursacht",
    schaden: 20,
    schadenFaktor: 0.6,
    manaBedarf: 10,
    minLevel: 5,
    verfuegbarkeit: "stadt"
  },
  
  // NPC teacher spells (intermediate)
  "Feuersturm": {
    name: "Feuersturm",
    beschreibung: "Beschwört einen Sturm aus Feuer, der enormen Schaden anrichtet",
    schaden: 30,
    schadenFaktor: 0.8,
    statusEffekt: "Brennen",
    statusDauer: 3,
    manaBedarf: 15,
    minLevel: 8,
    verfuegbarkeit: "npc_teach",
    lehrer: "Meister Ignis"
  },
  "Frostnova": {
    name: "Frostnova",
    beschreibung: "Entfesselt eine Nova aus Frost, die Gegner stark verlangsamt",
    schaden: 25,
    schadenFaktor: 0.7,
    statusEffekt: "Gefroren",
    statusDauer: 3,
    manaBedarf: 15,
    minLevel: 10,
    verfuegbarkeit: "npc_teach",
    lehrer: "Frostweise Glacius"
  },
  "Betäubungszauber": {
    name: "Betäubungszauber",
    beschreibung: "Betäubt den Gegner für eine Runde",
    schaden: 5,
    schadenFaktor: 0.2,
    statusEffekt: "Betäubt",
    statusDauer: 1,
    manaBedarf: 12,
    minLevel: 7,
    verfuegbarkeit: "npc_teach",
    lehrer: "Meisterin Sonya"
  },
  
  // Quest reward spells
  "Lebensdiebstahl": {
    name: "Lebensdiebstahl",
    beschreibung: "Stiehlt Leben vom Gegner und heilt dich",
    schaden: 15,
    schadenFaktor: 0.4,
    heilung: 10,
    heilungFaktor: 0.3,
    manaBedarf: 15,
    minLevel: 12,
    verfuegbarkeit: "npc_quest",
    questgeber: "Schattenmagier Vex"
  },
  
  // Rare drop spells (advanced)
  "Göttliche Heilung": {
    name: "Göttliche Heilung",
    beschreibung: "Mächtige Heilung, die einen Großteil deiner Lebenspunkte wiederherstellt",
    heilung: 50,
    heilungFaktor: 1.0,
    manaBedarf: 25,
    minLevel: 15,
    verfuegbarkeit: "npc_drop",
    monsterDrop: "Lichtgeist"
  },
  
  // Additional advanced spells (for higher levels)
  "Meteorregen": {
    name: "Meteorregen",
    beschreibung: "Ruft einen Hagel von Meteoren herbei, der enormen Schaden anrichtet",
    schaden: 45,
    schadenFaktor: 1.2,
    statusEffekt: "Brennen",
    statusDauer: 4,
    manaBedarf: 35,
    minLevel: 20,
    verfuegbarkeit: "npc_drop",
    monsterDrop: "Feuerlord"
  },
  "Seelenentzug": {
    name: "Seelenentzug",
    beschreibung: "Entzieht dem Gegner Lebenskraft und verstärkt dich",
    schaden: 35,
    schadenFaktor: 0.9,
    heilung: 20,
    heilungFaktor: 0.5,
    manaBedarf: 30,
    minLevel: 25,
    verfuegbarkeit: "npc_quest",
    questgeber: "Nekromant Mortis"
  },
  "Göttlicher Schild": {
    name: "Göttlicher Schild",
    beschreibung: "Erschafft einen mächtigen Schild, der Schaden absorbiert",
    heilung: 30,
    heilungFaktor: 0.7,
    schildWert: 40,
    schildFaktor: 0.8,
    manaBedarf: 25,
    minLevel: 18,
    verfuegbarkeit: "npc_teach",
    lehrer: "Erzmagier Luminor"
  },
  "Chaosblitz": {
    name: "Chaosblitz",
    beschreibung: "Ein unberechenbarer Blitz aus reinem Chaos, der enormen Schaden verursacht",
    schaden: 50,
    schadenFaktor: 1.3,
    statusEffekt: "Chaoskraft",
    statusDauer: 3,
    manaBedarf: 40,
    minLevel: 30,
    verfuegbarkeit: "npc_drop",
    monsterDrop: "Chaoswächter"
  },
  "Lebensexplosion": {
    name: "Lebensexplosion",
    beschreibung: "Nutzt eigene Lebenskraft, um massiven Schaden zu verursachen",
    schaden: 70,
    schadenFaktor: 1.5,
    selbstSchaden: 15,
    manaBedarf: 45,
    minLevel: 35,
    verfuegbarkeit: "npc_quest",
    questgeber: "Blutmagier Sanguinus"
  },
  "Wiedergeburt": {
    name: "Wiedergeburt",
    beschreibung: "Kraftvolle Heilung, die alle negativen Statuseffekte entfernt",
    heilung: 80,
    heilungFaktor: 1.2,
    statusCleanse: true,
    manaBedarf: 50,
    minLevel: 40,
    verfuegbarkeit: "npc_drop",
    monsterDrop: "Phönixkönig"
  },
  "Zeitverzerrung": {
    name: "Zeitverzerrung",
    beschreibung: "Verzerrt die Zeit und erlaubt einen zusätzlichen Angriff",
    extraAktion: true,
    manaBedarf: 60,
    minLevel: 45,
    verfuegbarkeit: "npc_quest",
    questgeber: "Zeitmagier Chronos"
  },
  "Elementarsturm": {
    name: "Elementarsturm",
    beschreibung: "Entfesselt die Kraft aller Elemente in einem verheerenden Sturm",
    schaden: 100,
    schadenFaktor: 2.0,
    statusEffekt: "Elementarexplosion",
    statusDauer: 5,
    manaBedarf: 80,
    minLevel: 50,
    verfuegbarkeit: "npc_drop",
    monsterDrop: "Elementardrache"
  }
};

export default zauberDefinitionen;
