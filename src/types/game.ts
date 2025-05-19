
export interface Item {
  id?: string;          // Added unique ID for each item instance
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
  minLevel?: number;       // Minimum level required to use/equip
  spellGranted?: string;   // Spell granted by this item when equipped
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
  level?: number;         // Monster level
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
  npc_geber?: string;     // NPC who gives the quest
  npc_empfaenger?: string; // NPC who receives the quest completion
}

export interface NPC {
  name: string;
  ort: string;
  dialog: Record<string, string>;
  handel: Item[];
  kauft?: string[];        // Types of items this NPC will buy
  quests?: string[];       // Quests this NPC gives
}

export interface Equipment {
  waffe: Item | null;
  ruestung: Item | null;
  helm: Item | null;
  accessoire: Item | null;
}

// Neue Schnittstelle für Erfolge
export interface Achievement {
  id: string;
  name: string;
  beschreibung: string;
  typ: 'monster_kills' | 'gold_earned' | 'quests_completed' | 'level_reached';
  ziel: string;  // Monster name, or "all" for quests/gold
  stufen: number[];  // z.B. [10, 25, 50, 100] für Monster-Tötungen
  fortschritt: number;
  abgeschlossen: boolean[];  // z.B. [true, false, false, false] für die Stufen
}

export interface Character {
  name: string;
  hp: number;
  max_hp: number;
  mana: number;            // Neue Mana-Eigenschaft
  max_mana: number;        // Neue max_mana-Eigenschaft
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
  entdeckte_orte?: string[]; // Discovered locations
  attributeTrainingCount?: Record<string, number>; // Track training count per attribute
  grantedSpells?: string[]; // Spells granted by equipment
  erfolge?: Achievement[];  // Neue Eigenschaft für Erfolge
  monsterKills?: Record<string, number>; // Track monster kills by name
}

export interface Location {
  name: string;
  beschreibung: string;
  minLevel?: number;       // Minimum level required to discover
  entdeckt: boolean;       // Whether location has been discovered
  monsterLevel?: number;   // Level of monsters in this location
  monsterTypen?: string[]; // Types of monsters that can be encountered
  istDorf?: boolean;       // Whether this is a village
}

export type GameState = {
  character: Character;
  items: Record<string, Item>;
  monsters: Record<string, Monster[]>;
  npcs: Record<string, NPC>;
  quests: Quest[];
  orte: string[];
  orteDetails: Record<string, Location>;
  currentMonster: Monster | null;
  combatLog: string[];
  gameScreen: string;
  loadedCharacters: string[];
  zauberDefinitionen: Record<string, ZauberDefinition>; // New field for spell definitions
  autoSave: boolean;       // Whether to autosave
  trainingCosts: {         // Training costs per level
    basis: number,         // Base cost
    multiplikator: number  // Multiplier per level
  };
  zauberkostenFaktor: number; // Factor for spell cost calculation
  letzteSpeicherung?: number; // Timestamp of last autosave
  grantedSpells?: string[]; // Spells granted by equipment
};

export interface ZauberDefinition {
  name: string;
  beschreibung: string; 
  schaden?: number;        // Base damage
  schadenFaktor?: number;  // Intelligence multiplier for damage
  heilung?: number;        // Healing amount
  heilungFaktor?: number;  // Intelligence multiplier for healing
  manaBedarf?: number;     // Future mana cost
  manaRegeneration?: number; // Mana regeneration amount
  statusEffekt?: string;   // Status effect applied (burning, freezing, etc.)
  statusDauer?: number;    // Duration of status effect in turns
  minLevel?: number;       // Minimum level requirement
  verfuegbarkeit?: "stadt" | "npc_quest" | "npc_drop" | "npc_teach"; // Where spell can be obtained
  lehrer?: string;         // NPC who teaches this spell
  questgeber?: string;     // NPC who gives quest for this spell
  monsterDrop?: string;    // Monster that drops this spell
  schildWert?: number;     // Shield value for protective spells
  schildFaktor?: number;   // Intelligence multiplier for shield
  selbstSchaden?: number;  // Self-damage for powerful spells
  statusCleanse?: boolean; // Whether spell cleans status effects
  extraAktion?: boolean;   // Whether spell gives an extra action
  preisFaktor?: number;    // Price multiplier for the spell (1.0 = standard)
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
  | { type: 'EQUIP_ITEM'; item: Item; itemIndex: number }  // Updated to include itemIndex
  | { type: 'USE_INVENTORY_ITEM'; itemIndex: number }
  | { type: 'DROP_ITEM'; itemIndex: number }
  | { type: 'TAKE_QUEST'; quest: Quest; npc: string }
  | { type: 'COMPLETE_QUEST'; questIndex: number; npc: string }
  | { type: 'TRAIN_ATTRIBUTE'; attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana' }
  | { type: 'ASSIGN_STAT_POINT'; attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana' }
  | { type: 'LEARN_SPELL'; spell: string }
  | { type: 'CHANGE_SCREEN'; screen: string }
  | { type: 'UPDATE_COMBAT_LOG'; message: string }
  | { type: 'TOGGLE_AUTOSAVE' }
  | { type: 'DISCOVER_LOCATION'; location: string }
  | { type: 'UPDATE_ACHIEVEMENT'; monsterName: string }
  | { type: 'INITIALIZE_ACHIEVEMENTS'; }  // New action for initializing achievements
  | { type: 'SAVE_GAME' };
