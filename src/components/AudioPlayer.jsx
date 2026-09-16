import React, { useState } from 'react';
import { Settings, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const VIDEO_ID = '4-mgzZBxxVA';

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <>
      {/* Hidden YouTube Iframe Player */}
      <div className="fixed w-[1px] h-[1px] overflow-hidden opacity-0 pointer-events-none">
        <iframe
          key={isPlaying ? 'playing' : 'paused'}
          width="1"
          height="1"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=${isPlaying ? 1 : 0}&rel=0`}
          title="Background Music"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Floating Audio Controller */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex flex-col items-end gap-2">
          {/* Popover Menu */}
          <div
            className={`transition-all duration-300 origin-bottom-right ${
              isOpen
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }`}
          >
            <div className="bg-white/95 backdrop-blur-md border-2 border-amber-300 rounded-2xl shadow-xl p-2 min-w-[150px]">
              {/* Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-100 transition active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} />
                    <span>Pause Musik</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Putar Musik</span>
                  </>
                )}
              </button>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 text-[10px] text-slate-400">
                {isPlaying ? (
                  <>
                    <Volume2 size={12} className="text-amber-500" />
                    <span>Musik sedang diputar</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={12} />
                    <span>Musik dimatikan</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Trigger Button (Gear Icon) */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-11 h-11 flex items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-md transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-400 border-amber-300 text-slate-900 shadow-[0_4px_14px_rgba(251,191,36,0.45)]'
                : 'bg-white/95 border-white text-slate-700 hover:bg-slate-50'
            }`}
            title="Pengaturan Musik"
          >
            <Settings
              size={19}
              className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      </div>
    </>
  );
}