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
      <div 
        className="w-full h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-white"
        style={{
          backgroundImage: "url('/assets/campus_road.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <div className="z-10 flex flex-col items-center w-full max-w-sm px-4 text-center">
          <h2 className="text-4xl font-black mb-6 text-[#44ff44] drop-shadow-md">HOW TO PLAY</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-md w-full">
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-2xl mb-1">↑</span>
              <span className="font-bold">SWIPE UP</span>
              <span className="text-gray-300 text-xs">Jump</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-2xl mb-1">↓</span>
              <span className="font-bold">SWIPE DOWN</span>
              <span className="text-gray-300 text-xs">Duck</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl col-span-2 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl mb-1">← →</span>
              <span className="font-bold">SWIPE LEFT/RIGHT</span>
              <span className="text-gray-300 text-xs">Change lanes</span>
            </div>
          </div>
          
          <ul className="text-left space-y-2 mb-8 text-gray-200 w-full text-sm font-medium bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <li>📚 Collect knowledge for GPA</li>
            <li>⚠️ Avoid failed exams</li>
            <li>☕ Drink coffee for speed</li>
          </ul>

          <button 
            onClick={() => setGameState('playing')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-full text-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.6)] transform hover:scale-105 active:scale-95 border border-white/20"
          >
            START RUNNING
          </button>
          
          <button 
            onClick={() => setGameState('start')}
            className="mt-4 text-gray-400 hover:text-white font-bold"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden font-sans"
      style={{
        backgroundImage: "url('/assets/campus_road.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      <div className="z-10 flex flex-col items-center w-full max-w-sm px-4">
        <h1 className="text-5xl font-black text-white mb-1 tracking-tight text-center drop-shadow-2xl">
          LOMASHA
          <span className="block text-2xl text-[#44ff44] mt-1 drop-shadow-lg">THE GPA RUN</span>
        </h1>
        
        <p className="text-gray-200 text-lg mb-6 italic drop-shadow-lg">"Run. Study. Panic. Repeat."</p>

        <div className="relative w-48 h-48 mb-8 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] backdrop-blur-md border border-white/20">
          <Image 
            src="/assets/character/lomasha-run1.png" 
            alt="Lomasha" 
            width={130} 
            height={130} 
            className="drop-shadow-2xl object-contain"
          />
        </div>

        <button 
          onClick={() => setGameState('playing')}
          className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-full text-xl mb-3 transition-all shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:scale-105 active:scale-95 border-2 border-white/20"
        >
          PLAY NOW
        </button>

        <button 
          onClick={() => setGameState('tutorial')}
          className="w-full max-w-xs bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-full text-md transition-all backdrop-blur-md border border-white/10"
        >
          HOW TO PLAY
        </button>
      </div>
    </div>
  );
}
