
import { Item } from '../../types/game';
import { weaponsData } from './weaponsData';
import { armorData } from './armorData';
import { accessoryData } from './accessoryData';
import { consumableData } from './consumableData';
import { materialsData } from './materialsData';

// Combine all item types into a single object
const items: Record<string, Item> = {
  ...weaponsData,
  ...armorData,
  ...accessoryData,
  ...consumableData,
  ...materialsData
};

export default items;
