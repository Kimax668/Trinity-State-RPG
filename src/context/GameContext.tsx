import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { Character, GameAction, GameState, Item, Monster, Quest, Equipment, Location } from '../types/game';
import { items, monster_templates, npcs, orte, standard_quests } from '../data/gameData';
import zauberDefinitionen from '../data/zauberData';

// Initial locations with details
const initialOrteDetails: Record<string, Location> = {
  "Hauptstadt": {
    name: "Hauptstadt",
    beschreibung: "Das Zentrum des Königreichs mit vielen Händlern und Dienstleistungen.",
    entdeckt: true,
    istDorf: false
  },
  "Wald": {
    name: "Wald",
    beschreibung: "Ein dichter Wald voller Leben und Gefahren.",
    entdeckt: true,
    monsterLevel: 1
  },
  "Berge": {
    name: "Berge",
    beschreibung: "Raue und gefährliche Berge mit starken Gegnern.",
    entdeckt: true,
    monsterLevel: 5
  },
  "See": {
    name: "See",
    beschreibung: "Ein großer See mit mysteriösen Kreaturen.",
    entdeckt: true,
    monsterLevel: 3
  },
  "Höhle": {
    name: "Höhle",
    beschreibung: "Eine dunkle Höhle voller Monster.",
    entdeckt: true,
    monsterLevel: 7
  },
  "Wüste": {
    name: "Wüste",
    beschreibung: "Eine heiße und unwirtliche Wüste.",
    entdeckt: true,
    monsterLevel: 10
  },
  "Dornendorf": {
    name: "Dornendorf",
    beschreibung: "Ein kleines Dorf am Rande des Waldes.",
    entdeckt: false,
    istDorf: true,
    minLevel: 3
  },
  "Bergfried": {
    name: "Bergfried",
    beschreibung: "Ein Dorf in den Bergen, bekannt für seine Schmiede.",
    entdeckt: false,
    istDorf: true,
    minLevel: 8
  },
  "Seehain": {
    name: "Seehain",
    beschreibung: "Ein Fischerdorf am Ufer des großen Sees.",
    entdeckt: false,
    istDorf: true,
    minLevel: 5
  },
  "Verlorene Ruinen": {
    name: "Verlorene Ruinen",
    beschreibung: "Uralte Ruinen mit gefährlichen Untoten.",
    entdeckt: false,
    monsterLevel: 12,
    minLevel: 10
  },
  "Tiefer Wald": {
    name: "Tiefer Wald",
    beschreibung: "Der tiefste Teil des Waldes mit mächtigen Kreaturen.",
    entdeckt: false,
    monsterLevel: 8,
    minLevel: 7
  },
  "Verlassene Mine": {
    name: "Verlassene Mine",
    beschreibung: "Eine alte Mine voller Monster und Schätze.",
    entdeckt: false,
    monsterLevel: 15,
    minLevel: 12
  }
};

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
  mana: 50,         // Initiale Mana-Werte
  max_mana: 50,     // Initiale max_mana-Werte
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
  aktueller_ort: "Hauptstadt",
  quest_log: [],
  unverteilte_punkte: 0, // Unassigned stat points
  entdeckte_orte: ["Hauptstadt", "Wald", "Berge", "See", "Höhle", "Wüste"]
});

// Initial game state
const initialState: GameState = {
  character: createInitialCharacter(''),
  items,
  monsters: monster_templates,
  npcs,
  quests: standard_quests,
  orte: ["Hauptstadt", "Wald", "Berge", "See", "Höhle", "Wüste"],
  orteDetails: initialOrteDetails,
  currentMonster: null,
  combatLog: [],
  gameScreen: 'start', // 'start', 'main', 'combat', 'shop', etc.
  loadedCharacters: [],
  zauberDefinitionen, // Add spell definitions
  autoSave: true,
  trainingCosts: {
    basis: 20,
    multiplikator: 0.5 // +50% cost per level
  },
  zauberkostenFaktor: 10 // Base factor for spell costs
};

// Function to generate a unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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

// Calculate training cost based on character level and number of times trained
const calculateTrainingCost = (level: number, baseCost: number, multiplier: number, trainingCount: number = 0): number => {
  // Base cost scaled by level
  const levelCost = Math.floor(baseCost * (1 + ((level - 1) * multiplier)));
  
  // Additional cost increase based on how many times this attribute has been trained
  const trainingMultiplier = 1 + (trainingCount * 0.25); // +25% per training
  
  return Math.floor(levelCost * trainingMultiplier);
};

// Calculate spell learning cost based on level, spell power, and price factor
const calculateSpellCost = (level: number, spellDef: any, baseFactor: number): number => {
  // Base cost determined by character level and base factor
  let cost = baseFactor * (1 + (level * 0.2));
  
  // Adjust for spell level requirement
  if (spellDef.minLevel) {
    cost *= (1 + ((spellDef.minLevel - 1) * 0.1));
  }
  
  // Adjust for spell price factor if defined
  if (spellDef.preisFaktor) {
    cost *= spellDef.preisFaktor;
  }
  
  // Adjust for spell power (damage or healing)
  if (spellDef.schaden || spellDef.heilung) {
    const power = Math.max(spellDef.schaden || 0, spellDef.heilung || 0);
    cost *= (1 + (power * 0.01));
  }
  
  return Math.floor(cost);
};

// Check if character can discover a new location based on level
const checkLocationDiscovery = (character: Character, orteDetails: Record<string, Location>): string | null => {
  // Get undiscovered locations that meet level requirements
  const discoverable = Object.entries(orteDetails)
    .filter(([_, location]) => !location.entdeckt && 
                             (!location.minLevel || character.level >= location.minLevel))
    .map(([name, _]) => name);
                             
  if (discoverable.length === 0) return null;
  
  // 15% chance of discovery when traveling
  if (Math.random() < 0.15) {
    return discoverable[Math.floor(Math.random() * discoverable.length)];
  }
  
  return null;
};

// Auto-save function
const performAutoSave = (state: GameState) => {
  // Don't autosave if disabled or no character name
  if (!state.autoSave || !state.character.name) return state;
  
  // Only save every 2 minutes
  const now = Date.now();
  if (state.letzteSpeicherung && (now - state.letzteSpeicherung) < 120000) {
    return state;
  }
  
  try {
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
      statusEffekte: state.character.statusEffekte,
      entdeckte_orte: state.character.entdeckte_orte
    };
    
    localStorage.setItem(`rpg_save_${state.character.name}`, JSON.stringify(saveData));
    console.log("Spiel automatisch gespeichert:", new Date().toLocaleTimeString());
    
    return {
      ...state,
      letzteSpeicherung: now,
      loadedCharacters: [...new Set([...state.loadedCharacters, state.character.name])]
    };
  } catch (error) {
    console.error("Fehler beim automatischen Speichern:", error);
    return state;
  }
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState = { ...state };
  
  switch (action.type) {
    case 'CREATE_CHARACTER': {
      const character = createInitialCharacter(action.name);
      // Initialize attribute training count
      character.attributeTrainingCount = {
        staerke: 0,
        intelligenz: 0,
        ausweichen: 0,
        verteidigung: 0,
        mana: 0          // Mana-Training-Zähler initialisieren
      };
      
      newState = {
        ...state,
        character,
        gameScreen: 'main'
      };
      return performAutoSave(newState);
    }

    case 'LOAD_CHARACTER': {
      // Update entdeckte_orte if missing in saved character
      const character = action.character;
      if (!character.entdeckte_orte) {
        character.entdeckte_orte = ["Hauptstadt", "Wald", "Berge", "See", "Höhle", "Wüste"];
      }
      
      // Initialisiere Mana-Werte, falls sie fehlen
      if (typeof character.mana !== 'number') {
        character.mana = 50;
      }
      
      if (typeof character.max_mana !== 'number') {
        character.max_mana = 50;
      }
      
      // Initialize attributeTrainingCount if missing
      if (!character.attributeTrainingCount) {
        character.attributeTrainingCount = {
          staerke: 0,
          intelligenz: 0,
          ausweichen: 0,
          verteidigung: 0,
          mana: 0          // Mana-Training-Zähler initialisieren
        };
      } else if (!character.attributeTrainingCount.mana) {
        // Falls attributeTrainingCount existiert, aber mana fehlt
        character.attributeTrainingCount.mana = 0;
      }
      
      // Copy discovered locations to orteDetails
      const updatedOrteDetails = { ...state.orteDetails };
      character.entdeckte_orte.forEach(ort => {
        if (updatedOrteDetails[ort]) {
          updatedOrteDetails[ort].entdeckt = true;
        }
      });
      
      newState = {
        ...state,
        character,
        orteDetails: updatedOrteDetails,
        gameScreen: 'main'
      };
      return newState;
    }

    case 'TRAVEL_TO': {
      // Update location
      const updatedState = { ...state };
      updatedState.character.aktueller_ort = action.location;
      
      // Check for location discovery
      const discoveredLocation = checkLocationDiscovery(updatedState.character, updatedState.orteDetails);
      if (discoveredLocation) {
        updatedState.orteDetails[discoveredLocation].entdeckt = true;
        if (!updatedState.character.entdeckte_orte) {
          updatedState.character.entdeckte_orte = [...updatedState.orte];
        }
        updatedState.character.entdeckte_orte.push(discoveredLocation);
        toast.success(`Du hast einen neuen Ort entdeckt: ${discoveredLocation}!`);
      }
      
      // Increased random encounter chance (50% chance instead of 30%)
      // Higher chance in dungeon-like locations
      let encounterChance = 0.5;
      const location = updatedState.orteDetails[action.location];
      
      if (action.location === "Höhle" || action.location === "Berge" || 
          action.location === "Verlorene Ruinen" || action.location === "Verlassene Mine") {
        encounterChance = 0.7; // 70% chance in dungeon-like locations
      }
      
      if (!location.istDorf && Math.random() < encounterChance) {
        const possibleMonsters = state.monsters[action.location] || [];
        
        if (possibleMonsters.length > 0) {
          // Boss encounter chance (10%)
          const isBossEncounter = Math.random() < 0.1;
          
          // Select a monster based on probability
          const monsterTemplate = { ...possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)] };
          const monster: Monster = { ...monsterTemplate };
          
          // Apply location monster level if specified
          if (location.monsterLevel) {
            const levelDiff = location.monsterLevel - 1; // Base adjustment
            monster.level = location.monsterLevel;
            monster.max_hp += levelDiff * 10;
            monster.hp = monster.max_hp;
            monster.staerke += Math.floor(levelDiff * 1.5);
            monster.xp += levelDiff * 5;
            
            if (monster.verteidigung) {
              monster.verteidigung += Math.floor(levelDiff * 0.5);
            } else {
              monster.verteidigung = Math.floor(levelDiff * 0.5);
            }
          }
          
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
            monster.level = (monster.level || 1) + 2; // Bosses are 2 levels higher
          } else {
            monster.lootChance = monster.lootChance || 0.3; // Default 30% loot chance
            if (!monster.verteidigung) {
              monster.verteidigung = Math.floor(monster.staerke * 0.2); // Default defense for regular monsters
            }
          }
          
          updatedState.currentMonster = monster;
          updatedState.gameScreen = 'combat';
          updatedState.combatLog = [
            isBossEncounter 
              ? `Ein mächtiger Boss erscheint: ${monster.name}${monster.level ? ` (Level ${monster.level})` : ''}!` 
              : `Ein ${monster.name}${monster.level ? ` (Level ${monster.level})` : ''} erscheint!`
          ];
        }
      }
      
      newState = updatedState;
      return performAutoSave(newState);
    }

    case 'START_COMBAT':
      newState = {
        ...state,
        currentMonster: action.monster,
        combatLog: [`Ein ${action.monster.name}${action.monster.level ? ` (Level ${action.monster.level})` : ''} erscheint!`],
        gameScreen: 'combat'
      };
      return newState;

    case 'ATTACK_MONSTER': {
      if (!state.currentMonster) return state;
      
      newState = { ...state };
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
        newState = handleCombatVictory(newState, monster);
        return performAutoSave(newState);
      }
      
      // Monster attacks back if not stunned
      if (!monsterStunned) {
        newState = handleMonsterAttack(newState, monster);
      } else {
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} ist betäubt und kann nicht angreifen!`
        ];
      }
      
      return newState;
    }

    case 'CAST_SPELL': {
      if (!state.currentMonster) return state;
      
      newState = { ...state };
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
      
      // Check level requirements for spells
      if (spellDef.minLevel && character.level < spellDef.minLevel) {
        newState.combatLog = [
          ...newState.combatLog, 
          `Du benötigst Level ${spellDef.minLevel} um ${spellName} zu wirken!`
        ];
        return newState;
      }
      
      // Prüfen, ob genug Mana vorhanden ist
      const manaBedarf = spellDef.manaBedarf || 0;
      if (character.mana < manaBedarf) {
        newState.combatLog = [
          ...newState.combatLog, 
          `Nicht genug Mana für ${spellName}! (Benötigt: ${manaBedarf})`
        ];
        return newState;
      }
      
      // Mana abziehen
      character.mana = Math.max(0, character.mana - manaBedarf);
      
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
        newState = handleCombatVictory(newState, monster);
        return performAutoSave(newState);
      }
      
      // Check for "Betäubt" status on monster which prevents it from attacking this turn
      const monsterStunned = monster.statusEffekte?.some(effect => 
        effect.name === "Betäubt" && effect.dauer > 0
      );
      
      // Monster attacks back if not stunned
      if (!monsterStunned) {
        newState = handleMonsterAttack(newState, monster);
      } else {
        newState.combatLog = [
          ...newState.combatLog, 
          `${monster.name} ist betäubt und kann nicht angreifen!`
        ];
      }
      
      return newState;
    }

    case 'USE_ITEM': {
      newState = { ...state };
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
          newState = handleMonsterAttack(newState, newState.currentMonster);
        } else {
          newState.combatLog = [
            ...newState.combatLog, 
            `${newState.currentMonster.name} ist betäubt und kann nicht angreifen!`
          ];
        }
      }
      
      return performAutoSave(newState);
    }

    case 'FLEE_COMBAT': {
      newState = { ...state };
      
      // Harder to flee from bosses (30% chance) vs regular monsters (50% chance)
      const fleeChance = newState.currentMonster?.isBoss ? 0.3 : 0.5;
      
      if (Math.random() < fleeChance) {
        newState.combatLog = [...newState.combatLog, "Flucht erfolgreich!"];
        newState.currentMonster = null;
        newState.gameScreen = 'main';
        return performAutoSave(newState);
      }
      
      newState.combatLog = [...newState.combatLog, "Flucht gescheitert!"];
      
      // Monster attacks
      return handleMonsterAttack(newState, newState.currentMonster!);
    }

    case 'END_COMBAT':
      // Stelle etwas Mana nach dem Kampf wieder her
      if (newState.character.mana < newState.character.max_mana) {
        const manaRegeneration = Math.floor(newState.character.max_mana * 0.1); // 10% Mana-Regeneration
        newState.character.mana = Math.min(
          newState.character.max_mana,
          newState.character.mana + manaRegeneration
        );
      }
      
      newState = {
        ...state,
        currentMonster: null,
        gameScreen: 'main'
      };
      return performAutoSave(newState);
      
    case 'BUY_ITEM': {
      newState = { ...state };
      const { character } = newState;
      const item = action.item;
      
      // Check level requirement
      if (item.minLevel && character.level < item.minLevel) {
        toast.error(`Du benötigst Level ${item.minLevel} für ${item.name}!`);
        return newState;
      }
      
      if (character.gold >= item.preis) {
        character.gold -= item.preis;
        character.inventar.push(item);
        toast.success(`${item.name} gekauft!`);
      } else {
        toast.error("Nicht genug Gold!");
      }
      
      return performAutoSave(newState);
    }

    case 'SELL_ITEM': {
      newState = { ...state };
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
      return performAutoSave(newState);
    }

    case 'EQUIP_ITEM': {
      newState = { ...state };
      const item = action.item;
      const { character } = newState;
      
      // Check level requirement
      if (item.minLevel && character.level < item.minLevel) {
        toast.error(`Du benötigst Level ${item.minLevel} für ${item.name}!`);
        return newState;
      }
      
      const equipment = {...character.ausgeruestet};
      
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
      
      character.ausgeruestet = equipment;
      toast.success(`${item.name} ausgerüstet!`);
      return performAutoSave(newState);
    }

    case 'USE_INVENTORY_ITEM': {
      newState = { ...state };
      const { character } = newState;
      
      if (action.itemIndex >= 0 && action.itemIndex < character.inventar.length) {
        const item = character.inventar[action.itemIndex];
        
        if (item && item.typ === "verbrauchbar") {
          if (item.boni.heilung) {
            const healAmount = item.boni.heilung;
            character.hp = Math.min(character.hp + healAmount, character.max_hp);
            character.inventar.splice(action.itemIndex, 1);
            toast.success(`Du wurdest um ${healAmount} HP geheilt!`);
          }
        }
      }
      
      return performAutoSave(newState);
    }

    case 'DROP_ITEM': {
      newState = { ...state };
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
      
      return performAutoSave(newState);
    }

    case 'TAKE_QUEST': {
      newState = { ...state };
      // Set the NPC who gave the quest
      const quest = {...action.quest, npc_geber: action.npc, npc_empfaenger: action.npc};
      newState.character.quest_log.push(quest);
      toast.success(`Quest angenommen: ${quest.name}`);
      return performAutoSave(newState);
    }
    
    case 'COMPLETE_QUEST': {
      newState = { ...state };
      const { character } = newState;
      const questIndex = action.questIndex;
      
      if (questIndex >= 0 && questIndex < character.quest_log.length) {
        const quest = character.quest_log[questIndex];
        
        // Check if quest is completed and being turned in to the right NPC
        if (quest.abgeschlossen && quest.npc_empfaenger === action.npc) {
          // Give rewards
          character.gold += quest.belohnung_gold;
          character.xp += quest.belohnung_xp;
          
          if (quest.belohnung_item) {
            character.inventar.push(quest.belohnung_item);
          }
          
          // Remove quest from log
          character.quest_log.splice(questIndex, 1);
          
          toast.success(`Quest ${quest.name} abgeschlossen! Belohnungen erhalten!`);
          
          // Check for level up
          if (character.xp >= character.level * 100) {
            newState = handleLevelUp(newState);
          }
        } else if (!quest.abgeschlossen) {
          toast.error(`Diese Quest ist noch nicht abgeschlossen!`);
        } else {
          toast.error(`Du musst diese Quest bei ${quest.npc_empfaenger} abgeben!`);
        }
      }
      
      return performAutoSave(newState);
    }

    case 'TRAIN_ATTRIBUTE': {
      newState = { ...state };
      const { character } = newState;
      
      // Ensure attributeTrainingCount exists
      if (!character.attributeTrainingCount) {
        character.attributeTrainingCount = {
          staerke: 0,
          intelligenz: 0,
          ausweichen: 0,
          verteidigung: 0,
          mana: 0
        };
      }
      
      // Calculate training cost based on level and number of times trained
      const trainingCount = character.attributeTrainingCount[action.attribute] || 0;
      const cost = calculateTrainingCost(
        character.level, 
        state.trainingCosts.basis, 
        state.trainingCosts.multiplikator,
        trainingCount
      );
      
      if (character.gold >= cost) {
        character.gold -= cost;
        
        if (action.attribute === 'mana') {
          // Mana-Training erhöht max_mana
          character.max_mana += 5; 
          character.mana = character.max_mana; // Füllt auch die Mana wieder auf
          toast.success(`Maximales Mana um 5 erhöht! (Kosten: ${cost} Gold)`);
        } else {
          // Normale Attribute erhöhen
          character[action.attribute] += 1;
          toast.success(`${action.attribute} erhöht! (Kosten: ${cost} Gold)`);
        }
        
        // Increment training count for this attribute
        character.attributeTrainingCount[action.attribute] = trainingCount + 1;
      } else {
        toast.error(`Nicht genug Gold! (Benötigt: ${cost} Gold)`);
      }
      
      return performAutoSave(newState);
    }

    case 'ASSIGN_STAT_POINT': {
      newState = { ...state };
      const { character } = newState;
      
      if (character.unverteilte_punkte > 0) {
        if (action.attribute === 'mana') {
          // Mana-Attributpunkte erhöhen max_mana
          character.max_mana += 10;
          character.mana = character.max_mana; // Füllt auch Mana wieder auf
          toast.success(`Maximales Mana um 10 erhöht!`);
        } else {
          character[action.attribute] += 1;
          toast.success(`${action.attribute} erhöht!`);
        }
        character.unverteilte_punkte -= 1;
      } else {
        toast.error("Keine freien Statpunkte verfügbar!");
      }
      
      return performAutoSave(newState);
    }
    
    case 'LEARN_SPELL': {
      newState = { ...state };
      const { character } = newState;
      const spellDef = state.zauberDefinitionen[action.spell];
      
      if (!spellDef) {
        toast.error(`Zauber ${action.spell} nicht gefunden!`);
        return newState;
      }
      
      // Check level requirement
      if (spellDef.minLevel && character.level < spellDef.minLevel) {
        toast.error(`Du benötigst Level ${spellDef.minLevel} für ${action.spell}!`);
        return newState;
      }
      
      // Calculate spell cost based on level and spell properties
      const spellCost = calculateSpellCost(character.level, spellDef, state.zauberkostenFaktor);
      
      if (character.gold >= spellCost && !character.zauber.includes(action.spell)) {
        character.gold -= spellCost;
        character.zauber.push(action.spell);
        toast.success(`Zauber gelernt: ${action.spell} (Kosten: ${spellCost} Gold)`);
      } else if (character.zauber.includes(action.spell)) {
        toast.error(`Du beherrschst ${action.spell} bereits!`);
      } else {
        toast.error(`Nicht genug Gold! (Benötigt: ${spellCost} Gold)`);
      }
      
      return performAutoSave(newState);
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
      
    case 'TOGGLE_AUTOSAVE':
      return {
        ...state,
        autoSave: !state.autoSave
      };
      
    case 'DISCOVER_LOCATION': {
      newState = { ...state };
      
      if (newState.orteDetails[action.location]) {
        newState.orteDetails[action.location].entdeckt = true;
        
        if (!newState.character.entdeckte_orte) {
          newState.character.entdeckte_orte = [...state.orte];
        }
        
        if (!newState.character.entdeckte_orte.includes(action.location)) {
          newState.character.entdeckte_orte.push(action.location);
        }
      }
      
      return performAutoSave(newState);
    }

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
        statusEffekte: state.character.statusEffekte,
        entdeckte_orte: state.character.entdeckte_orte
      };
      
      localStorage.setItem(`rpg_save_${state.character.name}`, JSON.stringify(saveData));
      toast.success("Spiel gespeichert!");
      
      return {
        ...state,
        letzteSpeicherung: Date.now(),
        loadedCharacters: [...new Set([...state.loadedCharacters, state.character.name])]
      };
    }

    default:
      return state;
  }
};

// Check if an item is equipped
const isItemEquipped = (item: Item, equipment: Equipment): boolean => {
  if (!item.id) return false; // If no ID, can't be equipped
  
  return (
    (equipment.waffe && equipment.waffe.id === item.id) ||
    (equipment.ruestung && equipment.ruestung.id === item.id) ||
    (equipment.helm && equipment.helm.id === item.id) ||
    (equipment.accessoire && equipment.accessoire.id === item.id)
  );
};

// Helper function to ensure all items have IDs
const ensureItemIds = (items: Item[]): Item[] => {
  return items.map(item => {
    if (!item.id) {
      return { ...item, id: generateUniqueId() };
    }
    return item;
  });
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
    character.aktueller_ort = "Hauptstadt";
    
    state.combatLog = [
      ...state.combatLog, 
      "Du wurdest besiegt!", 
      "Du wachst in der Hauptstadt auf und hast etwas Gold verloren..."
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
        
        state.combatLog = [
          ...state.combatLog,
          `Quest "${quest.name}" abgeschlossen!`,
          `Kehre zu ${quest.npc_empfaenger} zurück, um deine Belohnung abzuholen!`
        ];
      } else {
        state.combatLog = [
          ...state.combatLog,
          `Quest-Fortschritt "${quest.name}": ${quest.aktuelle_anzahl}/${quest.ziel_anzahl}`
        ];
      }
    }
  }
  
  // Check for level up - modified to work at all levels
  const requiredXP = character.level * 100;
  if (character.xp >= requiredXP) {
    character.xp -= requiredXP; // Subtract required XP and keep remainder
    state = handleLevelUp(state);
  }
  
  state.currentMonster = null;
  state.gameScreen = 'main';
  return state;
};

// Helper function for level up
const handleLevelUp = (state: GameState): GameState => {
  const { character } = state;
  character.level += 1;
  
  // Scale HP growth based on level
  const hpGainBase = 20;
  const hpScaleFactor = Math.min(1.0, 0.7 + (character.level * 0.02)); // Scaling factor increases with level
  const hpGain = Math.floor(hpGainBase * hpScaleFactor);
  
  // Mana-Erhöhung beim Levelaufstieg
  const manaGainBase = 10;
  const manaScaleFactor = Math.min(1.0, 0.7 + (character.level * 0.02));
  const manaGain = Math.floor(manaGainBase * manaScaleFactor);
  
  character.max_hp += hpGain;
  character.hp = character.max_hp;
  
  character.max_mana += manaGain;
  character.mana = character.max_mana;
  
  // Give stat points instead of increasing stats directly
  character.unverteilte_punkte += 5;
  
  state.combatLog = [
    ...state.combatLog, 
    `Level Up! Du bist jetzt Level ${character.level}!`,
    `Du erhältst 5 Statpunkte zum Verteilen!`,
    `Deine maximalen Lebenspunkte steigen um ${hpGain}!`,
    `Dein maximales Mana steigt um ${manaGain}!`
  ];
  
  // Check if new locations can be discovered
  Object.entries(state.orteDetails).forEach(([name, location]) => {
    if (!location.entdeckt && location.minLevel && character.level >= location.minLevel) {
      if (Math.random() < 0.3) { // 30% chance to discover on level up
        location.entdeckt = true;
        if (!character.entdeckte_orte) {
          character.entdeckte_orte = [...state.orte];
        }
        character.entdeckte_orte.push(name);
        
        state.combatLog = [
          ...state.combatLog,
          `Du hast einen neuen Ort entdeckt: ${name}!`
        ];
      }
    }
  });
  
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

  // Auto-save every 2 minutes if enabled
  useEffect(() => {
    if (state.autoSave && state.character.name) {
      const intervalId = setInterval(() => {
        dispatch({ type: 'SAVE_GAME' });
      }, 120000); // 2 minutes
      
      return () => clearInterval(intervalId);
    }
  }, [state.autoSave, state.character.name]);

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
        
        // Ensure all items have IDs
        if (characterData.inventar) {
          characterData.inventar = ensureItemIds(characterData.inventar);
        }
        
        // Ensure equipped items have IDs
        if (characterData.ausgeruestet) {
          if (characterData.ausgeruestet.waffe && !characterData.ausgeruestet.waffe.id) {
            characterData.ausgeruestet.waffe.id = generateUniqueId();
          }
          if (characterData.ausgeruestet.ruestung && !characterData.ausgeruestet.ruestung.id) {
            characterData.ausgeruestet.ruestung.id = generateUniqueId();
          }
          if (characterData.ausgeruestet.helm && !characterData.ausgeruestet.helm.id) {
            characterData.ausgeruestet.helm.id = generateUniqueId();
          }
          if (characterData.ausgeruestet.accessoire && !characterData.ausgeruestet.accessoire.id) {
            characterData.ausgeruestet.accessoire.id = generateUniqueId();
          }
        }
        
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
