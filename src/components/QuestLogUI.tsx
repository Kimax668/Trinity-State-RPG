
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const QuestLogUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, quests } = state;

  // Filter quests not yet taken
  const availableQuests = quests.filter(
    quest => !character.quest_log.some(q => q.name === quest.name)
  );

  // Handle taking a new quest
  const handleTakeQuest = (quest: any) => {
    dispatch({ type: 'TAKE_QUEST', quest });
  };

  return (
    <div className="space-y-4">
      {/* Active Quests */}
      <div>
        <h3 className="text-lg font-bold mb-2">Aktive Quests</h3>
        {character.quest_log.length > 0 ? (
          <div className="space-y-3">
            {character.quest_log.map((quest, index) => (
              <Card key={index} className={quest.abgeschlossen ? 'bg-green-50' : 'bg-white'}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex justify-between">
                    <span>{quest.name}</span>
                    {quest.abgeschlossen && (
                      <span className="text-green-600 text-sm">Abgeschlossen</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm mb-2">{quest.beschreibung}</p>
                  
                  {!quest.abgeschlossen && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Fortschritt:</span>
                        <span>{quest.aktuelle_anzahl}/{quest.ziel_anzahl}</span>
                      </div>
                      <Progress value={(quest.aktuelle_anzahl / quest.ziel_anzahl) * 100} />
                    </div>
                  )}
                  
                  <div className="text-xs mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Belohnung:</span>
                      <span className="text-yellow-600">{quest.belohnung_gold} Gold</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Erfahrung:</span>
                      <span className="text-blue-600">{quest.belohnung_xp} XP</span>
                    </div>
                    {quest.belohnung_item && (
                      <div className="flex justify-between">
                        <span>Item:</span>
                        <span className="text-purple-600">{quest.belohnung_item.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Keine aktiven Quests</p>
        )}
      </div>
      
      {/* Available Quests */}
      {character.aktueller_ort === 'Stadt' && availableQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Verfügbare Quests</h3>
          <div className="space-y-3">
            {availableQuests.map((quest, index) => (
              <Card key={index}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{quest.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm mb-2">{quest.beschreibung}</p>
                  
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Belohnung:</span>
                      <span className="text-yellow-600">{quest.belohnung_gold} Gold</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Erfahrung:</span>
                      <span className="text-blue-600">{quest.belohnung_xp} XP</span>
                    </div>
                    {quest.belohnung_item && (
                      <div className="flex justify-between">
                        <span>Item:</span>
                        <span className="text-purple-600">{quest.belohnung_item.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="rpg-button w-full"
                    onClick={() => handleTakeQuest(quest)}
                  >
                    Quest annehmen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestLogUI;
