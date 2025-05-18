
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Desert monsters
export const desertMonsters: Monster[] = [
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
];
