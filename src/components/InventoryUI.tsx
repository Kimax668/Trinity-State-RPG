
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Item } from '@/types/game';

const InventoryUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleUseItem = (index: number) => {
    const item = character.inventar[index];
    
    if (item.typ === "verbrauchbar") {
      dispatch({ type: 'USE_INVENTORY_ITEM', itemIndex: index });
    } else if (["waffe", "ruestung", "helm", "accessoire"].includes(item.typ)) {
      dispatch({ type: 'EQUIP_ITEM', item });
    }
    
    setSelectedItemIndex(null);
  };

  const handleDropItem = (index: number) => {
    dispatch({ type: 'DROP_ITEM', itemIndex: index });
    setSelectedItemIndex(null);
  };

  const isItemEquipped = (item: Item): boolean => {
    const { ausgeruestet } = character;
    return (
      ausgeruestet.waffe === item ||
      ausgeruestet.ruestung === item ||
      ausgeruestet.helm === item ||
      ausgeruestet.accessoire === item
    );
  };

  const getItemTypeLabel = (type: string): string => {
    switch(type) {
      case "waffe": return "Waffe";
      case "ruestung": return "Rüstung";
      case "helm": return "Helm";
      case "accessoire": return "Accessoire";
      case "verbrauchbar": return "Verbrauchbar";
      default: return type;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 border-b-2 border-rpg-secondary pb-1">Inventar</h2>
      
      {character.inventar.length === 0 ? (
        <div className="text-gray-500 italic text-center py-4">
          Dein Inventar ist leer
        </div>
      ) : (
        <div className="grid gap-2 mt-2">
          {character.inventar.map((item, index) => (
            <div 
              key={index}
              className={`border rounded p-2 cursor-pointer hover:bg-white hover:bg-opacity-50 transition-all 
                ${isItemEquipped(item) ? 'border-rpg-primary bg-rpg-secondary bg-opacity-10' : 'border-gray-300'}`}
              onClick={() => setSelectedItemIndex(index)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-1">
                  <span className="text-xs bg-gray-200 text-gray-700 px-1 rounded">
                    {getItemTypeLabel(item.typ)}
                  </span>
                  {isItemEquipped(item) && (
                    <span className="text-xs bg-rpg-primary text-white px-1 rounded">Ausgerüstet</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600">{item.beschreibung}</div>
            </div>
          ))}
        </div>
      )}

      {/* Item Action Dialog */}
      {selectedItemIndex !== null && (
        <Dialog open={selectedItemIndex !== null} onOpenChange={() => setSelectedItemIndex(null)}>
          <DialogContent className="parchment">
            <DialogHeader>
              <DialogTitle>{character.inventar[selectedItemIndex]?.name}</DialogTitle>
              <DialogDescription>
                {character.inventar[selectedItemIndex]?.beschreibung}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-2">
              {Object.entries(character.inventar[selectedItemIndex]?.boni || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium">{key}:</span>
                  <span>+{value}</span>
                </div>
              ))}
              
              {character.inventar[selectedItemIndex]?.faehigkeit && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Fähigkeit:</span>
                  <span>{character.inventar[selectedItemIndex]?.faehigkeit}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="font-medium">Typ:</span>
                <span>{getItemTypeLabel(character.inventar[selectedItemIndex]?.typ)}</span>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                onClick={() => handleUseItem(selectedItemIndex)}
                className="rpg-button"
                disabled={character.inventar[selectedItemIndex]?.typ === "material"}
              >
                {character.inventar[selectedItemIndex]?.typ === "verbrauchbar" ? "Benutzen" : "Ausrüsten"}
              </Button>
              <Button 
                onClick={() => handleDropItem(selectedItemIndex)}
                variant="destructive"
              >
                Wegwerfen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InventoryUI;
