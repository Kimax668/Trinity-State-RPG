
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Mountain monsters
export const mountainMonsters: Monster[] = [
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
];
