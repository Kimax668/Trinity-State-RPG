
import { Monster } from '../../types/game';
import { forestMonsters, deepForestMonsters } from './forestMonsters';
import { mountainMonsters } from './mountainMonsters';
import { lakeMonsters } from './waterMonsters';
import { caveMonsters } from './caveMonsters';
import { desertMonsters } from './desertMonsters';
import { ruinsMonsters } from './ruinsMonsters';
import { mineMonsters } from './mineMonsters';

// Combine all monsters by location
const monster_templates: Record<string, Monster[]> = {
  "Wald": forestMonsters,
  "Tiefer Wald": deepForestMonsters,
  "Berge": mountainMonsters,
  "See": lakeMonsters,
  "Höhle": caveMonsters,
  "Wüste": desertMonsters,
  "Verlorene Ruinen": ruinsMonsters,
  "Verlassene Mine": mineMonsters
};

export default monster_templates;
