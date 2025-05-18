
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Brain, Shield, Sparkles } from 'lucide-react';

const TrainingUI: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const { character, trainingCosts } = state;

  // Stelle sicher, dass attributeTrainingCount initialisiert ist
  const trainingCount = character.attributeTrainingCount || {
    staerke: 0,
    intelligenz: 0,
    ausweichen: 0,
    verteidigung: 0,
    mana: 0
  };

  // Berechne Trainingskosten basierend auf Level und Anzahl der Trainings
  const calculateCost = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana') => {
    const count = trainingCount[attribute] || 0;
    const baseCost = trainingCosts.basis;
    const multiplier = trainingCosts.multiplikator;
    
    // Basiskosten skaliert nach Level
    const levelCost = Math.floor(baseCost * (1 + ((character.level - 1) * multiplier)));
    
    // Zusätzliche Kostenerhöhung basierend darauf, wie oft dieses Attribut trainiert wurde
    const trainingMultiplier = 1 + (count * 0.25); // +25% pro Training
    
    return Math.floor(levelCost * trainingMultiplier);
  };

  const handleTraining = (attribute: 'staerke' | 'intelligenz' | 'ausweichen' | 'verteidigung' | 'mana') => {
    dispatch({ type: 'TRAIN_ATTRIBUTE', attribute });
  };

  return (
    <Card className="training-card mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Training</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex justify-between items-center p-2 border rounded">
            <div className="flex items-center">
              <Swords size={18} className="mr-2" />
              <span>Stärke trainieren</span>
            </div>
            <Button 
              onClick={() => handleTraining('staerke')}
              variant="outline" 
              className="flex items-center"
              disabled={character.gold < calculateCost('staerke')}
            >
              <span className="mr-1">{calculateCost('staerke')}</span>
              <span className="text-yellow-500">Gold</span>
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-2 border rounded">
            <div className="flex items-center">
              <Brain size={18} className="mr-2" />
              <span>Intelligenz trainieren</span>
            </div>
            <Button 
              onClick={() => handleTraining('intelligenz')}
              variant="outline" 
              className="flex items-center"
              disabled={character.gold < calculateCost('intelligenz')}
            >
              <span className="mr-1">{calculateCost('intelligenz')}</span>
              <span className="text-yellow-500">Gold</span>
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-2 border rounded">
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span>Ausweichen trainieren</span>
            </div>
            <Button 
              onClick={() => handleTraining('ausweichen')}
              variant="outline" 
              className="flex items-center"
              disabled={character.gold < calculateCost('ausweichen')}
            >
              <span className="mr-1">{calculateCost('ausweichen')}</span>
              <span className="text-yellow-500">Gold</span>
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-2 border rounded">
            <div className="flex items-center">
              <Shield size={18} className="mr-2" />
              <span>Verteidigung trainieren</span>
            </div>
            <Button 
              onClick={() => handleTraining('verteidigung')}
              variant="outline" 
              className="flex items-center"
              disabled={character.gold < calculateCost('verteidigung')}
            >
              <span className="mr-1">{calculateCost('verteidigung')}</span>
              <span className="text-yellow-500">Gold</span>
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-2 border rounded col-span-1 md:col-span-2 bg-blue-50">
            <div className="flex items-center">
              <Sparkles size={18} className="mr-2 text-blue-500" />
              <span>Mana trainieren (+5)</span>
            </div>
            <Button 
              onClick={() => handleTraining('mana')}
              variant="outline" 
              className="flex items-center"
              disabled={character.gold < calculateCost('mana')}
            >
              <span className="mr-1">{calculateCost('mana')}</span>
              <span className="text-yellow-500">Gold</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingUI;
