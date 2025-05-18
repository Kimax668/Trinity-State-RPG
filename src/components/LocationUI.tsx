import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building, Castle, MapPin } from 'lucide-react';

const LocationUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, orteDetails } = state;
  const [dialogContent, setDialogContent] = useState<{
    type: 'travel' | 'shop' | 'npc';
    title: string;
    open: boolean;
  }>({
    type: 'travel',
    title: '',
    open: false
  });

  // Calculate training costs
  const getTrainingCost = (attribute: string) => {
    const basePrice = state.trainingCosts.basis;
    const multiplier = state.trainingCosts.multiplikator;
    
    const cost = Math.floor(basePrice * (1 + ((character.level - 1) * multiplier)));
    return cost;
  };

  // Function to get location icon based on location type
  const getLocationIcon = (locationName: string) => {
    if (locationName === "Hauptstadt") {
      return <Castle className="mr-2 text-purple-600" size={18} />;
    } else if (orteDetails[locationName]?.istDorf) {
      return <Building className="mr-2 text-amber-600" size={18} />;
    } else {
      return <MapPin className="mr-2 text-green-600" size={18} />;
    }
  };

  // Function to get location button class based on location type
  const getLocationButtonClass = (locationName: string) => {
    if (locationName === "Hauptstadt") {
      // Special styling for capital city
      return "rpg-button bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-2 border-yellow-400 shadow-md";
    } else if (orteDetails[locationName]?.istDorf) {
      // Styling for villages
      return "rpg-button bg-gradient-to-r from-amber-500 to-amber-700";
    } else {
      // Default styling for other locations
      return "rpg-button bg-gradient-to-r from-green-600 to-green-800";
    }
  };

  const handleTravel = (location: string) => {
    dispatch({ type: 'TRAVEL_TO', location });
    setDialogContent(prev => ({ ...prev, open: false }));
  };

  const handleTravelClick = () => {
    setDialogContent({
      type: 'travel',
      title: 'Reisen',
      open: true
    });
  };

  const handleShopClick = () => {
    setDialogContent({
      type: 'shop',
      title: 'Shop',
      open: true
    });
  };

  const handleNpcClick = () => {
    setDialogContent({
      type: 'npc',
      title: 'NPCs',
      open: true
    });
  };

  const handleBuyItem = (item: any) => {
    dispatch({ type: 'BUY_ITEM', item });
  };
  
  const handleSellItem = (itemIndex: number, npc: string) => {
    dispatch({ type: 'SELL_ITEM', itemIndex, npc });
  };

  const handleLearnSpell = (spell: string) => {
    dispatch({ type: 'LEARN_SPELL', spell });
  };

  const handleTakeQuest = (quest: any, npc: string) => {
    dispatch({ type: 'TAKE_QUEST', quest, npc });
  };
  
  const handleCompleteQuest = (questIndex: number, npc: string) => {
    dispatch({ type: 'COMPLETE_QUEST', questIndex, npc });
  };

  // Get available spells based on character level
  const getAvailableSpells = () => {
    const allSpells = Object.entries(state.zauberDefinitionen)
      .filter(([_, spell]) => !character.zauber.includes(_.toString()))
      .filter(([_, spell]) => !spell.minLevel || character.level >= spell.minLevel)
      .map(([name, _]) => name);
    
    return allSpells;
  };

  // Get NPCs for current location
  const locationNpcs = Object.values(state.npcs).filter(
    npc => npc.ort === character.aktueller_ort
  );

  // Get discoverable locations the character can travel to
  const availableLocations = Object.entries(orteDetails)
    .filter(([name, location]) => location.entdeckt)
    .map(([name, _]) => name);

  // Check if location is a settlement (city or village)
  const isSettlement = orteDetails[character.aktueller_ort]?.istDorf === true || 
                      character.aktueller_ort === "Hauptstadt";

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">{character.aktueller_ort}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="location-description parchment p-4">
          {orteDetails[character.aktueller_ort]?.beschreibung || (
            <p>Eine interessante Gegend mit vielen Möglichkeiten.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button className="rpg-button" onClick={handleTravelClick}>
            Reisen
          </Button>
          
          {isSettlement && (
            <>
              <Button className="rpg-button" onClick={handleShopClick}>
                Shop
              </Button>
              <Button className="rpg-button" onClick={handleNpcClick}>
                NPCs
              </Button>
            </>
          )}
          
          {!isSettlement && (
            <Button 
              className="rpg-button bg-red-700 hover:bg-red-800" 
              onClick={() => {
                // Generate a random monster for this location
                const possibleMonsters = state.monsters[character.aktueller_ort] || [];
                if (possibleMonsters.length > 0) {
                  const monster = { ...possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)] };
                  
                  // Apply level adjustment if location has monster level
                  if (orteDetails[character.aktueller_ort]?.monsterLevel) {
                    const level = orteDetails[character.aktueller_ort].monsterLevel;
                    monster.level = level;
                    monster.max_hp += (level - 1) * 10;
                    monster.hp = monster.max_hp;
                    monster.staerke += Math.floor((level - 1) * 1.5);
                    monster.verteidigung = monster.verteidigung || Math.floor(monster.staerke * 0.2);
                    monster.verteidigung += Math.floor((level - 1) * 0.5);
                    monster.xp += (level - 1) * 5;
                  }
                  
                  dispatch({ type: 'START_COMBAT', monster });
                }
              }}
            >
              Erkunden
            </Button>
          )}
        </div>
      </div>

      {/* Dialog for different actions */}
      <Dialog 
        open={dialogContent.open}
        onOpenChange={(open) => setDialogContent(prev => ({ ...prev, open }))}
      >
        <DialogContent className="parchment max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
          </DialogHeader>
          
          {dialogContent.type === 'travel' && (
            <div>
              <ScrollArea className="h-[60vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pr-4">
                  {state.orte.map(ort => {
                    const isCapital = ort === "Hauptstadt";
                    const isSettlement = orteDetails[ort]?.istDorf === true || isCapital;
                    const isCurrentLocation = ort === character.aktueller_ort;
                    const isDiscovered = orteDetails[ort]?.entdeckt;
                    
                    if (!isDiscovered) return null;
                    
                    return (
                      <Button
                        key={ort}
                        className={`
                          ${getLocationButtonClass(ort)} 
                          ${isCurrentLocation ? 'opacity-50 cursor-not-allowed' : ''}
                          transition-all duration-300
                        `}
                        disabled={isCurrentLocation}
                        onClick={() => handleTravel(ort)}
                      >
                        <div className="flex items-center justify-center">
                          {getLocationIcon(ort)}
                          <span>{ort}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {dialogContent.type === 'shop' && (
            <Tabs defaultValue="buy">
              <TabsList className="w-full">
                <TabsTrigger value="buy" className="flex-1">Kaufen</TabsTrigger>
                <TabsTrigger value="sell" className="flex-1">Verkaufen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy">
                <div className="space-y-4">
                  <p>Verfügbare Items im Shop:</p>
                  
                  <ScrollArea className="h-[60vh]">
                    <div className="grid gap-3 pr-4">
                      {Object.values(state.items)
                        .filter(item => !item.minLevel || character.level >= item.minLevel)
                        .map((item, index) => (
                        <Card key={index} className="bg-white bg-opacity-80">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.beschreibung}</p>
                                {item.minLevel && (
                                  <p className="text-xs text-blue-600">Benötigt Level {item.minLevel}</p>
                                )}
                                <div className="text-xs mt-1">
                                  {Object.entries(item.boni).map(([key, value]) => (
                                    <span key={key} className="inline-block mr-2 bg-gray-100 px-1 rounded">
                                      {key}: +{value}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="text-yellow-600 font-semibold">{item.preis} Gold</span>
                                <Button 
                                  className="rpg-button text-sm py-1 px-2"
                                  onClick={() => handleBuyItem(item)}
                                  disabled={character.gold < item.preis || (item.minLevel && character.level < item.minLevel)}
                                >
                                  Kaufen
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="sell">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p>Dein Inventar:</p>
                    <p className="text-yellow-600 font-semibold">Gold: {character.gold}</p>
                  </div>
                  
                  <ScrollArea className="h-[60vh]">
                    <div className="grid gap-3 pr-4">
                      {character.inventar.length > 0 ? (
                        character.inventar.map((item, index) => {
                          // Calculate sell price
                          const sellPrice = item.verkaufspreis || Math.floor(item.preis * 0.5);
                          
                          // Check if item is equipped
                          const isEquipped = 
                            character.ausgeruestet.waffe === item ||
                            character.ausgeruestet.ruestung === item ||
                            character.ausgeruestet.helm === item ||
                            character.ausgeruestet.accessoire === item;
                          
                          return (
                            <Card key={index} className={`bg-white bg-opacity-80 ${isEquipped ? 'border-2 border-blue-400' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-semibold">
                                      {item.name}
                                      {isEquipped && <span className="text-xs text-blue-600 ml-2">(Ausgerüstet)</span>}
                                    </h3>
                                    <p className="text-sm text-gray-600">{item.beschreibung}</p>
                                    <div className="text-xs mt-1">
                                      {Object.entries(item.boni).map(([key, value]) => (
                                        <span key={key} className="inline-block mr-2 bg-gray-100 px-1 rounded">
                                          {key}: +{value}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <span className="text-yellow-600 font-semibold">{sellPrice} Gold</span>
                                    <div className="flex gap-1">
                                      {locationNpcs.map((npc, npcIdx) => {
                                        // Check if NPC buys this type of item
                                        const buysItem = npc.kauft && 
                                          (npc.kauft.includes(item.typ) || npc.kauft.includes('*'));
                                        
                                        return buysItem ? (
                                          <Button 
                                            key={npcIdx}
                                            className="rpg-button text-xs py-0.5 px-1"
                                            onClick={() => handleSellItem(index, npc.name)}
                                            disabled={isEquipped}
                                            title={isEquipped ? "Ausgerüstete Items können nicht verkauft werden" : ""}
                                          >
                                            An {npc.name.split(' ')[0]} verkaufen
                                          </Button>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <p className="text-center italic">Dein Inventar ist leer</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {dialogContent.type === 'npc' && (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4 pr-4">
                {locationNpcs.length > 0 ? (
                  locationNpcs.map((npc, index) => (
                    <Card key={index} className="bg-white bg-opacity-80">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{npc.name}</h3>
                        <p className="italic mb-2">"{npc.dialog.gruss}"</p>
                        
                        <Tabs defaultValue="talk">
                          <TabsList className="w-full">
                            <TabsTrigger value="talk" className="flex-1">Gespräch</TabsTrigger>
                            <TabsTrigger value="trade" className="flex-1">Handel</TabsTrigger>
                            <TabsTrigger value="quests" className="flex-1">Quests</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="talk" className="p-2">
                            <p>"{npc.dialog.handel}"</p>
                          </TabsContent>
                          
                          <TabsContent value="trade">
                            <div className="space-y-2 pt-2">
                              {npc.handel.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b pb-2">
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-600">{item.beschreibung}</div>
                                    {item.minLevel && (
                                      <div className="text-xs text-blue-600">Benötigt Level {item.minLevel}</div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-600 font-semibold">{item.preis}</span>
                                    <Button 
                                      size="sm"
                                      className="rpg-button text-sm py-1"
                                      onClick={() => handleBuyItem(item)}
                                      disabled={character.gold < item.preis || (item.minLevel && character.level < item.minLevel)}
                                    >
                                      Kaufen
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="quests">
                            <div className="space-y-4 py-2">
                              <div className="font-medium mb-2">Verfügbare Quests:</div>
                              
                              {/* Available quests from this NPC */}
                              {state.quests
                                .filter(quest => !character.quest_log.some(q => q.name === quest.name))
                                .map((quest, idx) => (
                                  <div key={idx} className="border-b pb-3">
                                    <div className="font-medium">{quest.name}</div>
                                    <div className="text-sm text-gray-600 mb-2">{quest.beschreibung}</div>
                                    <div className="text-xs flex justify-between mb-1">
                                      <span>Belohnungen:</span>
                                      <span>{quest.belohnung_gold} Gold, {quest.belohnung_xp} XP</span>
                                    </div>
                                    {quest.belohnung_item && (
                                      <div className="text-xs flex justify-between mb-2">
                                        <span>Item:</span>
                                        <span>{quest.belohnung_item.name}</span>
                                      </div>
                                    )}
                                    <Button 
                                      size="sm" 
                                      className="rpg-button w-full mt-1" 
                                      onClick={() => handleTakeQuest(quest, npc.name)}
                                    >
                                      Quest annehmen
                                    </Button>
                                  </div>
                                ))
                              }
                              
                              {/* Completed quests that can be turned in to this NPC */}
                              <div className="font-medium mb-2 mt-4">Abgeschlossene Quests:</div>
                              {character.quest_log
                                .filter(quest => quest.abgeschlossen && quest.npc_empfaenger === npc.name)
                                .map((quest, idx) => {
                                  const questIndex = character.quest_log.findIndex(q => q.name === quest.name);
                                  
                                  return (
                                    <div key={idx} className="border-b pb-3">
                                      <div className="font-medium">{quest.name}</div>
                                      <div className="text-sm text-gray-600 mb-2">{quest.beschreibung}</div>
                                      <div className="text-xs flex justify-between mb-1">
                                        <span>Belohnungen:</span>
                                        <span>{quest.belohnung_gold} Gold, {quest.belohnung_xp} XP</span>
                                      </div>
                                      {quest.belohnung_item && (
                                        <div className="text-xs flex justify-between mb-2">
                                          <span>Item:</span>
                                          <span>{quest.belohnung_item.name}</span>
                                        </div>
                                      )}
                                      <Button 
                                        size="sm" 
                                        className="rpg-button w-full mt-1 bg-green-600 hover:bg-green-700" 
                                        onClick={() => handleCompleteQuest(questIndex, npc.name)}
                                      >
                                        Belohnung abholen
                                      </Button>
                                    </div>
                                  );
                                })
                              }
                              
                              {/* Active quests from this NPC */}
                              <div className="font-medium mb-2 mt-4">Aktive Quests:</div>
                              {character.quest_log
                                .filter(quest => !quest.abgeschlossen && quest.npc_geber === npc.name)
                                .map((quest, idx) => (
                                  <div key={idx} className="border-b pb-3">
                                    <div className="font-medium">{quest.name}</div>
                                    <div className="text-sm text-gray-600 mb-2">{quest.beschreibung}</div>
                                    <div className="text-xs flex justify-between mb-1">
                                      <span>Fortschritt:</span>
                                      <span>{quest.aktuelle_anzahl}/{quest.ziel_anzahl}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                      <div 
                                        className="bg-green-600 h-1.5 rounded-full" 
                                        style={{ width: `${(quest.aktuelle_anzahl / quest.ziel_anzahl) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                ))
                              }
                              
                              {/* No quests message */}
                              {!state.quests.some(quest => !character.quest_log.some(q => q.name === quest.name)) && 
                               !character.quest_log.some(quest => quest.npc_geber === npc.name || 
                                                       (quest.abgeschlossen && quest.npc_empfaenger === npc.name)) && (
                                <div className="text-center italic">
                                  {npc.name} hat derzeit keine Quests für dich.
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center italic">Keine NPCs an diesem Ort verfügbar</p>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationUI;
