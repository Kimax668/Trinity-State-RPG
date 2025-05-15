
import React from 'react';
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
  Backpack
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const CharacterUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;
  
  // Calculate XP progress to next level
  const xpNeeded = character.level * 100;
  const xpProgress = Math.min((character.xp / xpNeeded) * 100, 100);

  const handleAssignStatPoint = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung') => {
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
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 md:grid-cols-2">
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
              <span>Gold:</span>
              <span className="text-yellow-500">{character.gold}</span>
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
          <div className="stat-block">
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
          <div className="stat-block">
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
      </CardContent>
    </Card>
  );
};

export default CharacterUI;
