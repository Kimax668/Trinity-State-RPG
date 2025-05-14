export interface Item {
  name: string;
  beschreibung: string;
  boni: Record<string, number>;
  faehigkeit?: string;
  preis: number;
  typ: string;
}

export interface Monster {
  name: string;
  hp: number;
  max_hp: number;
  staerke: number;
  loot: Item[];
  xp: number;
  wahrscheinlichkeit: number;
  faehigkeiten: string[];
  isBoss?: boolean;
  lootChance?: number;
}

export interface Quest {
  name: string;
  beschreibung: string;
  ziel_typ: string;
  ziel_anzahl: number;
  aktuelle_anzahl: number;
  belohnung_gold: number;
  belohnung_xp: number;
  belohnung_item: Item | null;
  abgeschlossen: boolean;
}

export interface NPC {
  name: string;
  ort: string;
  dialog: Record<string, string>;
  handel: Item[];
}

export interface Character {
  name: string;
  hp: number;
  max_hp: number;
  staerke: number;
  intelligenz: number;
  ausweichen: number;
  xp: number;
  level: number;
  gold: number;
  inventar: Item[];
  ausgeruestet: Item | null;
  zauber: string[];
  aktueller_ort: string;
  quest_log: Quest[];
}

export type GameState = {
  character: Character;
  items: Record<string, Item>;
  monsters: Record<string, Monster[]>;
  npcs: Record<string, NPC>;
  quests: Quest[];
  orte: string[];
  currentMonster: Monster | null;
  combatLog: string[];
  gameScreen: string;
  loadedCharacters: string[];
};

export type GameAction =
  | { type: 'CREATE_CHARACTER'; name: string }
  | { type: 'LOAD_CHARACTER'; character: Character }
  | { type: 'TRAVEL_TO'; location: string }
  | { type: 'START_COMBAT'; monster: Monster }
  | { type: 'ATTACK_MONSTER' }
  | { type: 'CAST_SPELL'; spell: string }
  | { type: 'USE_ITEM'; itemIndex: number }
  | { type: 'FLEE_COMBAT' }
  | { type: 'END_COMBAT'; won: boolean }
  | { type: 'BUY_ITEM'; item: Item }
  | { type: 'EQUIP_ITEM'; item: Item }
  | { type: 'USE_INVENTORY_ITEM'; itemIndex: number }
  | { type: 'DROP_ITEM'; itemIndex: number }
  | { type: 'TAKE_QUEST'; quest: Quest }
  | { type: 'TRAIN_ATTRIBUTE'; attribute: 'staerke' | 'intelligenz' | 'ausweichen' }
  | { type: 'LEARN_SPELL'; spell: string }
  | { type: 'CHANGE_SCREEN'; screen: string }
  | { type: 'UPDATE_COMBAT_LOG'; message: string }
  | { type: 'SAVE_GAME' };
