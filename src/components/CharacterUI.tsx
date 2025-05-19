
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Swords, 
  Brain,
  Axe,
  Backpack,
  Sparkles,
  Star,
  Trophy
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const CharacterUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;
  const [tabView, setTabView] = useState<string>("stats");
  
  // Calculate XP progress to next level
  const xpNeeded = character.level * 100;
  const xpProgress = Math.min((character.xp / xpNeeded) * 100, 100);

  const handleAssignStatPoint = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana') => {
    dispatch({ type: 'ASSIGN_STAT_POINT', attribute });
  };
  
  // Format equipment bonus text
  const getEquipmentBonusText = (bonusType: string) => {
    let totalBonus = 0;
    
    // Check each equipment slot
    if (character.ausgeruestet.waffe && character.ausgeruestet.waffe.boni[bonusType]) {
      totalBonus += character.ausgeruestet.waffe.boni[bonusType];
    }
    if (character.ausgeruestet.ruestung && character.ausgeruestet.ruestung.boni[bonusType]) {
      totalBonus += character.ausgeruestet.ruestung.boni[bonusType];
    }
    if (character.ausgeruestet.helm && character.ausgeruestet.helm.boni[bonusType]) {
      totalBonus += character.ausgeruestet.helm.boni[bonusType];
    }
    if (character.ausgeruestet.accessoire && character.ausgeruestet.accessoire.boni[bonusType]) {
      totalBonus += character.ausgeruestet.accessoire.boni[bonusType];
    }
    
    return totalBonus > 0 ? `+${totalBonus}` : '';
  };

  // Check if an equipment item has level requirements
  const checkItemLevelRequirement = (item: any) => {
    if (!item) return null;
    
    if (item.minLevel && item.minLevel > character.level) {
      return `(Benötigt Level ${item.minLevel})`;
    }
    return null;
  };

  // Render achievement stars with colors based on completion level
  const renderAchievementStars = (achievement: any) => {
    const starClasses = [
      "text-gray-400", // Gray - first level (not completed)
      "text-gray-900", // Black - second level
      "text-yellow-500", // Yellow - third level
      "text-purple-600" // Purple/Mythic - fourth level
    ];
    
    return (
      <div className="flex">
        {achievement.stufen.map((stufe: number, index: number) => {
          const isCompleted = achievement.fortschritt >= stufe;
          const starClass = isCompleted ? starClasses[index] : starClasses[0];
          
          return (
            <span key={index} className={`${starClass}`} title={`${stufe} ${achievement.ziel} besiegt`}>
              <Star className="h-5 w-5" fill={isCompleted ? "currentColor" : "none"} />
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="character-card mb-4 w-full">
      <CardHeader className="pb-2">
        <CardTitle>{character.name}</CardTitle>
        <CardDescription>Level {character.level}</CardDescription>
        <div className="flex justify-between text-xs mt-1 mb-1">
          <span>XP: {character.xp}/{xpNeeded}</span>
        </div>
        <Progress value={xpProgress} />
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs value={tabView} onValueChange={setTabView}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="stats">
              <Swords className="mr-1 h-4 w-4" />
              Attribute
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="mr-1 h-4 w-4" />
              Erfolge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2">
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield size={16} className="mr-1" />
                    <span>HP:</span>
                  </div>
                  <span>{character.hp}/{character.max_hp}</span>
                </div>
                <Progress value={(character.hp / character.max_hp) * 100} className="h-2" />
              </div>
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles size={16} className="mr-1" />
                    <span>Mana:</span>
                  </div>
                  <span>{character.mana}/{character.max_mana}</span>
                </div>
                <Progress value={(character.mana / character.max_mana) * 100} className="h-2 bg-blue-100" />
              </div>
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <span>Gold:</span>
                  <span className="text-yellow-500">{character.gold}</span>
                </div>
              </div>
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles size={16} className="mr-1 text-blue-500" />
                    <span>Max Mana:</span>
                  </div>
                  <span className="flex items-center">
                    {character.max_mana} <span className="text-green-500">{getEquipmentBonusText('mana')}</span>
                    {character.unverteilte_punkte > 0 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-1 h-5 w-5 rounded-full" 
                        onClick={() => handleAssignStatPoint('mana')}
                      >
                        +
                      </Button>
                    )}
                  </span>
                </div>
              </div>
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Swords size={16} className="mr-1" />
                    <span>Stärke:</span>
                  </div>
                  <span className="flex items-center">
                    {character.staerke} <span className="text-green-500">{getEquipmentBonusText('staerke')}</span>
                    {character.unverteilte_punkte > 0 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-1 h-5 w-5 rounded-full" 
                        onClick={() => handleAssignStatPoint('staerke')}
                      >
                        +
                      </Button>
                    )}
                  </span>
                </div>
              </div>
              <div className="stat-block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain size={16} className="mr-1" />
                    <span>Intelligenz:</span>
                  </div>
                  <span className="flex items-center">
                    {character.intelligenz} <span className="text-green-500">{getEquipmentBonusText('intelligenz')}</span>
                    {character.unverteilte_punkte > 0 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-1 h-5 w-5 rounded-full" 
                        onClick={() => handleAssignStatPoint('intelligenz')}
                      >
                        +
                      </Button>
                    )}
                  </span>
                </div>
              </div>
              <div className="stat-block w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>Ausweichen:</span>
                  </div>
                  <span className="flex items-center">
                    {character.ausweichen}% <span className="text-green-500">{getEquipmentBonusText('ausweichen')}</span>
                    {character.unverteilte_punkte > 0 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-1 h-5 w-5 rounded-full" 
                        onClick={() => handleAssignStatPoint('ausweichen')}
                      >
                        +
                      </Button>
                    )}
                  </span>
                </div>
              </div>
              <div className="stat-block w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield size={16} className="mr-1" />
                    <span>Verteidigung:</span>
                  </div>
                  <span className="flex items-center">
                    {character.verteidigung} <span className="text-green-500">{getEquipmentBonusText('verteidigung')}</span>
                    {character.unverteilte_punkte > 0 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="ml-1 h-5 w-5 rounded-full" 
                        onClick={() => handleAssignStatPoint('verteidigung')}
                      >
                        +
                      </Button>
                    )}
                  </span>
                </div>
              </div>
              {character.unverteilte_punkte > 0 && (
                <div className="stat-block col-span-2">
                  <div className="text-center text-green-500 font-semibold">
                    Verfügbare Statpunkte: {character.unverteilte_punkte}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <h3 className="font-semibold text-sm mb-1">Ausrüstung:</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="equipment-slot flex flex-col">
                  <div className="flex items-center">
                    <Swords size={14} className="mr-1" />
                    <span>Waffe: {character.ausgeruestet.waffe ? character.ausgeruestet.waffe.name : "—"}</span>
                  </div>
                  {character.ausgeruestet.waffe && character.ausgeruestet.waffe.minLevel && (
                    <div className="text-xs text-amber-600 ml-5">
                      {checkItemLevelRequirement(character.ausgeruestet.waffe)}
                    </div>
                  )}
                </div>
                <div className="equipment-slot flex flex-col">
                  <div className="flex items-center">
                    <Shield size={14} className="mr-1" />
                    <span>Rüstung: {character.ausgeruestet.ruestung ? character.ausgeruestet.ruestung.name : "—"}</span>
                  </div>
                  {character.ausgeruestet.ruestung && character.ausgeruestet.ruestung.minLevel && (
                    <div className="text-xs text-amber-600 ml-5">
                      {checkItemLevelRequirement(character.ausgeruestet.ruestung)}
                    </div>
                  )}
                </div>
                <div className="equipment-slot flex flex-col">
                  <div className="flex items-center">
                    <Axe size={14} className="mr-1" />
                    <span>Helm: {character.ausgeruestet.helm ? character.ausgeruestet.helm.name : "—"}</span>
                  </div>
                  {character.ausgeruestet.helm && character.ausgeruestet.helm.minLevel && (
                    <div className="text-xs text-amber-600 ml-5">
                      {checkItemLevelRequirement(character.ausgeruestet.helm)}
                    </div>
                  )}
                </div>
                <div className="equipment-slot flex flex-col">
                  <div className="flex items-center">
                    <Backpack size={14} className="mr-1" />
                    <span>Accessoire: {character.ausgeruestet.accessoire ? character.ausgeruestet.accessoire.name : "—"}</span>
                  </div>
                  {character.ausgeruestet.accessoire && character.ausgeruestet.accessoire.minLevel && (
                    <div className="text-xs text-amber-600 ml-5">
                      {checkItemLevelRequirement(character.ausgeruestet.accessoire)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <h3 className="font-semibold text-sm mb-1">Zauber:</h3>
              <div className="flex flex-wrap gap-1">
                {character.zauber.length > 0 ? (
                  character.zauber.map((zauber, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      {zauber}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic text-xs">Keine Zauber gelernt</span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="pt-1">
              <div className="flex items-center mb-3">
                <Trophy size={18} className="mr-2 text-yellow-500" />
                <h3 className="font-semibold">Erreichte Erfolge</h3>
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                {character.erfolge && character.erfolge.length > 0 ? (
                  <div className="space-y-4">
                    {character.erfolge.map((achievement, index) => {
                      // Calculate progress percentage for the progress bar
                      const currentLevel = achievement.stufen.findIndex((stufe, i) => 
                        achievement.fortschritt < stufe
                      );
                      const prevThreshold = currentLevel > 0 ? achievement.stufen[currentLevel - 1] : 0;
                      const nextThreshold = currentLevel >= 0 ? achievement.stufen[currentLevel] : achievement.stufen[0];
                      const segmentProgress = ((achievement.fortschritt - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
                      const progressValue = currentLevel > 0 ? 
                        (currentLevel / achievement.stufen.length) * 100 + (segmentProgress / achievement.stufen.length) :
                        segmentProgress / achievement.stufen.length;
                      
                      return (
                        <div key={achievement.id} className="achievement-item">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <h4 className="text-sm font-medium">{achievement.name}</h4>
                              <p className="text-xs text-gray-600">{achievement.beschreibung}</p>
                            </div>
                            {renderAchievementStars(achievement)}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{achievement.fortschritt}</span>
                            <span>{achievement.stufen[achievement.stufen.length - 1]}</span>
                          </div>
                          
                          <Progress 
                            value={progressValue} 
                            className="h-1.5"
                          />
                          
                          {index < character.erfolge.length - 1 && (
                            <Separator className="my-3" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Keine Erfolge vorhanden</p>
                  </div>
                )}
              </ScrollArea>
              
              <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span>Grau - Nicht erreicht</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-gray-900" fill="currentColor" />
                  <span>Schwarz - Erster Fortschritt</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                  <span>Gold - Veteran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" fill="currentColor" />
                  <span>Lila - Mythisch</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CharacterUI;
