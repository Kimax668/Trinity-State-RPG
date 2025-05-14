
import React from 'react';
import { useGameContext } from '../context/GameContext';

const CharacterUI: React.FC = () => {
  const { state } = useGameContext();
  const { character } = state;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2 border-b-2 border-rpg-secondary pb-1">Charakterstatus</h2>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <span className="text-rpg-accent font-medium w-24">Stärke:</span>
          <span>{character.staerke}</span>
        </div>
        <div className="flex items-center">
          <span className="text-rpg-accent font-medium w-24">Intelligenz:</span>
          <span>{character.intelligenz}</span>
        </div>
        <div className="flex items-center">
          <span className="text-rpg-accent font-medium w-24">Ausweichen:</span>
          <span>{character.ausweichen}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-rpg-accent font-medium w-24">Level:</span>
          <span>{character.level}</span>
        </div>
      </div>

      {character.ausgeruestet && (
        <div className="mt-2">
          <h3 className="font-semibold text-rpg-primary border-b border-rpg-secondary pb-1">Ausgerüstet</h3>
          <div className="p-2 border border-rpg-secondary rounded mt-2 bg-white bg-opacity-40">
            <div className="font-medium">{character.ausgeruestet.name}</div>
            <div className="text-sm text-gray-600">{character.ausgeruestet.beschreibung}</div>
            <div className="text-xs mt-1">
              {Object.entries(character.ausgeruestet.boni).map(([key, value]) => (
                <span key={key} className="inline-block mr-2 bg-rpg-secondary bg-opacity-20 px-1 rounded">
                  {key}: +{value}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {character.zauber.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold text-rpg-primary border-b border-rpg-secondary pb-1">Zauber</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {character.zauber.map((zauber, index) => (
              <span 
                key={index} 
                className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {zauber}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterUI;
