
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Cave monsters
export const caveMonsters: Monster[] = [
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
];
