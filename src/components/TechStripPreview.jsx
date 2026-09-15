import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw } from 'lucide-react';

const FRAME_CONFIGS = {
  buzz: [
    { top: 19, left: 9.5, width: 37, height: 18.5, rotate: -12 },
    { top: 38, left: 57, width: 36, height: 18.5, rotate: -5.5 },
    { top: 44, left: 16, width: 36, height: 19, rotate: -1.5 },
    { top: 62, left: 51.5, width: 35, height: 18.5, rotate: 7 }
  ],
  alien: [
    { top: 19, left: 9.5, width: 33, height: 18.5, rotate: -13 },
    { top: 14, left: 48, width: 32, height: 18, rotate: 6.5 },
    { top: 44, left: 15.5, width: 33, height: 19, rotate: 0 },
    { top: 38, left: 57, width: 33, height: 18.5, rotate: -6 },
    { top: 62, left: 53, width: 33, height: 18.5, rotate: 6 }
  ]
};

export function TechStripPreview({ photos, selectedTheme, onRetake }) {
  const stripRef = useRef(null);
  const currentThemeSlots = FRAME_CONFIGS[selectedTheme] || FRAME_CONFIGS.buzz;

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      const dataUrl = await toPng(stripRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement('a');
      link.download = `toystory-${selectedTheme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh strip:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 my-4 w-full max-w-md mx-auto">
      <div
        ref={stripRef}
        className="relative w-[340px] h-[604px] overflow-hidden rounded-2xl shadow-2xl bg-[#59a8e9] shrink-0"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          {currentThemeSlots.map((slot, i) => {
            const photoSrc = photos[i] || photos[0];

            return (
              <div
                key={`${selectedTheme}-${i}`}
                style={{
                  position: 'absolute',
                  top: `${slot.top}%`,
                  left: `${slot.left}%`,
                  width: `${slot.width}%`,
                  height: `${slot.height}%`,
                  transform: `rotate(${slot.rotate}deg)`,
                  transformOrigin: 'center center',
                }}
                className="overflow-hidden bg-black flex items-center justify-center"
              >
                {photoSrc ? (
                  <img
                    src={photoSrc}
                    alt={`Pose ${i + 1}`}
                    className="w-full h-full object-cover scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
              </div>
            );
          })}
        </div>

        <img
          src={`/frames/${selectedTheme}.png`}
          alt="Toy Story Frame Overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 rounded-full text-xs uppercase font-bold shadow-md transition-all active:scale-95"
        >
          <RefreshCw size={14} /> Foto Ulang
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase rounded-full shadow-[0_4px_14px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95"
        >
          <Download size={14} /> Simpan (.PNG)
        </button>
      </div>
    </div>
  );
}