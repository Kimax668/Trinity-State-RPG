
import React from 'react';
import { useGameContext } from '../context/GameContext';
import CharacterUI from './CharacterUI';
import LocationUI from './LocationUI';
import InventoryUI from './InventoryUI';
import QuestLogUI from './QuestLogUI';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Scroll, MapPin, ShieldAlert, Sword, Sparkles } from "lucide-react";

const MainUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;

  // Calculate level progress percentage
  const levelProgressPercent = (character.xp / (character.level * 100)) * 100;

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 page-container">
      {/* Character Stats Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 parchment">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="flex flex-col">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold fantasy-title">{character.name}</h1>
              <div className="ml-2 flex items-center bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                <Trophy size={16} className="mr-1" />
                <span className="text-sm font-semibold">Lvl. {character.level}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <MapPin size={14} className="mr-1" />
              {character.aktueller_ort}
            </div>
          </div>
        </div>
          
        <div className="flex-grow mx-2 md:mx-8 w-full md:w-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 text-right text-sm flex items-center justify-end">
                <ShieldAlert size={14} className="mr-1" />
              </span>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-800 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${(character.hp / character.max_hp) * 100}%` }}
                >
                </div>
              </div>
              <span className="w-20 text-sm font-semibold">{character.hp}/{character.max_hp}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right text-sm flex items-center justify-end">
                <Sparkles size={14} className="mr-1" />
              </span>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${(character.mana / character.max_mana) * 100}%` }}
                >
                </div>
              </div>
              <span className="w-20 text-sm font-semibold">{character.mana}/{character.max_mana}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-right text-sm flex items-center justify-end">
                <Scroll size={14} className="mr-1" />
              </span>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${levelProgressPercent}%` }}
                >
                </div>
              </div>
              <span className="w-20 text-sm font-semibold">{character.xp}/{character.level * 100}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="text-right">
            <div className="flex items-center">
              <span className="font-semibold">{character.gold}</span>
              <span className="text-yellow-600 ml-1">Gold</span>
            </div>
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
          <Card className="parchment h-full border-none">
            <CardContent className="p-4">
              <Tabs defaultValue="location" className="w-full">
                <TabsList className="mb-4 w-full bg-amber-100 border border-amber-300">
                  <TabsTrigger value="location" className="flex-1 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" /> 
                      Ort: {character.aktueller_ort}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="quests" className="flex-1 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">
                    <div className="flex items-center">
                      <Scroll size={16} className="mr-2" /> 
                      Quests
                    </div>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="location" className="h-full">
                  <LocationUI />
                </TabsContent>
                <TabsContent value="quests">
                  <QuestLogUI />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <Tabs defaultValue="character" className="w-full">
            <TabsList className="w-full bg-amber-100 border border-amber-300">
              <TabsTrigger value="character" className="flex-1 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">
                <div className="flex items-center">
                  <Sword size={16} className="mr-2" /> 
                  Charakter
                </div>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex-1 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900">
                <div className="flex items-center">
                  <Trophy size={16} className="mr-2" /> 
                  Inventar
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="character" className="w-full">
              <Card className="parchment h-full border-none">
                <CardContent className="p-4">
                  <CharacterUI />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="w-full">
              <Card className="parchment h-full border-none">
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
