import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { Character, GameAction, GameState, Item, Monster, Quest, Equipment } from '../types/game';
import { items, monster_templates, npcs, orte, standard_quests } from '../data/gameData';
import zauberDefinitionen from '../data/zauberData';

// Initial equipment state
const initialEquipment: Equipment = {
  waffe: null,
  ruestung: null,
  helm: null,
  accessoire: null
};

// Initial character state
const createInitialCharacter = (name: string): Character => ({
  name,
  hp: 100,
  max_hp: 100,
  staerke: 10,
  intelligenz: 10,
  ausweichen: 5,
  verteidigung: 0,     // New defense stat
  xp: 0,
  level: 1,
  gold: 50,
  inventar: [],
  ausgeruestet: initialEquipment,
  zauber: [],
  aktueller_ort: "Stadt",
  quest_log: [],
  unverteilte_punkte: 0 // Unassigned stat points
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
  loadedCharacters: [],
  zauberDefinitionen // Add spell definitions
};

// Get total bonus from all equipped items
const getTotalBonus = (equipment: Equipment, bonusName: string): number => {
  let totalBonus = 0;
  
  if (equipment.waffe && equipment.waffe.boni[bonusName]) {
    totalBonus += equipment.waffe.boni[bonusName];
  }
  if (equipment.ruestung && equipment.ruestung.boni[bonusName]) {
    totalBonus += equipment.ruestung.boni[bonusName];
  }
  if (equipment.helm && equipment.helm.boni[bonusName]) {
    totalBonus += equipment.helm.boni[bonusName];
  }
  if (equipment.accessoire && equipment.accessoire.boni[bonusName]) {
    totalBonus += equipment.accessoire.boni[bonusName];
  }
  
  return totalBonus;
};

// Process status effects
const processStatusEffects = (entity: Monster | Character, combatLog: string[]): [Monster | Character, string[]] => {
  if (!entity.statusEffekte || entity.statusEffekte.length === 0) return [entity, combatLog];
  
  const updatedEntity = { ...entity };
  const newLog = [...combatLog];
  const remainingEffects = [];
  
  for (const effect of updatedEntity.statusEffekte) {
    effect.dauer -= 1;
    
    if (effect.dauer > 0) {
      // Apply effect damage if there's any
      if (effect.schaden) {
        updatedEntity.hp = Math.max(0, updatedEntity.hp - effect.schaden);
        
        switch (effect.name) {
          case "Brennen":
            newLog.push(`${entity.name} erleidet ${effect.schaden} Schaden durch Verbrennung.`);
            break;
          case "Gefroren":
            newLog.push(`${entity.name} erleidet ${effect.schaden} Schaden durch Frost.`);
            break;
          default:
            newLog.push(`${entity.name} erleidet ${effect.schaden} Schaden durch ${effect.name}.`);
        }
      }
      
      // Keep the effect active
      remainingEffects.push(effect);
    } else {
      newLog.push(`${effect.name} endet bei ${entity.name}.`);
    }
  }
  
  updatedEntity.statusEffekte = remainingEffects;
  return [updatedEntity, newLog];
};

// Apply a status effect to an entity
const applyStatusEffect = (
  entity: Monster | Character, 
  effectName: string, 
  duration: number, 
  damage: number = 0
): Monster | Character => {
  const updatedEntity = { ...entity };
  
  if (!updatedEntity.statusEffekte) {
    updatedEntity.statusEffekte = [];
  }
  
  // Check if effect already exists
  const existingEffectIndex = updatedEntity.statusEffekte.findIndex(e => e.name === effectName);
  
  if (existingEffectIndex >= 0) {
    // Refresh duration if the effect already exists
    updatedEntity.statusEffekte[existingEffectIndex].dauer = Math.max(
      updatedEntity.statusEffekte[existingEffectIndex].dauer,
      duration
    );
    updatedEntity.statusEffekte[existingEffectIndex].schaden = damage;
  } else {
    // Add new effect
    updatedEntity.statusEffekte.push({
      name: effectName,
      dauer: duration,
      schaden: damage
    });
  }
  
  return updatedEntity;
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
      
      // Increased random encounter chance (50% chance instead of 30%)
      // Higher chance in dungeon-like locations
      let encounterChance = 0.5;
      if (action.location === "Höhle" || action.location === "Berge") {
        encounterChance = 0.7; // 70% chance in dungeon-like locations
      }
      
      if (Math.random() < encounterChance && action.location !== 'Stadt') {
        const location = action.location;
        const possibleMonsters = state.monsters[location] || [];
        
        if (possibleMonsters.length > 0) {
          // Boss encounter chance (10%)
          const isBossEncounter = Math.random() < 0.1;
          
          // Select a monster based on probability
          const monsterTemplate = { ...possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)] };
          const monster: Monster = { ...monsterTemplate };
          
          // If boss encounter, enhance the monster
          if (isBossEncounter) {
            monster.isBoss = true;
            monster.name = `Boss ${monster.name}`;
            monster.hp = Math.floor(monster.max_hp * 1.5);
            monster.max_hp = monster.hp;
            monster.staerke = Math.floor(monster.staerke * 1.5);
            monster.verteidigung = monster.verteidigung 
              ? Math.floor(monster.verteidigung * 1.2) 
              : Math.floor(monster.staerke * 0.3); // Default defense
            monster.xp = Math.floor(monster.xp * 2);
            monster.lootChance = 0.8; // 80% loot chance for bosses
          } else {
            monster.lootChance = monster.lootChance || 0.3; // Default 30% loot chance
            if (!monster.verteidigung) {
              monster.verteidigung = Math.floor(monster.staerke * 0.2); // Default defense for regular monsters
            }
          }
          
          newState.currentMonster = monster;
          newState.gameScreen = 'combat';
          newState.combatLog = [
            isBossEncounter 
              ? `Ein mächtiger Boss erscheint: ${monster.name}!` 
              : `Ein ${monster.name} erscheint!`
          ];
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
      let monster = { ...newState.currentMonster };
      
      // Check for status effects on character first
      const [updatedCharacter, characterStatusLog] = processStatusEffects(character, []);
      newState.character = updatedCharacter as Character;
      newState.combatLog = [...newState.combatLog, ...characterStatusLog];
      
      // Check for "Betäubt" status on monster which prevents it from attacking this turn
      const monsterStunned = monster.statusEffekte?.some(effect => 
        effect.name === "Betäubt" && effect.dauer > 0
      );
      
      // Calculate player damage with bonuses from all equipment
      let damage = character.staerke;
      damage += getTotalBonus(character.ausgeruestet, 'staerke');
      
      // Critical hit chance (10% base + intelligence bonus)
      const critChance = 0.1 + ((character.intelligenz - 10) * 0.01);
      let isCriticalHit = Math.random() < critChance;
      
      // Life steal chance from weapon
      let lifeStealAmount = 0;
      const weapon = character.ausgeruestet.waffe;
      if (weapon && weapon.faehigkeit === "lebensraub") {
        lifeStealAmount = Math.floor(damage * 0.2); // 20% life steal
      }
      
      // Apply critical hit
      if (isCriticalHit) {
        damage = Math.floor(damage * 1.5);
        newState.combatLog = [...newState.combatLog, `Kritischer Treffer! +50% Schaden!`];
      }
      
      // Apply monster defense
      const monsterDefense = monster.verteidigung || 0;
      const finalDamage = Math.max(1, damage - monsterDefense);
      
      monster.hp = Math.max(0, monster.hp - finalDamage);
      newState.combatLog = [
        ...newState.combatLog, 
        `Du greifst an und machst ${finalDamage} Schaden!`
      ];
      
      // Apply life steal if available
      if (lifeStealAmount > 0) {
        character.hp = Math.min(character.max_hp, character.hp + lifeStealAmount);
        newState.combatLog = [...newState.combatLog, `Du stiehlst ${lifeStealAmount} Lebenspunkte!`];
      }
      
      // Add status effects from weapons
      if (weapon && weapon.statusEffekt) {
        monster = applyStatusEffect(
          monster, 
          weapon.statusEffekt, 
          weapon.statusDauer || 3, 
          weapon.boni.statusSchaden || Math.floor(damage * 0.2)
        ) as Monster;
        
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} leidet unter ${weapon.statusEffekt}!`
        ];
      }
      
      // Process status effects on monster
      const [updatedMonster, monsterStatusLog] = processStatusEffects(monster, []);
      monster = updatedMonster as Monster;
      newState.combatLog = [...newState.combatLog, ...monsterStatusLog];
      newState.currentMonster = monster;
      
      // Check if monster is defeated
      if (monster.hp <= 0) {
        return handleCombatVictory(newState, monster);
      }
      
      // Monster attacks back if not stunned
      if (!monsterStunned) {
        return handleMonsterAttack(newState, monster);
      } else {
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} ist betäubt und kann nicht angreifen!`
        ];
        return newState;
      }
    }

    case 'CAST_SPELL': {
      if (!state.currentMonster) return state;
      
      const newState = { ...state };
      const { character } = newState;
      let monster = { ...newState.currentMonster };
      const spellName = action.spell;
      const spellDef = state.zauberDefinitionen[spellName];
      
      if (!spellDef) {
        newState.combatLog = [
          ...newState.combatLog, 
          `Fehler: Zauber ${spellName} nicht gefunden!`
        ];
        return newState;
      }
      
      // Check for status effects on character first
      const [updatedCharacter, characterStatusLog] = processStatusEffects(character, []);
      newState.character = updatedCharacter as Character;
      newState.combatLog = [...newState.combatLog, ...characterStatusLog];
      
      // Calculate spell effects
      if (spellDef.schaden) {
        // Calculate damage based on intelligence
        let damage = spellDef.schaden;
        if (spellDef.schadenFaktor) {
          damage += Math.floor(character.intelligenz * spellDef.schadenFaktor);
        }
        
        // Add bonus from equipment
        damage += getTotalBonus(character.ausgeruestet, 'intelligenz');
        
        // Apply monster defense (but less effective against magic)
        const monsterDefense = monster.verteidigung || 0;
        const defenseVsMagic = Math.floor(monsterDefense * 0.6); // 60% effective against magic
        const finalDamage = Math.max(1, damage - defenseVsMagic);
        
        monster.hp = Math.max(0, monster.hp - finalDamage);
        newState.combatLog = [
          ...newState.combatLog, 
          `Du wirkst ${spellName} und verursachst ${finalDamage} Schaden!`
        ];
      }
      
      // Apply healing if spell has healing
      if (spellDef.heilung) {
        let healing = spellDef.heilung;
        if (spellDef.heilungFaktor) {
          healing += Math.floor(character.intelligenz * spellDef.heilungFaktor);
        }
        
        character.hp = Math.min(character.max_hp, character.hp + healing);
        newState.combatLog = [
          ...newState.combatLog, 
          `Du regenerierst ${healing} Lebenspunkte durch ${spellName}!`
        ];
      }
      
      // Apply status effects if the spell has any
      if (spellDef.statusEffekt) {
        const effectDamage = Math.floor((character.intelligenz * 0.25) + (spellDef.schaden || 0) * 0.3);
        
        monster = applyStatusEffect(
          monster,
          spellDef.statusEffekt,
          spellDef.statusDauer || 2,
          effectDamage
        ) as Monster;
        
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} leidet unter ${spellDef.statusEffekt}!`
        ];
      }
      
      // Process status effects on monster
      const [updatedMonster, monsterStatusLog] = processStatusEffects(monster, []);
      monster = updatedMonster as Monster;
      newState.combatLog = [...newState.combatLog, ...monsterStatusLog];
      newState.currentMonster = monster;
      
      // Check if monster is defeated
      if (monster.hp <= 0) {
        return handleCombatVictory(newState, monster);
      }
      
      // Check for "Betäubt" status on monster which prevents it from attacking this turn
      const monsterStunned = monster.statusEffekte?.some(effect => 
        effect.name === "Betäubt" && effect.dauer > 0
      );
      
      // Monster attacks back if not stunned
      if (!monsterStunned) {
        return handleMonsterAttack(newState, monster);
      } else {
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} ist betäubt und kann nicht angreifen!`
        ];
        return newState;
      }
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
        
        // Apply status effects if the item has any
        if (item.statusEffekt && newState.currentMonster) {
          const effectDamage = item.boni.statusSchaden || 5;
          newState.currentMonster = applyStatusEffect(
            newState.currentMonster,
            item.statusEffekt,
            item.statusDauer || 2,
            effectDamage
          ) as Monster;
          
          newState.combatLog = [
            ...newState.combatLog, 
            `${newState.currentMonster.name} leidet unter ${item.statusEffekt}!`
          ];
        }
      }
      
      // If in combat, monster attacks
      if (newState.currentMonster && newState.currentMonster.hp > 0) {
        // Check for "Betäubt" status on monster which prevents it from attacking this turn
        const monsterStunned = newState.currentMonster.statusEffekte?.some(effect => 
          effect.name === "Betäubt" && effect.dauer > 0
        );
        
        if (!monsterStunned) {
          return handleMonsterAttack(newState, newState.currentMonster);
        } else {
          newState.combatLog = [
            ...newState.combatLog, 
            `${newState.currentMonster.name} ist betäubt und kann nicht angreifen!`
          ];
        }
      }
      
      return newState;
    }

    case 'FLEE_COMBAT': {
      const newState = { ...state };
      
      // Harder to flee from bosses (30% chance) vs regular monsters (50% chance)
      const fleeChance = newState.currentMonster?.isBoss ? 0.3 : 0.5;
      
      if (Math.random() < fleeChance) {
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

    case 'SELL_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      const item = character.inventar[action.itemIndex];
      
      // Check if item is not equipped
      if (isItemEquipped(item, character.ausgeruestet)) {
        toast.error("Du kannst ausgerüstete Items nicht verkaufen!");
        return newState;
      }
      
      // Find NPC
      const npc = Object.values(newState.npcs).find(n => n.name === action.npc);
      if (!npc) {
        toast.error("Händler nicht gefunden!");
        return newState;
      }
      
      // Check if NPC buys this type of item
      if (!npc.kauft || (!npc.kauft.includes(item.typ) && !npc.kauft.includes('*'))) {
        toast.error(`${npc.name} kauft keine ${item.typ} Items!`);
        return newState;
      }
      
      // Calculate sell price (50% of buy price by default)
      const sellPrice = item.verkaufspreis || Math.floor(item.preis * 0.5);
      character.gold += sellPrice;
      character.inventar.splice(action.itemIndex, 1);
      
      toast.success(`${item.name} für ${sellPrice} Gold verkauft!`);
      return newState;
    }

    case 'EQUIP_ITEM': {
      const newState = { ...state };
      const item = action.item;
      const equipment = {...newState.character.ausgeruestet};
      
      // Assign item to the correct equipment slot based on its type
      switch(item.typ) {
        case 'waffe':
          equipment.waffe = item;
          break;
        case 'ruestung':
          equipment.ruestung = item;
          break;
        case 'helm':
          equipment.helm = item;
          break;
        case 'accessoire':
          equipment.accessoire = item;
          break;
        default:
          toast.error(`Kann nicht ausgerüstet werden: ${item.typ}`);
          return newState;
      }
      
      newState.character.ausgeruestet = equipment;
      toast.success(`${item.name} ausgerüstet!`);
      return newState;
    }

    case 'USE_INVENTORY_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      const item = character.inventar[action.itemIndex];
      
      if (item && item.typ === "verbrauchbar") {
        if (item.boni.heilung) {
          const healAmount = item.boni.heilung;
          character.hp = Math.min(character.hp + healAmount, character.max_hp);
          character.inventar.splice(action.itemIndex, 1);
          toast.success(`Du wurdest um ${healAmount} HP geheilt!`);
        }
      }
      
      return newState;
    }

    case 'DROP_ITEM': {
      const newState = { ...state };
      const { character } = newState;
      
      if (action.itemIndex >= 0 && action.itemIndex < character.inventar.length) {
        const droppedItem = character.inventar[action.itemIndex];
        character.inventar.splice(action.itemIndex, 1);
        
        // Check if the dropped item is equipped, and unequip it if so
        const equipment = character.ausgeruestet;
        if (equipment.waffe === droppedItem) {
          equipment.waffe = null;
        } else if (equipment.ruestung === droppedItem) {
          equipment.ruestung = null;
        } else if (equipment.helm === droppedItem) {
          equipment.helm = null;
        } else if (equipment.accessoire === droppedItem) {
          equipment.accessoire = null;
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

    case 'ASSIGN_STAT_POINT': {
      const newState = { ...state };
      const { character } = newState;
      
      if (character.unverteilte_punkte > 0) {
        character[action.attribute] += 1;
        character.unverteilte_punkte -= 1;
        toast.success(`${action.attribute} erhöht!`);
      } else {
        toast.error("Keine freien Statpunkte verfügbar!");
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

    case 'SAVE_GAME': {
      const saveData = {
        name: state.character.name,
        hp: state.character.hp,
        max_hp: state.character.max_hp,
        staerke: state.character.staerke,
        intelligenz: state.character.intelligenz,
        ausweichen: state.character.ausweichen,
        verteidigung: state.character.verteidigung,
        xp: state.character.xp,
        level: state.character.level,
        gold: state.character.gold,
        aktueller_ort: state.character.aktueller_ort,
        zauber: state.character.zauber,
        inventar: state.character.inventar,
        quest_log: state.character.quest_log,
        ausgeruestet: state.character.ausgeruestet,
        unverteilte_punkte: state.character.unverteilte_punkte,
        statusEffekte: state.character.statusEffekte
      };
      
      localStorage.setItem(`rpg_save_${state.character.name}`, JSON.stringify(saveData));
      toast.success("Spiel gespeichert!");
      
      return {
        ...state,
        loadedCharacters: [...new Set([...state.loadedCharacters, state.character.name])]
      };
    }

    default:
      return state;
  }
};

// Check if an item is equipped
const isItemEquipped = (item: Item, equipment: Equipment): boolean => {
  return (
    equipment.waffe === item ||
    equipment.ruestung === item ||
    equipment.helm === item ||
    equipment.accessoire === item
  );
};

// Helper function for monster attack logic
const handleMonsterAttack = (state: GameState, monster: Monster): GameState => {
  const { character } = state;
  
  // Apply dodge chance with bonus from all equipment
  const ausweichenBonus = getTotalBonus(character.ausgeruestet, 'ausweichen');
  const totalAusweichen = character.ausweichen + ausweichenBonus;
  
  if (Math.random() * 100 <= totalAusweichen) {
    state.combatLog = [...state.combatLog, "Du weichst dem Angriff aus!"];
    state.currentMonster = monster;
    return state;
  }
  
  // Calculate damage reduction from armor
  const verteidigungBonus = getTotalBonus(character.ausgeruestet, 'verteidigung');
  const totalVerteidigung = character.verteidigung + verteidigungBonus;
  
  // Bosses deal more damage
  let damage = monster.isBoss 
    ? monster.staerke + Math.floor(Math.random() * 5) // Bosses have variable damage
    : monster.staerke;
  
  // Apply damage reduction: each point of defense reduces damage by 5%
  const damageReduction = Math.min(0.75, totalVerteidigung * 0.05); // Cap at 75% reduction
  damage = Math.max(1, Math.floor(damage * (1 - damageReduction)));
    
  character.hp = Math.max(0, character.hp - damage);
  
  const attackMessage = monster.isBoss
    ? `${monster.name} schlägt mit voller Kraft zu und macht ${damage} Schaden!`
    : `${monster.name} greift an und macht ${damage} Schaden!`;
    
  state.combatLog = [...state.combatLog, attackMessage];
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
  
  // Bosses drop more gold
  const goldEarned = monster.isBoss
    ? Math.floor(Math.random() * 30) + 20 // 20-50 gold for bosses
    : Math.floor(Math.random() * 16) + 5; // 5-20 gold for regular monsters
    
  character.gold += goldEarned;
  
  const victoryMessage = monster.isBoss
    ? `Du hast den mächtigen ${monster.name} besiegt!`
    : `Du hast ${monster.name} besiegt!`;
    
  state.combatLog = [
    ...state.combatLog,
    victoryMessage,
    `Du erhältst ${monster.xp} XP und ${goldEarned} Gold!`
  ];
  
  // Enhanced loot system
  // Boss has guaranteed loot (possibly multiple items)
  if (monster.loot.length > 0) {
    const lootChance = monster.lootChance || 0.3; // Default 30% chance, bosses have 80%
    
    if (Math.random() < lootChance) {
      // For bosses, possibly multiple items
      if (monster.isBoss && monster.loot.length > 1 && Math.random() < 0.5) {
        // 50% chance for bosses to drop 2 items
        const numItems = Math.min(2, monster.loot.length);
        const selectedItems = [];
        
        // Select unique items
        const availableIndices = Array.from({ length: monster.loot.length }, (_, i) => i);
        for (let i = 0; i < numItems; i++) {
          const randomIndex = Math.floor(Math.random() * availableIndices.length);
          const itemIndex = availableIndices[randomIndex];
          availableIndices.splice(randomIndex, 1);
          selectedItems.push(monster.loot[itemIndex]);
        }
        
        // Add items to inventory
        for (const lootItem of selectedItems) {
          character.inventar.push(lootItem);
          state.combatLog = [...state.combatLog, `Du findest ${lootItem.name}!`];
        }
        
        // Special message for multiple items
        if (selectedItems.length > 1) {
          state.combatLog = [...state.combatLog, `Seltener Fund: ${selectedItems.length} Items erbeutet!`];
        }
      } else {
        // Regular loot - one item
        const lootIndex = Math.floor(Math.random() * monster.loot.length);
        const lootItem = monster.loot[lootIndex];
        character.inventar.push(lootItem);
        
        const lootMessage = monster.isBoss
          ? `Seltener Fund: Du findest ${lootItem.name}!`
          : `Du findest ${lootItem.name}!`;
          
        state.combatLog = [...state.combatLog, lootMessage];
      }
    }
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
    
    // Give stat points instead of increasing stats directly
    character.unverteilte_punkte += 5;
    
    state.combatLog = [
      ...state.combatLog, 
      `Level Up! Du bist jetzt Level ${character.level}!`,
      `Du erhältst 5 Statpunkte zum Verteilen!`
    ];
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
