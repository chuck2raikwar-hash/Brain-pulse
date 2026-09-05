import React, { useState, useEffect, useRef } from 'react';
import { GameType } from '../../types';
import { sounds } from '../../lib/audio';

// Import all 14 games
import { MemoryMatrix } from '../../games/MemoryMatrix';
import { ColorConfusion } from '../../games/ColorConfusion';
import { NumberRecall } from '../../games/NumberRecall';
import { NBackGame } from '../../games/NBackGame';
import { MatchingCards } from '../../games/MatchingCards';
import { RecallSequence } from '../../games/RecallSequence';
import { DistractionTask } from '../../games/DistractionTask';
import { LogicPuzzles } from '../../games/LogicPuzzles';
import { WordGames } from '../../games/WordGames';
import { PatternRecognition } from '../../games/PatternRecognition';
import { QuickReactionDrill } from '../../games/QuickReactionDrill';
import { StretchingDualTask } from '../../games/StretchingDualTask';
import { GuidedMeditation } from '../../games/GuidedMeditation';
import { BreathingPacer } from '../../games/BreathingPacer';

interface PvPGameRunnerProps {
  gameType: GameType;
  onScoreEarned: (pointsDelta: number, currentRoundAccuracy?: number) => void;
  onExitMatch: () => void;
}

export const PvPGameRunner: React.FC<PvPGameRunnerProps> = ({
  gameType,
  onScoreEarned,
  onExitMatch
}) => {
  const [roundKey, setRoundKey] = useState(0);
  const [totalRoundsCompleted, setTotalRoundsCompleted] = useState(0);

  const handleGameOver = (result: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }) => {
    // Add round points to player's PvP score
    const earnedPoints = Math.max(50, result.score || 100);
    onScoreEarned(earnedPoints, result.accuracy);
    setTotalRoundsCompleted(prev => prev + 1);

    // Auto-advance into next round seamlessly during the 2 minutes
    setTimeout(() => {
      setRoundKey(prev => prev + 1);
    }, 400);
  };

  const renderGame = () => {
    const commonProps = {
      onGameOver: handleGameOver,
      onExit: onExitMatch
    };
    const key = `pvp-round-${roundKey}`;

    switch (gameType) {
      case 'memory-matrix':
        return <MemoryMatrix key={key} {...commonProps} />;
      case 'color-confusion':
        return <ColorConfusion key={key} {...commonProps} />;
      case 'number-recall':
        return <NumberRecall key={key} {...commonProps} />;
      case 'n-back':
        return <NBackGame key={key} {...commonProps} />;
      case 'matching-cards':
        return <MatchingCards key={key} {...commonProps} />;
      case 'recall-sequence':
        return <RecallSequence key={key} {...commonProps} />;
      case 'distraction-task':
        return <DistractionTask key={key} {...commonProps} />;
      case 'logic-puzzles':
        return <LogicPuzzles key={key} {...commonProps} />;
      case 'word-games':
        return <WordGames key={key} {...commonProps} />;
      case 'pattern-recognition':
        return <PatternRecognition key={key} {...commonProps} />;
      case 'reaction-drill':
        return <QuickReactionDrill key={key} {...commonProps} />;
      case 'stretching-dual':
        return <StretchingDualTask key={key} {...commonProps} />;
      case 'guided-meditation':
        return <GuidedMeditation key={key} {...commonProps} />;
      case 'breathing-pacer':
        return <BreathingPacer key={key} {...commonProps} />;
      default:
        return <MemoryMatrix key={key} {...commonProps} />;
    }
  };

  return (
    <div className="w-full relative">
      {renderGame()}
    </div>
  );
};
