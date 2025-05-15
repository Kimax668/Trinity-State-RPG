
export interface Item {
  name: string;
  beschreibung: string;
  boni: Record<string, number>;
  faehigkeit?: string;
  preis: number;
  verkaufspreis?: number;  // Price when selling to shop
  verkaufbar?: boolean;    // Whether item can be sold
  typ: string;
  statusEffekt?: string;   // Status effect applied (burning, freezing, etc.)
  statusDauer?: number;    // Duration of status effect in turns
}

export interface Monster {
  name: string;
  hp: number;
  max_hp: number;
  staerke: number;
  verteidigung?: number;   // Monster defense value
  loot: Item[];
  xp: number;
  wahrscheinlichkeit: number;
  faehigkeiten: string[];
  isBoss?: boolean;
  lootChance?: number;
  statusEffekte?: {        // Active status effects
    name: string;
    dauer: number;
    schaden?: number;
  }[];
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
  kauft?: string[];        // Types of items this NPC will buy
}

export interface Equipment {
  waffe: Item | null;
  ruestung: Item | null;
  helm: Item | null;
  accessoire: Item | null;
}

export interface Character {
  name: string;
  hp: number;
  max_hp: number;
  staerke: number;
  intelligenz: number;
  ausweichen: number;
  verteidigung: number;    // New defense stat
  xp: number;
  level: number;
  gold: number;
  inventar: Item[];
  ausgeruestet: Equipment;
  zauber: string[];
  aktueller_ort: string;
  quest_log: Quest[];
  unverteilte_punkte: number;  // Unassigned stat points
  statusEffekte?: {        // Active status effects on character
    name: string;
    dauer: number;
    schaden?: number;
  }[];
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
  zauberDefinitionen: Record<string, ZauberDefinition>; // New field for spell definitions
};

export interface ZauberDefinition {
  name: string;
  beschreibung: string; 
  schaden?: number;        // Base damage
  schadenFaktor?: number;  // Intelligence multiplier for damage
  heilung?: number;        // Healing amount
  heilungFaktor?: number;  // Intelligence multiplier for healing
  manaBedarf?: number;     // Future mana cost
  statusEffekt?: string;   // Status effect applied (burning, freezing, etc.)
  statusDauer?: number;    // Duration of status effect in turns
}

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
  | { type: 'SELL_ITEM'; itemIndex: number; npc: string }
  | { type: 'EQUIP_ITEM'; item: Item }
  | { type: 'USE_INVENTORY_ITEM'; itemIndex: number }
  | { type: 'DROP_ITEM'; itemIndex: number }
  | { type: 'TAKE_QUEST'; quest: Quest }
  | { type: 'TRAIN_ATTRIBUTE'; attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' }
  | { type: 'ASSIGN_STAT_POINT'; attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' }
  | { type: 'LEARN_SPELL'; spell: string }
  | { type: 'CHANGE_SCREEN'; screen: string }
  | { type: 'UPDATE_COMBAT_LOG'; message: string }
  | { type: 'SAVE_GAME' };
