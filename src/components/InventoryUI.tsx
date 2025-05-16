
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InventoryUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character } = state;
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleUseItem = (index: number) => {
    const item = character.inventar[index];
    
    if (item.typ === "verbrauchbar") {
      dispatch({ type: 'USE_INVENTORY_ITEM', itemIndex: index });
    } else if (["waffe", "ruestung", "helm", "accessoire"].includes(item.typ)) {
      dispatch({ type: 'EQUIP_ITEM', item, itemIndex: index });
    }
    
    setSelectedItemIndex(null);
  };

  const handleDropItem = (index: number) => {
    dispatch({ type: 'DROP_ITEM', itemIndex: index });
    setSelectedItemIndex(null);
  };

  const handleSellItem = (index: number, npcName: string) => {
    dispatch({ type: 'SELL_ITEM', itemIndex: index, npc: npcName });
    setSelectedItemIndex(null);
  };

  const isItemEquipped = (item: Item, index: number): boolean => {
    const { ausgeruestet } = character;
    
    // Compare by item reference from inventory rather than by name
    if (ausgeruestet.waffe && ausgeruestet.waffe.id === item.id) return true;
    if (ausgeruestet.ruestung && ausgeruestet.ruestung.id === item.id) return true;
    if (ausgeruestet.helm && ausgeruestet.helm.id === item.id) return true;
    if (ausgeruestet.accessoire && ausgeruestet.accessoire.id === item.id) return true;
    
    return false;
  };

  // Get NPCs that can buy items from current location
  const buyingNpcs = Object.values(state.npcs).filter(
    npc => npc.ort === character.aktueller_ort && npc.kauft && npc.kauft.length > 0
  );

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

  const canSellItem = (item: Item, index: number): boolean => {
    if (isItemEquipped(item, index)) return false;
    if (item.verkaufbar === false) return false;
    
    // Check if any NPC at current location buys this type of item
    return buyingNpcs.some(npc => 
      npc.kauft && (npc.kauft.includes(item.typ) || npc.kauft.includes('*'))
    );
  };

  const calculateSellPrice = (item: Item): number => {
    return item.verkaufspreis || Math.floor(item.preis * 0.5); // Default to 50% of purchase price
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
                ${isItemEquipped(item, index) ? 'border-rpg-primary bg-rpg-secondary bg-opacity-10' : 'border-gray-300'}`}
              onClick={() => setSelectedItemIndex(index)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-1">
                  <span className="text-xs bg-gray-200 text-gray-700 px-1 rounded">
                    {getItemTypeLabel(item.typ)}
                  </span>
                  {isItemEquipped(item, index) && (
                    <span className="text-xs bg-rpg-primary text-white px-1 rounded">Ausgerüstet</span>
                  )}
                  {item.statusEffekt && (
                    <span className="text-xs bg-purple-200 text-purple-800 px-1 rounded">{item.statusEffekt}</span>
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
            
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                {canSellItem(character.inventar[selectedItemIndex], selectedItemIndex) && (
                  <TabsTrigger value="sell">Verkaufen</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="details" className="py-4 space-y-2">
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

                {character.inventar[selectedItemIndex]?.statusEffekt && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Status Effekt:</span>
                    <span>{character.inventar[selectedItemIndex]?.statusEffekt} ({character.inventar[selectedItemIndex]?.statusDauer} Runden)</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Typ:</span>
                  <span>{getItemTypeLabel(character.inventar[selectedItemIndex]?.typ)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-medium">Wert:</span>
                  <span>{character.inventar[selectedItemIndex]?.preis} Gold</span>
                </div>
                
                {character.inventar[selectedItemIndex]?.minLevel && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Min. Level:</span>
                    <span>{character.inventar[selectedItemIndex]?.minLevel}</span>
                  </div>
                )}
              </TabsContent>
              
              {canSellItem(character.inventar[selectedItemIndex], selectedItemIndex) && (
                <TabsContent value="sell" className="py-4 space-y-4">
                  <div className="text-center mb-2">
                    <div className="font-medium">Verkaufspreis:</div>
                    <div className="text-xl text-yellow-600">{calculateSellPrice(character.inventar[selectedItemIndex])} Gold</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Verkaufen an:</div>
                    {buyingNpcs.map((npc, idx) => (
                      <Button 
                        key={idx} 
                        className="w-full" 
                        onClick={() => handleSellItem(selectedItemIndex, npc.name)}
                      >
                        {npc.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
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
