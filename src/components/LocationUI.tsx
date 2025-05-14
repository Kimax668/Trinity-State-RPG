
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

const LocationUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, orte } = state;
  const [dialogContent, setDialogContent] = useState<{
    type: 'travel' | 'shop' | 'training' | 'npc';
    title: string;
    open: boolean;
  }>({
    type: 'travel',
    title: '',
    open: false
  });

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

  const handleTrainingClick = () => {
    setDialogContent({
      type: 'training',
      title: 'Training',
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

  const handleTrainAttribute = (attribute: 'staerke' | 'intelligenz' | 'ausweichen') => {
    dispatch({ type: 'TRAIN_ATTRIBUTE', attribute });
  };

  const handleLearnSpell = (spell: string) => {
    dispatch({ type: 'LEARN_SPELL', spell });
  };

  const getAvailableSpells = () => {
    const allSpells = ["Feuerball", "Eisstrahl", "Heilung", "Blitz"];
    return allSpells.filter(spell => !character.zauber.includes(spell));
  };

  // Get NPCs for current location
  const locationNpcs = Object.values(state.npcs).filter(
    npc => npc.ort === character.aktueller_ort
  );

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">{character.aktueller_ort}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="location-description parchment p-4">
          {character.aktueller_ort === 'Stadt' ? (
            <p>
              Die Stadt ist ein geschäftiger Ort mit vielen Händlern, einer Akademie für Training 
              und verschiedenen NPCs, mit denen du interagieren kannst.
            </p>
          ) : character.aktueller_ort === 'Wald' ? (
            <p>
              Der Wald ist dicht und voller Leben. Du könntest hier auf Goblins, Wölfe, Banditen 
              und Waldspinnen treffen.
            </p>
          ) : character.aktueller_ort === 'Berge' ? (
            <p>
              Die Berge sind rau und gefährlich. Hier leben Bergtrolle, Harpyien und Steingolems.
            </p>
          ) : character.aktueller_ort === 'See' ? (
            <p>
              Der See ist ruhig und schön, aber unter der Oberfläche lauern Wassernixen, Seeschlangen 
              und sogar ein riesiger Krake.
            </p>
          ) : character.aktueller_ort === 'Höhle' ? (
            <p>
              Die Höhle ist dunkel und feucht. Hier leben Fledermäuse, Höhlentrolle und große Höhlenspinnen.
            </p>
          ) : (
            <p>
              Die Wüste ist heiß und unwirtlich. Hier findest du Skorpione, Sandwürmer und uralte Mumien.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button className="rpg-button" onClick={handleTravelClick}>
            Reisen
          </Button>
          
          {character.aktueller_ort === 'Stadt' && (
            <>
              <Button className="rpg-button" onClick={handleShopClick}>
                Shop
              </Button>
              <Button className="rpg-button" onClick={handleTrainingClick}>
                Training
              </Button>
              <Button className="rpg-button" onClick={handleNpcClick}>
                NPCs
              </Button>
            </>
          )}
          
          {character.aktueller_ort !== 'Stadt' && (
            <Button 
              className="rpg-button bg-red-700 hover:bg-red-800" 
              onClick={() => {
                // Generate a random monster for this location
                const possibleMonsters = state.monsters[character.aktueller_ort] || [];
                if (possibleMonsters.length > 0) {
                  const monster = { ...possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)] };
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {orte.map(ort => (
                <Button
                  key={ort}
                  className={`rpg-button ${ort === character.aktueller_ort ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={ort === character.aktueller_ort}
                  onClick={() => handleTravel(ort)}
                >
                  {ort}
                </Button>
              ))}
            </div>
          )}
          
          {dialogContent.type === 'shop' && (
            <div className="space-y-4">
              <p>Verfügbare Items im Shop:</p>
              
              <ScrollArea className="h-[60vh]">
                <div className="grid gap-3 pr-4">
                  {Object.values(state.items).map((item, index) => (
                    <Card key={index} className="bg-white bg-opacity-80">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
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
                            <span className="text-yellow-600 font-semibold">{item.preis} Gold</span>
                            <Button 
                              className="rpg-button text-sm py-1 px-2"
                              onClick={() => handleBuyItem(item)}
                              disabled={character.gold < item.preis}
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
          )}
          
          {dialogContent.type === 'training' && (
            <Tabs defaultValue="attributes">
              <TabsList className="w-full">
                <TabsTrigger value="attributes" className="flex-1">Attribute</TabsTrigger>
                <TabsTrigger value="spells" className="flex-1">Zauber</TabsTrigger>
              </TabsList>
              
              <TabsContent value="attributes">
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Dein Gold:</span>
                    <span className="text-yellow-600 font-semibold">{character.gold}</span>
                  </div>
                  
                  <div className="grid gap-3">
                    <Card>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Stärke</h3>
                          <p className="text-sm">Aktuell: {character.staerke}</p>
                        </div>
                        <Button 
                          className="rpg-button" 
                          onClick={() => handleTrainAttribute('staerke')}
                          disabled={character.gold < 20}
                        >
                          Trainieren (20 Gold)
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Intelligenz</h3>
                          <p className="text-sm">Aktuell: {character.intelligenz}</p>
                        </div>
                        <Button 
                          className="rpg-button" 
                          onClick={() => handleTrainAttribute('intelligenz')}
                          disabled={character.gold < 20}
                        >
                          Trainieren (20 Gold)
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Ausweichen</h3>
                          <p className="text-sm">Aktuell: {character.ausweichen}%</p>
                        </div>
                        <Button 
                          className="rpg-button" 
                          onClick={() => handleTrainAttribute('ausweichen')}
                          disabled={character.gold < 20}
                        >
                          Trainieren (20 Gold)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="spells">
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-4 py-4 pr-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Dein Gold:</span>
                      <span className="text-yellow-600 font-semibold">{character.gold}</span>
                    </div>
                    
                    <div className="grid gap-3">
                      {getAvailableSpells().length > 0 ? (
                        getAvailableSpells().map((spell, index) => (
                          <Card key={index}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{spell}</h3>
                                <p className="text-sm text-gray-600">
                                  Ein mächtiger Zauber, der {
                                    spell === "Feuerball" ? "Feuerschaden verursacht" :
                                    spell === "Eisstrahl" ? "Gegner einfriert" :
                                    spell === "Heilung" ? "deine Gesundheit regeneriert" :
                                    "Blitzschaden verursacht"
                                  }
                                </p>
                              </div>
                              <Button 
                                className="rpg-button" 
                                onClick={() => handleLearnSpell(spell)}
                                disabled={character.gold < 50}
                              >
                                Lernen (50 Gold)
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center italic">Du kennst bereits alle verfügbaren Zauber</p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
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
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-600 font-semibold">{item.preis}</span>
                                    <Button 
                                      size="sm"
                                      className="rpg-button text-sm py-1"
                                      onClick={() => handleBuyItem(item)}
                                      disabled={character.gold < item.preis}
                                    >
                                      Kaufen
                                    </Button>
                                  </div>
                                </div>
                              ))}
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

