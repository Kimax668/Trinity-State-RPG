
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { Character, GameAction, GameState, Item, Monster, Quest } from '../types/game';
import { items, monster_templates, npcs, orte, standard_quests } from '../data/gameData';

// Initial character state
const createInitialCharacter = (name: string): Character => ({
  name,
  hp: 100,
  max_hp: 100,
  staerke: 10,
  intelligenz: 10,
  ausweichen: 5,
  xp: 0,
  level: 1,
  gold: 50,
  inventar: [],
  ausgeruestet: null,
  zauber: [],
  aktueller_ort: "Stadt",
  quest_log: []
});

// Initial game state
const initialState: GameState = {
  character: createInitialCharacter(''),
  items,
  monsters: monster_templates,
  npcs,
  quests: standard_quests,
  orte,
  currentMonster: null,
  combatLog: [],
  gameScreen: 'start', // 'start', 'main', 'combat', 'shop', etc.
  loadedCharacters: []
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CREATE_CHARACTER': {
      const character = createInitialCharacter(action.name);
      // Add starting items
      character.inventar.push(items.holzschwert);
      character.inventar.push(items.heiltrank);
      return {
        ...state,
        character,
        gameScreen: 'main'
      };
    }

    case 'LOAD_CHARACTER':
      return {
        ...state,
        character: action.character,
        gameScreen: 'main'
      };

    case 'TRAVEL_TO': {
      // Check for random encounters
      const newState = { ...state };
      newState.character.aktueller_ort = action.location;
      
      // Random encounter (30% chance)
      if (Math.random() < 0.3 && action.location !== 'Stadt') {
        const location = action.location;
        const possibleMonsters = state.monsters[location] || [];
        
        if (possibleMonsters.length > 0) {
          // Select a monster based on probability
          const monster = { ...possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)] };
          newState.currentMonster = monster;
          newState.gameScreen = 'combat';
          newState.combatLog = [`Ein ${monster.name} erscheint!`];
        }
      }
      
      return newState;
    }

    case 'START_COMBAT':
      return {
        ...state,
        currentMonster: action.monster,
        combatLog: [`Ein ${action.monster.name} erscheint!`],
        gameScreen: 'combat'
      };

    case 'ATTACK_MONSTER': {
      if (!state.currentMonster) return state;
      
      const newState = { ...state };
      const { character } = newState;
      const monster = { ...newState.currentMonster };
      
      // Calculate player damage
      let damage = character.staerke;
      if (character.ausgeruestet) {
        damage += character.ausgeruestet.boni.staerke || 0;
      }
      
      monster.hp = Math.max(0, monster.hp - damage);
      newState.combatLog = [...newState.combatLog, `Du greifst an und machst ${damage} Schaden!`];
      
      // Check if monster is defeated
      if (monster.hp <= 0) {
        return handleCombatVictory(newState, monster);
      }
      
      // Monster attacks back
      return handleMonsterAttack(newState, monster);
    }

    case 'CAST_SPELL': {
      if (!state.currentMonster) return state;
      
      const newState = { ...state };
      const { character } = newState;
      const monster = { ...newState.currentMonster };
      
      // Calculate spell damage
      const damage = character.intelligenz * 1.5;
      
      monster.hp = Math.max(0, monster.hp - damage);
      newState.combatLog = [...newState.combatLog, `Du wirkst ${action.spell} und verursachst ${damage} Schaden!`];
      
      // Check if monster is defeated
      if (monster.hp <= 0) {
        return handleCombatVictory(newState, monster);
      }
      
      // Monster attacks back
      return handleMonsterAttack(newState, monster);
    }

    case 'USE_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      const item = character.inventar[action.itemIndex];
      
      if (item && item.typ === "verbrauchbar") {
        if (item.boni.heilung) {
          const healAmount = item.boni.heilung;
          character.hp = Math.min(character.hp + healAmount, character.max_hp);
          character.inventar.splice(action.itemIndex, 1);
          
          newState.combatLog = [...newState.combatLog, `Du wurdest um ${healAmount} HP geheilt!`];
        }
      }
      
      // If in combat, monster attacks
      if (newState.currentMonster && newState.currentMonster.hp > 0) {
        return handleMonsterAttack(newState, newState.currentMonster);
      }
      
      return newState;
    }

    case 'FLEE_COMBAT': {
      const newState = { ...state };
      
      // 50% chance to flee
      if (Math.random() < 0.5) {
        newState.combatLog = [...newState.combatLog, "Flucht erfolgreich!"];
        newState.currentMonster = null;
        newState.gameScreen = 'main';
        return newState;
      }
      
      newState.combatLog = [...newState.combatLog, "Flucht gescheitert!"];
      
      // Monster attacks
      return handleMonsterAttack(newState, newState.currentMonster!);
    }

    case 'END_COMBAT':
      return {
        ...state,
        currentMonster: null,
        gameScreen: 'main'
      };

    case 'BUY_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      const item = action.item;
      
      if (character.gold >= item.preis) {
        character.gold -= item.preis;
        character.inventar.push(item);
        toast.success(`${item.name} gekauft!`);
      } else {
        toast.error("Nicht genug Gold!");
      }
      
      return newState;
    }

    case 'EQUIP_ITEM': {
      const newState = { ...state };
      newState.character.ausgeruestet = action.item;
      return newState;
    }

    case 'USE_INVENTORY_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      const item = character.inventar[action.itemIndex];
      
      if (item && item.typ === "verbrauchbar" && item.boni.heilung) {
        const healAmount = item.boni.heilung;
        character.hp = Math.min(character.hp + healAmount, character.max_hp);
        character.inventar.splice(action.itemIndex, 1);
        toast.success(`Du wurdest um ${healAmount} HP geheilt!`);
      }
      
      return newState;
    }

    case 'DROP_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      
      if (action.itemIndex >= 0 && action.itemIndex < character.inventar.length) {
        const droppedItem = character.inventar[action.itemIndex];
        character.inventar.splice(action.itemIndex, 1);
        
        // If dropped equipped item, unequip it
        if (character.ausgeruestet === droppedItem) {
          character.ausgeruestet = null;
        }
        
        toast.info(`${droppedItem.name} weggeworfen`);
      }
      
      return newState;
    }

    case 'TAKE_QUEST': {
      const newState = { ...state };
      newState.character.quest_log.push(action.quest);
      toast.success(`Quest angenommen: ${action.quest.name}`);
      return newState;
    }

    case 'TRAIN_ATTRIBUTE': {
      const newState = { ...state };
      const { character } = newState;
      
      if (character.gold >= 20) {
        character.gold -= 20;
        character[action.attribute] += 1;
        toast.success(`${action.attribute} erhöht!`);
      } else {
        toast.error("Nicht genug Gold!");
      }
      
      return newState;
    }

    case 'LEARN_SPELL': {
      const newState = { ...state };
      const { character } = newState;
      
      if (character.gold >= 50 && !character.zauber.includes(action.spell)) {
        character.gold -= 50;
        character.zauber.push(action.spell);
        toast.success(`Zauber gelernt: ${action.spell}`);
      }
      
      return newState;
    }

    case 'CHANGE_SCREEN':
      return {
        ...state,
        gameScreen: action.screen
      };

    case 'UPDATE_COMBAT_LOG':
      return {
        ...state,
        combatLog: [...state.combatLog, action.message]
      };

    case 'SAVE_GAME':
      const saveData = {
        name: state.character.name,
        hp: state.character.hp,
        max_hp: state.character.max_hp,
        staerke: state.character.staerke,
        intelligenz: state.character.intelligenz,
        ausweichen: state.character.ausweichen,
        xp: state.character.xp,
        level: state.character.level,
        gold: state.character.gold,
        aktueller_ort: state.character.aktueller_ort,
        zauber: state.character.zauber,
        inventar: state.character.inventar,
        quest_log: state.character.quest_log,
        ausgeruestet: state.character.ausgeruestet
      };
      
      localStorage.setItem(`rpg_save_${state.character.name}`, JSON.stringify(saveData));
      toast.success("Spiel gespeichert!");
      
      return {
        ...state,
        loadedCharacters: [...new Set([...state.loadedCharacters, state.character.name])]
      };

    default:
      return state;
  }
};

// Helper function for monster attack logic
const handleMonsterAttack = (state: GameState, monster: Monster): GameState => {
  const { character } = state;
  
  // Check if player dodges
  if (Math.random() * 100 <= character.ausweichen) {
    state.combatLog = [...state.combatLog, "Du weichst dem Angriff aus!"];
    state.currentMonster = monster;
    return state;
  }
  
  const damage = monster.staerke;
  character.hp = Math.max(0, character.hp - damage);
  
  state.combatLog = [...state.combatLog, `${monster.name} greift an und macht ${damage} Schaden!`];
  state.currentMonster = monster;
  
  // Check if player is defeated
  if (character.hp <= 0) {
    character.hp = 1; // Prevent death
    character.gold = Math.max(0, character.gold - 20);
    character.aktueller_ort = "Stadt";
    
    state.combatLog = [
      ...state.combatLog, 
      "Du wurdest besiegt!", 
      "Du wachst in der Stadt auf und hast etwas Gold verloren..."
    ];
    state.currentMonster = null;
    state.gameScreen = 'main';
  }
  
  return state;
};

// Helper function for monster victory logic
const handleCombatVictory = (state: GameState, monster: Monster): GameState => {
  const { character } = state;
  
  // Gain XP and Gold
  character.xp += monster.xp;
  const goldEarned = Math.floor(Math.random() * 16) + 5; // 5-20 gold
  character.gold += goldEarned;
  
  state.combatLog = [
    ...state.combatLog,
    `Du hast ${monster.name} besiegt!`,
    `Du erhältst ${monster.xp} XP und ${goldEarned} Gold!`
  ];
  
  // Random loot (30% chance)
  if (monster.loot.length > 0 && Math.random() < 0.3) {
    const lootIndex = Math.floor(Math.random() * monster.loot.length);
    const lootItem = monster.loot[lootIndex];
    character.inventar.push(lootItem);
    state.combatLog = [...state.combatLog, `Du findest ${lootItem.name}!`];
  }
  
  // Check for quest progress
  for (const quest of character.quest_log) {
    if (!quest.abgeschlossen && quest.ziel_typ === monster.name) {
      quest.aktuelle_anzahl += 1;
      
      // Check if quest is complete
      if (quest.aktuelle_anzahl >= quest.ziel_anzahl) {
        quest.abgeschlossen = true;
        character.gold += quest.belohnung_gold;
        character.xp += quest.belohnung_xp;
        
        state.combatLog = [
          ...state.combatLog,
          `Quest "${quest.name}" abgeschlossen!`,
          `Du erhältst ${quest.belohnung_gold} Gold und ${quest.belohnung_xp} XP!`
        ];
        
        if (quest.belohnung_item) {
          character.inventar.push(quest.belohnung_item);
          state.combatLog = [...state.combatLog, `Du erhältst ${quest.belohnung_item.name}!`];
        }
      } else {
        state.combatLog = [
          ...state.combatLog,
          `Quest-Fortschritt "${quest.name}": ${quest.aktuelle_anzahl}/${quest.ziel_anzahl}`
        ];
      }
    }
  }
  
  // Check for level up
  if (character.xp >= character.level * 100) {
    character.level += 1;
    character.max_hp += 20;
    character.hp = character.max_hp;
    character.staerke += 2;
    character.intelligenz += 2;
    character.ausweichen += 1;
    
    state.combatLog = [...state.combatLog, `Level Up! Du bist jetzt Level ${character.level}!`];
  }
  
  state.currentMonster = null;
  state.gameScreen = 'main';
  return state;
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  loadSavedCharacters: () => string[];
  loadCharacter: (name: string) => void;
}

const GameContext = createContext<GameContextType>({
  state: initialState,
  dispatch: () => null,
  loadSavedCharacters: () => [],
  loadCharacter: () => {}
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved characters on initial render
  useEffect(() => {
    const loadSavedCharacters = () => {
      const characters: string[] = [];
      
      // Check local storage for saved characters
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rpg_save_')) {
          const charName = key.replace('rpg_save_', '');
          characters.push(charName);
        }
      }
      
      return characters;
    };
    
    const savedChars = loadSavedCharacters();
    if (savedChars.length > 0) {
      dispatch({ type: 'CHANGE_SCREEN', screen: state.gameScreen });
    }
  }, []);

  const loadSavedCharacters = () => {
    const characters: string[] = [];
    
    // Check local storage for saved characters
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rpg_save_')) {
        const charName = key.replace('rpg_save_', '');
        characters.push(charName);
      }
    }
    
    return characters;
  };

  const loadCharacter = (name: string) => {
    const saveKey = `rpg_save_${name}`;
    const savedData = localStorage.getItem(saveKey);
    
    if (savedData) {
      try {
        const characterData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_CHARACTER', character: characterData as Character });
      } catch (error) {
        console.error("Failed to load character:", error);
        toast.error("Fehler beim Laden des Charakters");
      }
    } else {
      toast.error("Kein Spielstand gefunden");
    }
  };
  
  return (
    <GameContext.Provider value={{ state, dispatch, loadSavedCharacters, loadCharacter }}>
      {children}
    </GameContext.Provider>
  );
};
