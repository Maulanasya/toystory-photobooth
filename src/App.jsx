import React from 'react';
import Photobooth from './components/Photobooth';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  return (
    <main
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-x-hidden flex flex-col items-center justify-between"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-sky-900/10 pointer-events-none" />

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        <Photobooth />
      </div>

      <AudioPlayer />
    </main>
  );
}