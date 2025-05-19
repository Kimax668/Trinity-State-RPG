/* This file contains the global state management for the game using React Context API */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameAction, Character, Achievement } from '../types/game';
import { initialGameState } from '../data/gameData';
import { toast } from 'sonner';

// Helper function to create default achievements
const createDefaultAchievements = (existingKills: Record<string, number> = {}): Achievement[] => {
  // Define the different monster types to track
  const monsterTypes = ['Wolf', 'Goblin', 'Skelett', 'Spinne'];
  
  // Define achievement tiers
  const achievementTiers = [10, 25, 50, 100];
  
  // Create an achievement for each monster type
  return monsterTypes.map(monsterType => {
    // Get current kill count for this monster type
    const currentKills = existingKills[monsterType] || 0;
    
    // Calculate which tiers are completed
    const completedTiers = achievementTiers.map(tier => currentKills >= tier);
    
    return {
      id: `kill_${monsterType.toLowerCase()}`,
      name: `${monsterType}-Jäger`,
      beschreibung: `Besiege ${achievementTiers[achievementTiers.length-1]} ${monsterType}e.`,
      typ: 'monster_kills' as const,
      ziel: monsterType,
      stufen: achievementTiers,
      fortschritt: currentKills,
      abgeschlossen: completedTiers
    };
  });
};

// Define the context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialGameState,
  dispatch: () => null
});

// Define the provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create the game reducer
  const gameReducer = (state: GameState, action: GameAction): GameState => {
    let newState = { ...state };
    let updatedCharacter: Character;
    
    switch (action.type) {
      case 'CREATE_CHARACTER':
        // Create a new character with the given name
        updatedCharacter = {
          name: action.name,
          hp: 100,
          max_hp: 100,
          mana: 50,
          max_mana: 50,
          staerke: 5,
          intelligenz: 5,
          ausweichen: 5,
          verteidigung: 5,
          xp: 0,
          level: 1,
          gold: 50,
          inventar: [],
          ausgeruestet: {
            waffe: null,
            ruestung: null,
            helm: null,
            accessoire: null
          },
          zauber: ['Feuerball'],
          aktueller_ort: 'Dorf',
          quest_log: [],
          unverteilte_punkte: 0,
          statusEffekte: [],
          entdeckte_orte: ['Dorf'],
          attributeTrainingCount: { 
            staerke: 0, 
            intelligenz: 0, 
            ausweichen: 0, 
            verteidigung: 0,
            mana: 0
          },
          monsterKills: {},
          erfolge: createDefaultAchievements()  // Initialize achievements for new character
        };
        
        // Update the game state
        newState = {
          ...state,
          character: updatedCharacter,
          gameScreen: 'main'
        };
        
        // Save the character to localStorage
        const savedChars = JSON.parse(localStorage.getItem('rpg_savedCharacters') || '{}');
        savedChars[action.name] = updatedCharacter;
        localStorage.setItem('rpg_savedCharacters', JSON.stringify(savedChars));
        localStorage.setItem('rpg_currentCharacter', action.name);
        
        return newState;

      case 'LOAD_CHARACTER':
        // Load an existing character
        // Check if the loaded character has achievements
        const character = action.character;
        if (!character.erfolge || character.erfolge.length === 0) {
          // Ensure monsterKills exists
          const monsterKills = character.monsterKills || {};
          character.erfolge = createDefaultAchievements(monsterKills);
        }

        // Update the game state
        newState = {
          ...state,
          character: character,
          gameScreen: 'main'
        };
        
        // Save the current character name to localStorage
        localStorage.setItem('rpg_currentCharacter', character.name);
        
        return newState;
        
      case 'INITIALIZE_ACHIEVEMENTS':
        // Initialize achievements for an existing character
        if (!state.character) return state;
        
        // Get current monster kills or create empty object
        const monsterKills = state.character.monsterKills || {};
        
        // Create achievements based on current kill counts
        const achievements = createDefaultAchievements(monsterKills);
        
        // Update character with new achievements
        updatedCharacter = {
          ...state.character,
          erfolge: achievements,
          monsterKills: monsterKills
        };
        
        newState = {
          ...state,
          character: updatedCharacter
        };
        
        // Save the updated character
        const savedCharactersStr = localStorage.getItem('rpg_savedCharacters') || '{}';
        const savedCharacters = JSON.parse(savedCharactersStr);
        if (savedCharacters[updatedCharacter.name]) {
          savedCharacters[updatedCharacter.name] = updatedCharacter;
          localStorage.setItem('rpg_savedCharacters', JSON.stringify(savedCharacters));
        }
        
        toast.success("Erfolge wurden initialisiert!");
        return newState;

      case 'TRAVEL_TO':
        return {
          ...state,
          character: {
            ...state.character,
            aktueller_ort: action.location
          }
        };
        
      case 'START_COMBAT':
        return {
          ...state,
          currentMonster: action.monster,
          gameScreen: 'combat',
          combatLog: [`${action.monster.name} greift an!`]
        };
        
      case 'ATTACK_MONSTER':
        if (!state.currentMonster) return state;
        
        // Calculate damage
        let damage = state.character.staerke;
        
        // Apply status effect damage
        if (state.character.statusEffekte) {
          state.character.statusEffekte.forEach(effekt => {
            if (effekt.schaden) {
              damage += effekt.schaden;
            }
          });
        }
        
        // Apply random variance
        damage = Math.floor(damage * (0.8 + Math.random() * 0.4)); // 80% to 120%
        
        // Apply defense
        let verteidigung = state.currentMonster.verteidigung || 0;
        damage = Math.max(0, damage - verteidigung);
        
        // Calculate dodge chance
        const dodgeChance = state.currentMonster.wahrscheinlichkeit / 100;
        if (Math.random() < dodgeChance) {
          newState.combatLog.push(`${state.currentMonster.name} weicht aus!`);
        } else {
          // Apply damage
          state.currentMonster.hp -= damage;
          newState.combatLog.push(`Du greifst ${state.currentMonster.name} an und verursachst ${damage} Schaden.`);
        }
        
        // Check if monster is dead
        if (state.currentMonster.hp <= 0) {
          return gameReducer(state, { type: 'END_COMBAT', won: true });
        }
        
        // Monster's turn to attack
        let monsterDamage = state.currentMonster.staerke;
        
        // Apply random variance
        monsterDamage = Math.floor(monsterDamage * (0.8 + Math.random() * 0.4)); // 80% to 120%
        
        // Apply character defense
        let charVerteidigung = state.character.verteidigung;
        monsterDamage = Math.max(0, monsterDamage - charVerteidigung);
        
        // Calculate character dodge chance
        const charDodgeChance = state.character.ausweichen / 100;
        if (Math.random() < charDodgeChance) {
          newState.combatLog.push(`Du weichst dem Angriff von ${state.currentMonster.name} aus!`);
        } else {
          // Apply damage to character
          state.character.hp -= monsterDamage;
          newState.combatLog.push(`${state.currentMonster.name} greift dich an und verursacht ${monsterDamage} Schaden.`);
        }
        
        // Check if character is dead
        if (state.character.hp <= 0) {
          newState.combatLog.push("Du bist gestorben!");
          newState.gameScreen = 'start';
          
          // Reset character
          localStorage.removeItem('rpg_currentCharacter');
          return {
            ...initialGameState,
            loadedCharacters: state.loadedCharacters
          };
        }
        
        return { ...state };
        
      case 'CAST_SPELL':
        if (!state.currentMonster) return state;
        
        // Find the spell definition
        const spellDefinition = state.zauberDefinitionen[action.spell];
        if (!spellDefinition) {
          console.warn(`Spell definition not found for ${action.spell}`);
          return state;
        }
        
        // Check if character has enough mana
        if (state.character.mana < spellDefinition.manaBedarf!) {
          newState.combatLog.push("Nicht genügend Mana!");
          return state;
        }
        
        // Deduct mana
        state.character.mana -= spellDefinition.manaBedarf!;
        
        // Apply damage
        let spellDamage = spellDefinition.schaden || 0;
        if (spellDefinition.schadenFaktor) {
          spellDamage += Math.floor(state.character.intelligenz * spellDefinition.schadenFaktor);
        }
        
        // Apply status effect
        if (spellDefinition.statusEffekt) {
          state.currentMonster.statusEffekte = state.currentMonster.statusEffekte || [];
          state.currentMonster.statusEffekte.push({
            name: spellDefinition.statusEffekt,
            dauer: spellDefinition.statusDauer!
          });
          newState.combatLog.push(`${state.currentMonster.name} ist jetzt ${spellDefinition.statusEffekt}!`);
        }
        
        // Apply healing
        let spellHealing = spellDefinition.heilung || 0;
        if (spellDefinition.heilungFaktor) {
          spellHealing += Math.floor(state.character.intelligenz * spellDefinition.heilungFaktor);
        }
        
        // Apply mana regeneration
        let manaRegeneration = spellDefinition.manaRegeneration || 0;
        state.character.mana = Math.min(state.character.max_mana, state.character.mana + manaRegeneration);
        
        // Apply damage to monster
        state.currentMonster.hp -= spellDamage;
        newState.combatLog.push(`Du wirkst ${action.spell} und verursachst ${spellDamage} Schaden.`);
        
        // Apply healing to character
        state.character.hp = Math.min(state.character.max_hp, state.character.hp + spellHealing);
        newState.combatLog.push(`Du wirkst ${action.spell} und heilst dich um ${spellHealing} HP.`);
        
        // Check if monster is dead
        if (state.currentMonster.hp <= 0) {
          return gameReducer(state, { type: 'END_COMBAT', won: true });
        }
        
        // Monster's turn to attack
        let monsterDamage = state.currentMonster.staerke;
        
        // Apply random variance
        monsterDamage = Math.floor(monsterDamage * (0.8 + Math.random() * 0.4)); // 80% to 120%
        
        // Apply character defense
        let charVerteidigung = state.character.verteidigung;
        monsterDamage = Math.max(0, monsterDamage - charVerteidigung);
        
        // Calculate character dodge chance
        const charDodgeChance = state.character.ausweichen / 100;
        if (Math.random() < charDodgeChance) {
          newState.combatLog.push(`Du weichst dem Angriff von ${state.currentMonster.name} aus!`);
        } else {
          // Apply damage to character
          state.character.hp -= monsterDamage;
          newState.combatLog.push(`${state.currentMonster.name} greift dich an und verursacht ${monsterDamage} Schaden.`);
        }
        
        // Check if character is dead
        if (state.character.hp <= 0) {
          newState.combatLog.push("Du bist gestorben!");
          newState.gameScreen = 'start';
          
          // Reset character
          localStorage.removeItem('rpg_currentCharacter');
          return {
            ...initialGameState,
            loadedCharacters: state.loadedCharacters
          };
        }
        
        return { ...state };
        
      case 'USE_ITEM':
        const item = state.character.inventar[action.itemIndex];
        if (!item) return state;
        
        // Apply item effects (e.g., healing)
        if (item.boni && item.boni.hp) {
          state.character.hp = Math.min(state.character.max_hp, state.character.hp + item.boni.hp);
          newState.combatLog.push(`Du benutzt ${item.name} und heilst dich um ${item.boni.hp} HP.`);
        }
        
        // Remove the item from inventory
        state.character.inventar.splice(action.itemIndex, 1);
        
        return { ...state };
        
      case 'FLEE_COMBAT':
        newState.combatLog.push("Du bist geflohen!");
        return {
          ...state,
          currentMonster: null,
          gameScreen: 'main'
        };
        
      case 'END_COMBAT':
        // Check if combat was won and award XP, gold, and loot
        if (action.won && state.currentMonster) {
          const monster = state.currentMonster;
          
          // Calculate rewards
          const xpGained = monster.xp;
          const goldGained = Math.floor(Math.random() * (monster.xp * 2)) + 5;
          
          // Update character gold, XP, and check for level up
          updatedCharacter = { ...state.character };
          updatedCharacter.gold += goldGained;
          updatedCharacter.xp += xpGained;
          
          // Check for level up
          while (updatedCharacter.xp >= updatedCharacter.level * 100) {
            updatedCharacter.xp -= updatedCharacter.level * 100;
            updatedCharacter.level += 1;
            updatedCharacter.max_hp += 10;
            updatedCharacter.hp = updatedCharacter.max_hp; // Heal to full on level up
            updatedCharacter.max_mana += 5;
            updatedCharacter.mana = updatedCharacter.max_mana; // Restore mana on level up
            updatedCharacter.unverteilte_punkte += 3; // Award stat points
          }
          
          // Process loot if monster has any
          if (monster.loot && monster.loot.length > 0) {
            // Determine if loot is dropped (based on lootChance or default 50%)
            const lootChance = monster.lootChance || 0.5;
            if (Math.random() <= lootChance) {
              // Select a random item from loot table
              const lootIndex = Math.floor(Math.random() * monster.loot.length);
              const lootItem = monster.loot[lootIndex];
              
              // Add to inventory
              if (lootItem) {
                updatedCharacter.inventar.push({ 
                  ...lootItem, 
                  id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
                });
                
                // Update combat log
                newState.combatLog.push(`Du hast ${lootItem.name} erhalten!`);
              }
            }
          }
          
          // Track monster kills and update achievements
          if (!updatedCharacter.monsterKills) {
            updatedCharacter.monsterKills = {};
          }
          
          // Increment kill count
          const monsterName = monster.name;
          updatedCharacter.monsterKills[monsterName] = (updatedCharacter.monsterKills[monsterName] || 0) + 1;
          
          // Update achievements if they exist
          if (updatedCharacter.erfolge) {
            updatedCharacter.erfolge = updatedCharacter.erfolge.map(achievement => {
              // Only update if it's a monster_kills achievement and matches the monster
              if (achievement.typ === 'monster_kills' && achievement.ziel === monsterName) {
                // Update progress
                achievement.fortschritt = updatedCharacter.monsterKills![monsterName];
                
                // Update completed tiers
                achievement.abgeschlossen = achievement.stufen.map(level => 
                  achievement.fortschritt >= level
                );
              }
              return achievement;
            });
          }
          
          // Update combat log
          newState.combatLog.push(`Kampf gewonnen! Du erhältst ${xpGained} Erfahrung und ${goldGained} Gold.`);
          if (updatedCharacter.level > state.character.level) {
            newState.combatLog.push(`Level aufgestiegen! Du bist jetzt Level ${updatedCharacter.level}!`);
          }
        }
        
        // Clear current monster and return to main game screen
        newState = {
          ...newState,
          character: updatedCharacter || state.character,
          currentMonster: null,
          gameScreen: 'main'
        };
        return newState;

      case 'BUY_ITEM':
        const itemToBuy = action.item;
        if (state.character.gold < itemToBuy.preis) {
          toast.error("Nicht genügend Gold!");
          return state;
        }
        
        updatedCharacter = { ...state.character };
        updatedCharacter.gold -= itemToBuy.preis;
        updatedCharacter.inventar.push({ 
          ...itemToBuy, 
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
        });
        
        return {
          ...state,
          character: updatedCharacter
        };
        
      case 'SELL_ITEM':
        const itemIndex = action.itemIndex;
        const itemToSell = state.character.inventar[itemIndex];
        if (!itemToSell) return state;
        
        // Check if the NPC buys this type of item
        const npc = state.npcs[action.npc];
        if (!npc || !npc.kauft || !npc.kauft.includes(itemToSell.typ)) {
          toast.error("Dieser Händler kauft diesen Gegenstand nicht.");
          return state;
        }
        
        // Calculate selling price (if verkaufspreis is set, use it, otherwise use a fraction of the original price)
        const sellingPrice = itemToSell.verkaufspreis !== undefined ? itemToSell.verkaufspreis : Math.floor(itemToSell.preis * 0.4);
        
        updatedCharacter = { ...state.character };
        updatedCharacter.gold += sellingPrice;
        updatedCharacter.inventar.splice(itemIndex, 1);
        
        return {
          ...state,
          character: updatedCharacter
        };
      
      case 'EQUIP_ITEM':
        const itemToEquip = action.item;
        const itemIndexToEquip = action.itemIndex;
        
        if (!itemToEquip) return state;
        
        updatedCharacter = { ...state.character };
        
        // Unequip the item in the target slot, if any
        if (itemToEquip.typ === 'waffe') {
          if (updatedCharacter.ausgeruestet.waffe) {
            updatedCharacter.inventar.push(updatedCharacter.ausgeruestet.waffe);
          }
          updatedCharacter.ausgeruestet.waffe = itemToEquip;
        } else if (itemToEquip.typ === 'ruestung') {
          if (updatedCharacter.ausgeruestet.ruestung) {
            updatedCharacter.inventar.push(updatedCharacter.ausgeruestet.ruestung);
          }
          updatedCharacter.ausgeruestet.ruestung = itemToEquip;
        } else if (itemToEquip.typ === 'helm') {
          if (updatedCharacter.ausgeruestet.helm) {
            updatedCharacter.inventar.push(updatedCharacter.ausgeruestet.helm);
          }
          updatedCharacter.ausgeruestet.helm = itemToEquip;
        } else if (itemToEquip.typ === 'accessoire') {
          if (updatedCharacter.ausgeruestet.accessoire) {
            updatedCharacter.inventar.push(updatedCharacter.ausgeruestet.accessoire);
          }
          updatedCharacter.ausgeruestet.accessoire = itemToEquip;
        }
        
        // Remove the item from inventory
        updatedCharacter.inventar.splice(itemIndexToEquip, 1);
        
        // Grant spell if item grants a spell
        if (itemToEquip.spellGranted && !updatedCharacter.zauber.includes(itemToEquip.spellGranted)) {
          updatedCharacter.zauber.push(itemToEquip.spellGranted);
        }
        
        return {
          ...state,
          character: updatedCharacter
        };
        
      case 'USE_INVENTORY_ITEM':
        const inventoryItem = state.character.inventar[action.itemIndex];
        if (!inventoryItem) return state;
        
        // Apply item effects (e.g., healing)
        if (inventoryItem.boni && inventoryItem.boni.hp) {
          state.character.hp = Math.min(state.character.max_hp, state.character.hp + inventoryItem.boni.hp);
          toast.success(`Du benutzt ${inventoryItem.name} und heilst dich um ${inventoryItem.boni.hp} HP.`);
        }
        
        // Remove the item from inventory
        state.character.inventar.splice(action.itemIndex, 1);
        
        return { ...state };
      
      case 'DROP_ITEM':
        state.character.inventar.splice(action.itemIndex, 1);
        return { ...state };

      case 'TAKE_QUEST':
        const questToTake = action.quest;
        updatedCharacter = { ...state.character };
        updatedCharacter.quest_log.push(questToTake);
        
        toast.success(`Quest "${questToTake.name}" angenommen!`);
        
        return {
          ...state,
          character: updatedCharacter
        };
      
      case 'COMPLETE_QUEST':
        const questIndex = action.questIndex;
        const questToComplete = state.character.quest_log[questIndex];
        if (!questToComplete || !questToComplete.ziel_typ) return state;
        
        // Award gold and XP
        updatedCharacter = { ...state.character };
        updatedCharacter.gold += questToComplete.belohnung_gold;
        updatedCharacter.xp += questToComplete.belohnung_xp;
        
        // Check for level up
        while (updatedCharacter.xp >= updatedCharacter.level * 100) {
          updatedCharacter.xp -= updatedCharacter.level * 100;
          updatedCharacter.level += 1;
        }
        
        // Award item
        if (questToComplete.belohnung_item) {
          updatedCharacter.inventar.push({ 
            ...questToComplete.belohnung_item, 
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
          });
          toast.success(`Du hast ${questToComplete.belohnung_item.name} erhalten!`);
        }
        
        // Mark quest as completed
        updatedCharacter.quest_log[questIndex].abgeschlossen = true;
        
        toast.success(`Quest "${questToComplete.name}" abgeschlossen!`);
        
        return {
          ...state,
          character: updatedCharacter
        };

      case 'TRAIN_ATTRIBUTE':
        const attribute = action.attribute;
        const trainingCost = state.trainingCosts.basis + (state.character.attributeTrainingCount![attribute] * state.trainingCosts.multiplikator);
        
        if (state.character.gold < trainingCost) {
          toast.error("Nicht genügend Gold!");
          return state;
        }
        
        updatedCharacter = { ...state.character };
        updatedCharacter.gold -= trainingCost;
        updatedCharacter[attribute] += 1;
        updatedCharacter.attributeTrainingCount![attribute] += 1;
        
        toast.success(`${attribute} wurde trainiert!`);
        
        return {
          ...state,
          character: updatedCharacter
        };

      case 'ASSIGN_STAT_POINT':
        const statAttribute = action.attribute;
        if (state.character.unverteilte_punkte <= 0) {
          toast.error("Keine verfügbaren Statpunkte!");
          return state;
        }
        
        updatedCharacter = { ...state.character };
        updatedCharacter[statAttribute] += 1;
        updatedCharacter.unverteilte_punkte -= 1;
        
        toast.success(`${statAttribute} wurde erhöht!`);
        
        return {
          ...state,
          character: updatedCharacter
        };

      case 'LEARN_SPELL':
        const spellToLearn = action.spell;
        if (state.character.zauber.includes(spellToLearn)) {
          toast.error("Du kennst diesen Zauber bereits!");
          return state;
        }
        
        updatedCharacter = { ...state.character };
        updatedCharacter.zauber.push(spellToLearn);
        
        toast.success(`Du hast ${spellToLearn} gelernt!`);
        
        return {
          ...state,
          character: updatedCharacter
        };

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

      case 'DISCOVER_LOCATION':
        const locationToDiscover = action.location;
        if (state.character.entdeckte_orte && !state.character.entdeckte_orte.includes(locationToDiscover)) {
          updatedCharacter = { ...state.character };
          updatedCharacter.entdeckte_orte.push(locationToDiscover);
          
          toast.success(`${locationToDiscover} wurde entdeckt!`);
          
          return {
            ...state,
            character: updatedCharacter
          };
        }
        return state;

      case 'UPDATE_ACHIEVEMENT':
        // Update achievement progress for a specific monster
        updatedCharacter = { ...state.character };
        
        // Check if achievements system is initialized
        if (!updatedCharacter.erfolge || !updatedCharacter.monsterKills) {
          // Initialize systems if they don't exist
          updatedCharacter.monsterKills = updatedCharacter.monsterKills || {};
          updatedCharacter.erfolge = createDefaultAchievements(updatedCharacter.monsterKills);
        }
        
        // Update the monster kill count
        const monsterType = action.monsterName;
        updatedCharacter.monsterKills![monsterType] = (updatedCharacter.monsterKills![monsterType] || 0) + 1;
        
        // Find and update the achievement for this monster
        if (updatedCharacter.erfolge) {
          updatedCharacter.erfolge = updatedCharacter.erfolge.map(achievement => {
            if (achievement.typ === 'monster_kills' && achievement.ziel === monsterType) {
              // Update progress
              achievement.fortschritt = updatedCharacter.monsterKills![monsterType];
              
              // Check for newly completed tiers
              const previouslyCompleted = [...achievement.abgeschlossen];
              achievement.abgeschlossen = achievement.stufen.map(level => achievement.fortschritt >= level);
              
              // Check if a new level was achieved and notify
              achievement.stufen.forEach((level, index) => {
                if (achievement.fortschritt >= level && !previouslyCompleted[index]) {
                  // Determine the tier name based on index
                  let tierName = "Fortschritt";
                  if (index === 0) tierName = "Anfänger";
                  else if (index === 1) tierName = "Fortgeschritten";
                  else if (index === 2) tierName = "Veteran";
                  else if (index === 3) tierName = "Mythisch";
                  
                  toast.success(`Erfolg erreicht! ${achievement.name} - ${tierName}`);
                }
              });
            }
            return achievement;
          });
        }
        
        return {
          ...state,
          character: updatedCharacter
        };

      case 'SAVE_GAME':
        // Save the current game state to localStorage
        const savedCharacterData = JSON.parse(localStorage.getItem('rpg_savedCharacters') || '{}');
        savedCharacterData[state.character.name] = state.character;
        localStorage.setItem('rpg_savedCharacters', JSON.stringify(savedCharacterData));
        localStorage.setItem('rpg_currentCharacter', state.character.name);
        
        toast.success("Spiel gespeichert!");
        
        return {
          ...state,
          letzteSpeicherung: Date.now()
        };

      default:
        return state;
    }
  };

  // Initialize state with reducer
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Effect for auto-saving
  useEffect(() => {
    if (!state.autoSave || state.gameScreen === 'start' || !state.character?.name) return;

    // Set up autosave interval (every 2 minutes)
    const autoSaveInterval = setInterval(() => {
      console.log("Auto-saving game...");
      dispatch({ type: 'SAVE_GAME' });
    }, 2 * 60 * 1000);

    return () => clearInterval(autoSaveInterval);
  }, [state.autoSave, state.gameScreen, state.character]);

  // Return the provider
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Create a hook for using the context
export const useGameContext = () => useContext(GameContext);
