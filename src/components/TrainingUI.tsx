
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Brain, Shield, Sparkles, Footprints } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const TrainingUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, trainingCosts } = state;

  // Stelle sicher, dass attributeTrainingCount initialisiert ist
  const trainingCount = character.attributeTrainingCount || {
    staerke: 0,
    intelligenz: 0,
    ausweichen: 0,
    verteidigung: 0,
    mana: 0
  };

  // Berechne Trainingskosten basierend auf Level und Anzahl der Trainings
  const calculateCost = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana') => {
    const count = trainingCount[attribute] || 0;
    const baseCost = trainingCosts.basis;
    const multiplier = trainingCosts.multiplikator;
    
    // Basiskosten skaliert nach Level
    const levelCost = Math.floor(baseCost * (1 + ((character.level - 1) * multiplier)));
    
    // Zusätzliche Kostenerhöhung basierend darauf, wie oft dieses Attribut trainiert wurde
    const trainingMultiplier = 1 + (count * 0.25); // +25% pro Training
    
    return Math.floor(levelCost * trainingMultiplier);
  };

  const handleTraining = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana') => {
    const cost = calculateCost(attribute);
    if (character.gold >= cost) {
      dispatch({ type: 'TRAIN_ATTRIBUTE', attribute });
    }
  };
  
  // Get available spells based on character level
  const getAvailableSpells = () => {
    const allSpells = Object.entries(state.zauberDefinitionen)
      .filter(([spellName, _]) => !character.zauber.includes(spellName))
      .filter(([_, spell]) => !spell.minLevel || character.level >= spell.minLevel)
      .map(([name, _]) => name);
    
    return allSpells;
  };
  
  // Handle learning a spell
  const handleLearnSpell = (spell: string) => {
    dispatch({ type: 'LEARN_SPELL', spell });
  };

  return (
    <Card className="training-card mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Training</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attributes">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="attributes" className="flex-1">Attribute</TabsTrigger>
            <TabsTrigger value="spells" className="flex-1">Zauber</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attributes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center">
                  <Swords size={18} className="mr-2" />
                  <span>Stärke trainieren</span>
                </div>
                <Button 
                  onClick={() => handleTraining('staerke')}
                  variant="outline" 
                  className="flex items-center"
                  disabled={character.gold < calculateCost('staerke')}
                >
                  <span className="mr-1">{calculateCost('staerke')}</span>
                  <span className="text-yellow-500">Gold</span>
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center">
                  <Brain size={18} className="mr-2" />
                  <span>Intelligenz trainieren</span>
                </div>
                <Button 
                  onClick={() => handleTraining('intelligenz')}
                  variant="outline" 
                  className="flex items-center"
                  disabled={character.gold < calculateCost('intelligenz')}
                >
                  <span className="mr-1">{calculateCost('intelligenz')}</span>
                  <span className="text-yellow-500">Gold</span>
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center">
                  <Footprints size={18} className="mr-2" />
                  <span>Ausweichen trainieren</span>
                </div>
                <Button 
                  onClick={() => handleTraining('ausweichen')}
                  variant="outline" 
                  className="flex items-center"
                  disabled={character.gold < calculateCost('ausweichen')}
                >
                  <span className="mr-1">{calculateCost('ausweichen')}</span>
                  <span className="text-yellow-500">Gold</span>
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded">
                <div className="flex items-center">
                  <Shield size={18} className="mr-2" />
                  <span>Verteidigung trainieren</span>
                </div>
                <Button 
                  onClick={() => handleTraining('verteidigung')}
                  variant="outline" 
                  className="flex items-center"
                  disabled={character.gold < calculateCost('verteidigung')}
                >
                  <span className="mr-1">{calculateCost('verteidigung')}</span>
                  <span className="text-yellow-500">Gold</span>
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded col-span-1 md:col-span-2 bg-blue-50">
                <div className="flex items-center">
                  <Sparkles size={18} className="mr-2 text-blue-500" />
                  <span>Mana trainieren (+5)</span>
                </div>
                <Button 
                  onClick={() => handleTraining('mana')}
                  variant="outline" 
                  className="flex items-center"
                  disabled={character.gold < calculateCost('mana')}
                >
                  <span className="mr-1">{calculateCost('mana')}</span>
                  <span className="text-yellow-500">Gold</span>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="spells">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 py-2 pr-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Dein Gold:</span>
                  <span className="text-yellow-600 font-semibold">{character.gold}</span>
                </div>
                
                <div className="grid gap-3">
                  {getAvailableSpells().length > 0 ? (
                    getAvailableSpells().map((spell, index) => {
                      const spellDef = state.zauberDefinitionen[spell];
                      
                      return (
                        <Card key={index}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{spell}</h3>
                              <p className="text-sm text-gray-600">{spellDef.beschreibung}</p>
                              {spellDef.minLevel && (
                                <p className="text-xs text-blue-600">Benötigt Level {spellDef.minLevel}</p>
                              )}
                              {spellDef.manaKosten && (
                                <p className="text-xs text-blue-400">Mana: {spellDef.manaKosten}</p>
                              )}
                            </div>
                            <Button 
                              className="rpg-button" 
                              onClick={() => handleLearnSpell(spell)}
                              disabled={character.gold < 50 || (spellDef.minLevel && character.level < spellDef.minLevel)}
                            >
                              Lernen (50 Gold)
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <p className="text-center italic">Du kennst bereits alle verfügbaren Zauber</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingUI;
