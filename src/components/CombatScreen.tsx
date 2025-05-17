
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sword, Sparkles, Shield, FlameKindling, Snowflake, Zap } from 'lucide-react';

const CombatScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, currentMonster, combatLog, zauberDefinitionen } = state;

  if (!currentMonster) {
    return null;
  }

  // Helper to get status effect badges
  const renderStatusEffects = (effects?: { name: string; dauer: number }[]) => {
    if (!effects || effects.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        {effects.map((effect, idx) => {
          let badgeColor = "bg-gray-500";
          let Icon = FlameKindling;
          
          if (effect.name === "Brennen") {
            badgeColor = "bg-red-500";
            Icon = FlameKindling;
          } 
          else if (effect.name === "Gefroren") {
            badgeColor = "bg-blue-500";
            Icon = Snowflake;
          }
          else if (effect.name === "Betäubt") {
            badgeColor = "bg-yellow-500";
            Icon = Zap;
          }
          else if (effect.name === "Vergiftet") {
            badgeColor = "bg-green-500";
          }
          
          return (
            <Badge key={idx} className={`${badgeColor} text-white text-xs flex items-center gap-1`}>
              <Icon className="h-3 w-3" />
              {effect.name} ({effect.dauer})
            </Badge>
          );
        })}
      </div>
    );
  };

  // Check if character has mana properties
  const hasMana = 'mana' in character && 'max_mana' in character;

  return (
    <div className="min-h-screen bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className={`parchment border-2 ${currentMonster.isBoss ? "border-red-600 shadow-lg shadow-red-500/20" : "border-rpg-primary"}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Combat Info & Log */}
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className={`text-2xl font-bold ${currentMonster.isBoss ? "text-red-600 animate-pulse" : "text-rpg-accent"} fantasy-title`}>
                    {currentMonster.isBoss ? "Boss Kampf!" : "Kampf!"}
                  </h2>
                </div>
                
                {/* Combat status */}
                <div className="space-y-4">
                  {/* Monster stats */}
                  <div className={`p-4 rounded-md ${currentMonster.isBoss ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${currentMonster.isBoss ? 'text-red-600' : ''} fantasy-title`}>
                          {currentMonster.name}
                        </h3>
                        {currentMonster.isBoss && (
                          <Badge className="bg-red-600 text-white">Boss</Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        HP: {currentMonster.hp}/{currentMonster.max_hp}
                      </div>
                    </div>
                    
                    <div className="mt-1 health-bar">
                      <div 
                        className={`health-bar-fill ${currentMonster.isBoss ? 'bg-gradient-to-r from-red-700 to-red-500' : ''}`}
                        style={{ 
                          width: `${Math.max(0, (currentMonster.hp / currentMonster.max_hp) * 100)}%` 
                        }}
                      />
                    </div>
                    
                    {renderStatusEffects(currentMonster.statusEffekte)}
                    
                    <div className="mt-2 text-xs flex flex-wrap gap-1">
                      {currentMonster.verteidigung && (
                        <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                          <Shield className="h-3 w-3 mr-1" /> {currentMonster.verteidigung}
                        </span>
                      )}
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                        <Sword className="h-3 w-3 mr-1" /> {currentMonster.staerke}
                      </span>
                      {currentMonster.level && (
                        <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          Lvl {currentMonster.level}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Character stats */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg fantasy-title">{character.name}</h3>
                      <div className="text-sm font-medium">
                        HP: {character.hp}/{character.max_hp}
                      </div>
                    </div>
                    
                    <div className="mt-1 health-bar">
                      <div 
                        className="health-bar-fill" 
                        style={{ width: `${(character.hp / character.max_hp) * 100}%` }}
                      />
                    </div>
                    
                    {/* Only show mana bar if character has mana properties */}
                    {hasMana && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Mana:</span>
                          <div className="flex-grow bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${(character.mana / character.max_mana) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{character.mana}/{character.max_mana}</span>
                        </div>
                      </div>
                    )}
                    
                    {renderStatusEffects(character.statusEffekte)}
                    
                    <div className="mt-2 text-xs flex flex-wrap gap-1">
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                        <Sword className="h-3 w-3 mr-1" /> {character.staerke}
                      </span>
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                        <Shield className="h-3 w-3 mr-1" /> {character.verteidigung}
                      </span>
                      <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                        <Sparkles className="h-3 w-3 mr-1" /> {character.ausweichen}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Combat log */}
                <div className="mt-4">
                  <h3 className="font-semibold border-b border-rpg-secondary pb-1 mb-2 fantasy-title">Kampflog</h3>
                  <ScrollArea className="h-[180px] rounded border p-2 bg-white bg-opacity-70">
                    <div className="space-y-2">
                      {combatLog.map((log, index) => (
                        <div key={index} className={`text-sm ${
                          log.includes('Boss') || log.includes('Kritisch') ? 'font-semibold text-red-600' : 
                          log.includes('heilst') || log.includes('regenerierst') ? 'text-green-600' :
                          log.includes('weichst') ? 'text-blue-600' : ''
                        }`}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              {/* Combat Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-rpg-secondary pb-1 mb-3 fantasy-title">Aktionen</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="rpg"
                    onClick={() => dispatch({ type: 'ATTACK_MONSTER' })}
                    className="flex items-center"
                  >
                    <Sword className="mr-2 h-5 w-5" />
                    Angreifen
                  </Button>
                  
                  {character.zauber.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium fantasy-title">Zauber:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {character.zauber.map((spell, index) => {
                          const spellDef = zauberDefinitionen[spell];
                          const hasEnoughMana = hasMana && character.mana >= (spellDef?.manaBedarf || 0);
                          
                          // Style based on spell type
                          let spellStyle = "bg-blue-600 hover:bg-blue-700";
                          let SpellIcon = Sparkles;
                          
                          if (spellDef?.statusEffekt === 'Brennen') {
                            spellStyle = "bg-red-600 hover:bg-red-700";
                            SpellIcon = FlameKindling;
                          } else if (spellDef?.statusEffekt === 'Gefroren') {
                            spellStyle = "bg-blue-700 hover:bg-blue-800";
                            SpellIcon = Snowflake;
                          } else if (spellDef?.statusEffekt === 'Betäubt') {
                            spellStyle = "bg-yellow-600 hover:bg-yellow-700";
                            SpellIcon = Zap;
                          } else if (spellDef?.heilung) {
                            spellStyle = "bg-green-600 hover:bg-green-700";
                          }
                          
                          return (
                            <Button 
                              key={index} 
                              className={`text-sm py-1 flex items-center justify-center ${hasEnoughMana ? spellStyle : 'bg-gray-500'}`}
                              title={`${spellDef?.beschreibung || ""} (${spellDef?.manaBedarf || 0} Mana)`}
                              onClick={() => dispatch({ type: 'CAST_SPELL', spell })}
                              disabled={hasMana && !hasEnoughMana}
                            >
                              <SpellIcon className="h-4 w-4 mr-1" />
                              <span className="truncate">{spell}</span>
                              <span className="ml-1 text-xs">({spellDef?.manaBedarf || 0})</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {character.inventar.filter(item => item.typ === "verbrauchbar").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium fantasy-title">Items:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {character.inventar
                          .filter(item => item.typ === "verbrauchbar")
                          .map((item, index) => {
                            // Style based on item type
                            let itemStyle = "bg-green-600 hover:bg-green-700";
                            
                            if (item.statusEffekt === 'Brennen') {
                              itemStyle = "bg-red-600 hover:bg-red-700";
                            } else if (item.statusEffekt === 'Gefroren') {
                              itemStyle = "bg-blue-700 hover:bg-blue-800";
                            } else if (item.statusEffekt === 'Betäubt') {
                              itemStyle = "bg-yellow-600 hover:bg-yellow-700";
                            } else if (item.boni.mana) {
                              itemStyle = "bg-blue-600 hover:bg-blue-700";
                            }
                            
                            return (
                              <Button 
                                key={index} 
                                className={`text-sm py-1 ${itemStyle}`}
                                title={item.beschreibung || ""}
                                onClick={() => {
                                  const itemIndex = character.inventar.findIndex(i => i === item);
                                  if (itemIndex !== -1) {
                                    dispatch({ type: 'USE_ITEM', itemIndex });
                                  }
                                }}
                              >
                                {item.name}
                              </Button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="mt-4 border-rpg-secondary text-rpg-primary hover:bg-rpg-background/50"
                    onClick={() => dispatch({ type: 'FLEE_COMBAT' })}
                  >
                    Fliehen
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CombatScreen;
