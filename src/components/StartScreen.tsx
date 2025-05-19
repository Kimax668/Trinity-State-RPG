
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const StartScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { loadedCharacters, autoSave } = state;
  
  const [characterName, setCharacterName] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  
  // Load saved characters from localStorage on first render
  useEffect(() => {
    const savedCharsString = localStorage.getItem('rpg_savedCharacters');
    if (savedCharsString) {
      const savedCharacters = JSON.parse(savedCharsString);
      
      // Update global state with saved character names
      Object.keys(savedCharacters).forEach(charName => {
        const char = savedCharacters[charName];
        if (char && typeof char === 'object') {
          state.loadedCharacters.push(charName);
        }
      });
    }
  }, []);
  
  const createCharacter = () => {
    if (characterName.trim() === '') return;
    dispatch({ type: 'CREATE_CHARACTER', name: characterName });
  };
  
  const loadCharacter = () => {
    if (!selectedCharacter) return;
    
    const savedCharsString = localStorage.getItem('rpg_savedCharacters');
    if (savedCharsString) {
      const savedCharacters = JSON.parse(savedCharsString);
      if (savedCharacters[selectedCharacter]) {
        // Load the character
        const character = savedCharacters[selectedCharacter];

        // Check if the character has achievements or kill counts
        if (!character.erfolge || character.erfolge.length === 0) {
          // Ensure monsterKills is initialized if needed
          if (!character.monsterKills) {
            character.monsterKills = {};
          }
        }
        
        // Dispatch the character to the state
        dispatch({ type: 'LOAD_CHARACTER', character });
      }
    }
  };
  
  const toggleAutoSave = () => {
    dispatch({ type: 'TOGGLE_AUTOSAVE' });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/fantasy-bg.jpg')" }}>
      <Card className="w-[350px] shadow-lg border-none bg-opacity-90 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold fantasy-title">RPG Abenteuer</CardTitle>
          <CardDescription>Beginne dein Fantasy-Abenteuer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Neuer Charakter</TabsTrigger>
              <TabsTrigger value="load">Charakter laden</TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="character-name">Charaktername</Label>
                <Input 
                  id="character-name" 
                  value={characterName} 
                  onChange={(e) => setCharacterName(e.target.value)} 
                  placeholder="Name eingeben..." 
                />
              </div>
              <Button 
                className="w-full" 
                onClick={createCharacter}
                disabled={!characterName.trim()}
              >
                Erstellen
              </Button>
            </TabsContent>
            <TabsContent value="load" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="saved-character">Gespeicherte Charaktere</Label>
                <select 
                  id="saved-character" 
                  value={selectedCharacter} 
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Wähle einen Charakter...</option>
                  {loadedCharacters.map(char => (
                    <option key={char} value={char}>{char}</option>
                  ))}
                </select>
              </div>
              <Button 
                className="w-full" 
                onClick={loadCharacter}
                disabled={!selectedCharacter}
              >
                Laden
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center space-x-2 mt-6 pt-6 border-t">
            <Switch 
              checked={autoSave} 
              onCheckedChange={toggleAutoSave} 
              id="autosave"
            />
            <Label htmlFor="autosave">Auto-Speichern aktivieren</Label>
          </div>
          
          <div className="mt-4 text-xs text-center text-gray-500">
            Version 1.0.0 | © 2024 Fantasy RPG
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartScreen;
