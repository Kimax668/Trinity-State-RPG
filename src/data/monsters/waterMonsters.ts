
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Lake monsters
export const lakeMonsters: Monster[] = [
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
];
