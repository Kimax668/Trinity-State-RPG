
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const QuestLogUI: React.FC = () => {
  const { state } = useGameContext();
  const { character } = state;

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
                    {quest.abgeschlossen ? (
                      <span className="text-green-600 text-sm">
                        Abgeschlossen - Gehe zu {quest.npc_empfaenger}
                      </span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm mb-2">{quest.beschreibung}</p>
                  <p className="text-xs text-gray-500 mb-1">Quest von: {quest.npc_geber}</p>
                  
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
          <p className="text-gray-500 italic">Keine aktiven Quests. Sprich mit NPCs in Städten und Dörfern, um Quests anzunehmen.</p>
        )}
      </div>
    </div>
  );
};

export default QuestLogUI;
