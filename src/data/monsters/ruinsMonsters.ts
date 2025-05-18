
import { Monster } from '../../types/game';
import items from '../items/itemsData';

// Ruins monsters
export const ruinsMonsters: Monster[] = [
  {
    name: "Skelettkrieger",
    hp: 80,
    max_hp: 80,
    staerke: 16,
    verteidigung: 6,
    loot: [items["eisenschwert"]],
    xp: 45,
    wahrscheinlichkeit: 0.6,
    faehigkeiten: [],
    level: 10
  },
  {
    name: "Geist",
    hp: 60,
    max_hp: 60,
    staerke: 12,
    verteidigung: 3,
    loot: [items["magieamulett"]],
    xp: 40,
    wahrscheinlichkeit: 0.5,
    faehigkeiten: ["geisterstoß"],
    level: 12
  },
  {
    name: "Lich",
    hp: 120,
    max_hp: 120,
    staerke: 22,
    verteidigung: 10,
    loot: [items["kristallstab"]],
    xp: 80,
    wahrscheinlichkeit: 0.2,
    faehigkeiten: ["todeszauber"],
    level: 15
  }
];
