
import React from 'react';
import { GameProvider } from '../context/GameContext';
import StartScreen from '../components/StartScreen';
import MainUI from '../components/MainUI';
import CombatScreen from '../components/CombatScreen';
import { useGameContext } from '../context/GameContext';

// This component uses the context
const GameScreens: React.FC = () => {
  const { state } = useGameContext();
  
  switch (state.gameScreen) {
    case 'start':
      return <StartScreen />;
    case 'main':
      return <MainUI />;
    case 'combat':
      return <CombatScreen />;
    default:
      return <StartScreen />;
  }
};

// This is the wrapper that provides the context
const Index: React.FC = () => {
  return (
    <GameProvider>
      <GameScreens />
    </GameProvider>
  );
};

export default Index;
