
import React from 'react';
import { useGameContext } from '../context/GameContext';
import CharacterUI from './CharacterUI';
import LocationUI from './LocationUI';
import InventoryUI from './InventoryUI';
import QuestLogUI from './QuestLogUI';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MainUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Character Stats Bar */}
      <div className="flex justify-between items-center p-4 parchment">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {character.name} 
            <span className="text-sm font-normal ml-2">Lvl. {character.level}</span>
          </h1>
        </div>
          
        <div className="flex-grow mx-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 text-right text-sm">HP:</span>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-red-600 h-4 rounded-full" 
                  style={{ width: `${(character.hp / character.max_hp) * 100}%` }}
                >
                </div>
              </div>
              <span className="w-20 text-sm">{character.hp}/{character.max_hp}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right text-sm">XP:</span>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${(character.xp / (character.level * 100)) * 100}%` }}
                >
                </div>
              </div>
              <span className="w-20 text-sm">{character.xp}/{character.level * 100}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="text-right">
            <div className="flex items-center">
              <span className="font-semibold">{character.gold}</span>
              <span className="text-yellow-600 ml-1">Gold</span>
            </div>
            <div className="text-sm text-gray-600">{character.aktueller_ort}</div>
          </div>
          <Button 
            onClick={() => dispatch({ type: 'SAVE_GAME' })}
            className="rpg-button"
          >
            Speichern
          </Button>
        </div>
      </div>

      {/* Main Game UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="parchment h-full">
            <CardContent className="p-4">
              <Tabs defaultValue="location">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="location" className="flex-1">Ort: {character.aktueller_ort}</TabsTrigger>
                  <TabsTrigger value="quests" className="flex-1">Quests</TabsTrigger>
                </TabsList>
                <TabsContent value="location">
                  <LocationUI />
                </TabsContent>
                <TabsContent value="quests">
                  <QuestLogUI />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="character" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="character" className="flex-1">Charakter</TabsTrigger>
              <TabsTrigger value="inventory" className="flex-1">Inventar</TabsTrigger>
            </TabsList>
            <TabsContent value="character" className="w-full">
              <Card className="parchment h-full">
                <CardContent className="p-4">
                  <CharacterUI />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="w-full">
              <Card className="parchment h-full">
                <CardContent className="p-4">
                  <InventoryUI />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MainUI;
