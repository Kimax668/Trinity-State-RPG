
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

const CombatScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, currentMonster, combatLog } = state;

  if (!currentMonster) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="parchment border-2 border-rpg-primary">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Combat Info & Log */}
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-rpg-accent">Kampf!</h2>
                </div>
                
                {/* Combat status */}
                <div className="space-y-4">
                  {/* Monster stats */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{currentMonster.name}</h3>
                      <div className="text-sm">
                        HP: {currentMonster.hp}/{currentMonster.max_hp}
                      </div>
                    </div>
                    
                    <div className="mt-1 health-bar">
                      <div 
                        className="health-bar-fill" 
                        style={{ 
                          width: `${Math.max(0, (currentMonster.hp / currentMonster.max_hp) * 100)}%` 
                        }}
                      />
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
                  </div>
                </div>

                {/* Combat log */}
                <div className="mt-4">
                  <h3 className="font-semibold border-b border-rpg-secondary pb-1 mb-2">Kampflog</h3>
                  <ScrollArea className="h-[120px] rounded border p-2 bg-white bg-opacity-70">
                    <div className="space-y-2">
                      {combatLog.map((log, index) => (
                        <div key={index} className="text-sm">
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
                        {character.zauber.map((spell, index) => (
                          <Button 
                            key={index} 
                            className="rpg-button bg-blue-700 hover:bg-blue-800"
                            onClick={() => dispatch({ type: 'CAST_SPELL', spell })}
                          >
                            {spell}
                          </Button>
                        ))}
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
                              className="rpg-button bg-green-700 hover:bg-green-800"
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
