
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CombatScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, currentMonster, combatLog } = state;

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
          
          if (effect.name === "Brennen") badgeColor = "bg-red-500";
          else if (effect.name === "Gefroren") badgeColor = "bg-blue-500";
          else if (effect.name === "Betäubt") badgeColor = "bg-yellow-500";
          else if (effect.name === "Vergiftet") badgeColor = "bg-green-500";
          
          return (
            <Badge key={idx} className={`${badgeColor} text-white text-xs`}>
              {effect.name} ({effect.dauer})
            </Badge>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className={`parchment border-2 ${currentMonster.isBoss ? "border-red-600 shadow-lg shadow-red-500/20" : "border-rpg-primary"}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Combat Info & Log */}
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-rpg-accent">
                    {currentMonster.isBoss ? "Boss Kampf!" : "Kampf!"}
                  </h2>
                </div>
                
                {/* Combat status */}
                <div className="space-y-4">
                  {/* Monster stats */}
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${currentMonster.isBoss ? 'text-red-600' : ''}`}>
                          {currentMonster.name}
                        </h3>
                        {currentMonster.isBoss && (
                          <Badge className="bg-red-600 text-white">Boss</Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        HP: {currentMonster.hp}/{currentMonster.max_hp}
                      </div>
                    </div>
                    
                    <div className="mt-1 health-bar">
                      <div 
                        className={`health-bar-fill ${currentMonster.isBoss ? 'bg-red-600' : ''}`}
                        style={{ 
                          width: `${Math.max(0, (currentMonster.hp / currentMonster.max_hp) * 100)}%` 
                        }}
                      />
                    </div>
                    
                    {renderStatusEffects(currentMonster.statusEffekte)}
                    
                    <div className="mt-1 text-xs">
                      {currentMonster.verteidigung && (
                        <span className="inline-block bg-gray-100 px-1 rounded mr-2">
                          Verteidigung: {currentMonster.verteidigung}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Character stats */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{character.name}</h3>
                      <div className="text-sm">
                        HP: {character.hp}/{character.max_hp}
                      </div>
                    </div>
                    
                    <div className="mt-1 health-bar">
                      <div 
                        className="health-bar-fill" 
                        style={{ width: `${(character.hp / character.max_hp) * 100}%` }}
                      />
                    </div>
                    
                    {renderStatusEffects(character.statusEffekte)}
                    
                    <div className="mt-1 text-xs">
                      <span className="inline-block bg-gray-100 px-1 rounded mr-2">
                        Stärke: {character.staerke}
                      </span>
                      <span className="inline-block bg-gray-100 px-1 rounded mr-2">
                        Verteidigung: {character.verteidigung}
                      </span>
                      <span className="inline-block bg-gray-100 px-1 rounded">
                        Ausweichen: {character.ausweichen}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Combat log */}
                <div className="mt-4">
                  <h3 className="font-semibold border-b border-rpg-secondary pb-1 mb-2">Kampflog</h3>
                  <ScrollArea className="h-[120px] rounded border p-2 bg-white bg-opacity-70">
                    <div className="space-y-2">
                      {combatLog.map((log, index) => (
                        <div key={index} className={`text-sm ${log.includes('Boss') || log.includes('Selten') || log.includes('Kritisch') ? 'font-semibold text-red-600' : ''}`}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              {/* Combat Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-rpg-secondary pb-1 mb-3">Aktionen</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="rpg-button"
                    onClick={() => dispatch({ type: 'ATTACK_MONSTER' })}
                  >
                    Angreifen
                  </Button>
                  
                  {character.zauber.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Zauber:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {character.zauber.map((spell, index) => {
                          const spellDef = state.zauberDefinitionen[spell];
                          return (
                            <Button 
                              key={index} 
                              className={`rpg-button text-sm py-1 ${
                                spellDef?.statusEffekt === 'Brennen' ? 'bg-red-700 hover:bg-red-800' :
                                spellDef?.statusEffekt === 'Gefroren' ? 'bg-blue-700 hover:bg-blue-800' :
                                spellDef?.statusEffekt === 'Betäubt' ? 'bg-yellow-700 hover:bg-yellow-800' :
                                'bg-blue-700 hover:bg-blue-800'
                              }`}
                              title={spellDef?.beschreibung || ""}
                              onClick={() => dispatch({ type: 'CAST_SPELL', spell })}
                            >
                              {spell}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {character.inventar.filter(item => item.typ === "verbrauchbar").length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Items:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {character.inventar
                          .filter(item => item.typ === "verbrauchbar")
                          .map((item, index) => (
                            <Button 
                              key={index} 
                              className={`rpg-button text-sm py-1 ${
                                item.statusEffekt === 'Brennen' ? 'bg-red-700 hover:bg-red-800' :
                                item.statusEffekt === 'Gefroren' ? 'bg-blue-700 hover:bg-blue-800' :
                                item.statusEffekt === 'Betäubt' ? 'bg-yellow-700 hover:bg-yellow-800' :
                                'bg-green-700 hover:bg-green-800'
                              }`}
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
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="mt-4"
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
