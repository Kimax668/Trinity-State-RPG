
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Mine monsters
export const mineMonsters: Monster[] = [
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
];
