'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'tutorial'>('start');

  if (gameState === 'playing') {
    return (
      <div className="w-full h-screen relative bg-black">
        <GameCanvas />
        <button 
          onClick={() => setGameState('start')}
          className="absolute top-4 right-4 z-50 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm"
        >
          Quit
        </button>
      </div>
    );
  }

  if (gameState === 'tutorial') {
    return (
      <div className="w-full h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <h2 className="text-3xl font-bold mb-8">HOW TO PLAY</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8 text-lg w-full max-w-sm">
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl">
            <span className="text-2xl mb-2">↑</span>
            <span>SWIPE UP</span>
            <span className="text-gray-400 text-sm">Jump</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl">
            <span className="text-2xl mb-2">↓</span>
            <span>SWIPE DOWN</span>
            <span className="text-gray-400 text-sm">Duck</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl col-span-2">
            <span className="text-2xl mb-2">← →</span>
            <span>SWIPE LEFT/RIGHT</span>
            <span className="text-gray-400 text-sm">Change lanes</span>
          </div>
        </div>
        
        <ul className="text-left space-y-3 mb-10 text-gray-300 w-full max-w-sm">
          <li>📚 Collect knowledge to increase GPA</li>
          <li>⚠️ Avoid law-school problems</li>
          <li>☕ Drink coffee for speed</li>
          <li>🎓 Survive the final exam</li>
        </ul>

        <button 
          onClick={() => setGameState('playing')}
          className="w-full max-w-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full text-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          START RUNNING
        </button>
        
        <button 
          onClick={() => setGameState('start')}
          className="mt-6 text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans"
      style={{
        backgroundImage: "url('/assets/campus_road.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-6xl font-black text-white mb-2 tracking-tight text-center drop-shadow-2xl">
          LOMASHA
          <span className="block text-3xl text-[#44ff44] mt-1 drop-shadow-lg">THE GPA RUN</span>
        </h1>
        
        <p className="text-gray-200 text-xl mb-12 italic drop-shadow-lg">"Run. Study. Panic. Repeat."</p>

        <div className="relative w-56 h-56 mb-12 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] backdrop-blur-md border border-white/20">
          <Image 
            src="/assets/character/lomasha-run1.png" 
            alt="Lomasha" 
            width={160} 
            height={160} 
            className="drop-shadow-2xl object-contain"
          />
        </div>

        <button 
          onClick={() => setGameState('playing')}
          className="w-72 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-full text-2xl mb-4 transition-all shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:scale-105 active:scale-95 border-2 border-white/20"
        >
          PLAY NOW
        </button>

        <button 
          onClick={() => setGameState('tutorial')}
          className="w-72 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-full text-lg transition-all backdrop-blur-md border border-white/10"
        >
          HOW TO PLAY
        </button>
      </div>
    </div>
  );
}
