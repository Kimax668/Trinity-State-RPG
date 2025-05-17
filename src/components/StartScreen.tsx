
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sword, Trophy, MapPin, Scroll } from 'lucide-react';

const StartScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [savedChars, setSavedChars] = useState<string[]>([]);
  const { dispatch, loadSavedCharacters, loadCharacter } = useGameContext();

  useEffect(() => {
    // Load saved characters
    const chars = loadSavedCharacters();
    setSavedChars(chars);
  }, [loadSavedCharacters]);

  const handleCreateCharacter = () => {
    if (name.trim()) {
      dispatch({ type: 'CREATE_CHARACTER', name: name.trim() });
    }
  };

  const handleLoadCharacter = (characterName: string) => {
    loadCharacter(characterName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-md p-6 parchment">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 fantasy-title">Trinity-State-RPG</h1>
          <div className="flex justify-center space-x-2 mb-6">
            <Sword className="text-rpg-accent h-8 w-8" />
            <Trophy className="text-rpg-secondary h-8 w-8" />
            <MapPin className="text-rpg-primary h-8 w-8" />
            <Scroll className="text-rpg-accent h-8 w-8" />
          </div>
          <p className="text-lg mb-4">Willkommen im Reich der Abenteuer!</p>
        </div>
        
        {!showForm ? (
          <div className="space-y-4">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full rpg-button"
            >
              Neuer Charakter
            </Button>
            
            {savedChars.length > 0 && (
              <div className="mt-8">
                <h2 className="text-center text-xl font-semibold mb-4 fantasy-title">Gespeicherte Charaktere</h2>
                <div className="space-y-2">
                  {savedChars.map((char) => (
                    <div
                      key={char}
                      className="p-3 border border-rpg-secondary rounded-md cursor-pointer bg-white bg-opacity-50 hover:bg-opacity-70 flex items-center justify-between transition-all"
                      onClick={() => handleLoadCharacter(char)}
                    >
                      <div className="flex items-center">
                        <Sword className="mr-2 h-5 w-5 text-rpg-primary" />
                        <span>{char}</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadCharacter(char);
                        }}
                      >
                        Laden
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Charaktername:</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-rpg-secondary"
                placeholder="Gib einen Namen ein..."
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleCreateCharacter}
                disabled={!name.trim()}
                className="flex-1 rpg-button"
              >
                Erstellen
              </Button>
              <Button 
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Zurück
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
