
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Forest monsters
export const forestMonsters: Monster[] = [
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
];

// Deep Forest monsters
export const deepForestMonsters: Monster[] = [
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
];
