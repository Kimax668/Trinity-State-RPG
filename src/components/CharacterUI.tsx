
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Item } from '@/types/game';
import { 
  Sword,
  Shield,
  Axe,
  Backpack
} from 'lucide-react';

const CharacterUI: React.FC = () => {
  const { state } = useGameContext();
  const { character } = state;

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'waffe':
        return <Sword className="h-4 w-4 mr-1" />;
      case 'ruestung':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'helm':
        return <Axe className="h-4 w-4 mr-1" />; // Using Axe icon for helm
      case 'accessoire':
        return <Backpack className="h-4 w-4 mr-1" />; // Using Backpack icon for accessory
      default:
        return null;
    }
  };

  const renderEquippedItem = (item: Item | null, type: string) => {
    if (!item) {
      return (
        <div className="p-2 border border-dashed border-gray-300 rounded bg-white bg-opacity-40 text-gray-400 text-center text-sm">
          {getEquipmentIcon(type)} Nichts ausgerüstet
        </div>
      );
    }

    return (
      <div className="p-2 border border-rpg-secondary rounded bg-white bg-opacity-40">
        <div className="flex items-center font-medium">
          {getEquipmentIcon(type)} {item.name}
        </div>
        <div className="text-sm text-gray-600">{item.beschreibung}</div>
        <div className="text-xs mt-1 flex flex-wrap gap-1">
          {Object.entries(item.boni).map(([key, value]) => (
            <span key={key} className="inline-block bg-rpg-secondary bg-opacity-20 px-1 rounded">
              {key}: +{value}
            </span>
          ))}
        </div>
      </div>
    );
  };

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

      <div className="mt-2">
        <h3 className="font-semibold text-rpg-primary border-b border-rpg-secondary pb-1">Ausgerüstet</h3>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {renderEquippedItem(character.ausgeruestet.waffe, 'waffe')}
          {renderEquippedItem(character.ausgeruestet.ruestung, 'ruestung')}
          {renderEquippedItem(character.ausgeruestet.helm, 'helm')}
          {renderEquippedItem(character.ausgeruestet.accessoire, 'accessoire')}
        </div>
      </div>

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
