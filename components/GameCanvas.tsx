'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

export default function GameWrapper() {
  const [isPhaserLoaded, setIsPhaserLoaded] = useState(false);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    let game: any;
    
    const initPhaser = async () => {
      // Dynamic import to avoid SSR issues
      const Phaser = (await import('phaser')).default;
      const { default: gameConfig } = await import('../game/config');
      
      if (!gameRef.current) {
        game = new Phaser.Game(gameConfig);
        gameRef.current = game;
      }
      setIsPhaserLoaded(true);
    };

    initPhaser();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div id="game-container" className="w-full h-screen overflow-hidden bg-black flex justify-center items-center">
      {!isPhaserLoaded && (
        <div className="text-white text-2xl font-bold font-sans">
          Loading Game...
        </div>
      )}
    </div>
  );
}
