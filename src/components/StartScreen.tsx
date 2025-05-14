
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const StartScreen: React.FC = () => {
  const { state, dispatch, loadSavedCharacters, loadCharacter } = useGameContext();
  const [characterName, setCharacterName] = useState('');
  const [selectedSave, setSelectedSave] = useState('');
  const [screen, setScreen] = useState<'main' | 'new' | 'load'>('main');
  
  const savedCharacters = loadSavedCharacters();

  const handleCreateCharacter = () => {
    if (characterName.trim().length > 0) {
      dispatch({ type: 'CREATE_CHARACTER', name: characterName.trim() });
    }
  };

  const handleLoadCharacter = () => {
    if (selectedSave) {
      loadCharacter(selectedSave);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{backgroundImage: "url('https://img.freepik.com/free-vector/hand-drawn-fantasy-landscape_23-2150188275.jpg?w=1380&t=st=1715695329~exp=1715695929~hmac=b61cf11bc41661fb9f4c6aa408da52975f5d0c50b03144d328ec67541a47194c')", 
                backgroundSize: "cover", backgroundPosition: "center"}}>
      <div className="w-full max-w-md">
        <Card className="parchment border-2 border-rpg-primary">
          <CardHeader className="text-center border-b-2 border-rpg-secondary pb-4">
            <CardTitle className="text-3xl font-bold text-rpg-primary">Fantasy RPG</CardTitle>
          </CardHeader>
          
          {screen === 'main' && (
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl text-center font-semibold">Willkommen im Fantasy RPG</h2>
              <p className="text-center text-gray-700">
                Begib dich auf ein Abenteuer in einer Welt voller Monster, Magie und Schätze!
              </p>
              
              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  className="rpg-button" 
                  onClick={() => setScreen('new')}
                >
                  Neues Spiel
                </Button>
                
                <Button 
                  className="rpg-button" 
                  onClick={() => setScreen('load')}
                  disabled={savedCharacters.length === 0}
                >
                  Spiel laden
                </Button>
              </div>
            </CardContent>
          )}
          
          {screen === 'new' && (
            <>
              <CardContent className="pt-6">
                <h2 className="text-xl text-center font-semibold mb-4">Charakter erstellen</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="characterName" className="text-sm font-medium">
                      Wie soll dein Charakter heißen?
                    </label>
                    <Input
                      id="characterName"
                      className="rpg-input"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder="Name eingeben"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setScreen('main')}>
                  Zurück
                </Button>
                <Button 
                  className="rpg-button" 
                  onClick={handleCreateCharacter}
                  disabled={characterName.trim().length === 0}
                >
                  Abenteuer beginnen
                </Button>
              </CardFooter>
            </>
          )}
          
          {screen === 'load' && (
            <>
              <CardContent className="pt-6">
                <h2 className="text-xl text-center font-semibold mb-4">Spielstand laden</h2>
                
                {savedCharacters.length > 0 ? (
                  <div className="space-y-3">
                    {savedCharacters.map((name) => (
                      <div 
                        key={name}
                        className={`p-3 border rounded-md cursor-pointer transition-all 
                          ${selectedSave === name 
                            ? 'border-rpg-primary bg-rpg-secondary bg-opacity-20' 
                            : 'border-gray-200 hover:border-rpg-secondary'}`}
                        onClick={() => setSelectedSave(name)}
                      >
                        <p className="font-medium">{name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic">
                    Keine gespeicherten Spielstände gefunden
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setScreen('main')}>
                  Zurück
                </Button>
                <Button 
                  className="rpg-button" 
                  onClick={handleLoadCharacter}
                  disabled={!selectedSave}
                >
                  Laden
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StartScreen;
