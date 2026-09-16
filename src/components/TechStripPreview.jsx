import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, Camera } from 'lucide-react';

const FRAME_CONFIGS = {
  buzz: [
    { top: 19, left: 9.5, width: 38, height: 20, rotate: -14.5 },
    { top: 38, left: 56.5, width: 38, height: 20, rotate: -5.5 },
    { top: 44, left: 16, width: 38, height: 20, rotate: -2 },
    { top: 62, left: 52, width: 38, height: 20, rotate: 7 }
  ],
  alien: [
    { top: 19, left: 9.5, width: 38.5, height: 20, rotate: -13 },
    { top: 12.5, left: 48, width: 38, height: 20, rotate: 6.5 },
    { top: 43.5, left: 15.5, width: 38, height: 20, rotate: -0.5 },
    { top: 37, left: 57, width: 38, height: 20, rotate: -6 },
    { top: 62, left: 53, width: 38, height: 20, rotate: 6 }
  ]
};

export function TechStripPreview({ photos, selectedTheme, onRetakeAll, onRetakeSingle }) {
  const stripRef = useRef(null);
  const activeTheme = selectedTheme || 'buzz';
  const currentSlots = FRAME_CONFIGS[activeTheme] || FRAME_CONFIGS.buzz;

  const handleDownload = async () => {
    if (!stripRef.current) return;
    try {
      const dataUrl = await toPng(stripRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement('a');
      link.download = `toystory-${activeTheme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh strip:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 my-auto w-full max-w-5xl mx-auto py-2">
      {/* Canvas Photostrip */}
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div
          ref={stripRef}
          className="relative w-[340px] h-[604px] overflow-hidden rounded-2xl shadow-2xl bg-[#59a8e9] shrink-0"
        >
          {/* Layer Foto di Belakang Frame */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {currentSlots.map((slot, i) => {
              const photoSrc = photos[i] || photos[0];

              return (
                <div
                  key={`${activeTheme}-${i}`}
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

          {/* Layer Frame PNG Transparan */}
          <img
            src={`/frames/${activeTheme}.png`}
            alt="Toy Story Frame Overlay"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
          />
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 rounded-full text-xs uppercase font-bold shadow-md transition-all active:scale-95"
          >
            <RefreshCw size={14} /> Foto Ulang Semua
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs uppercase rounded-full shadow-[0_4px_14px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <Download size={14} /> Simpan (.PNG)
          </button>
        </div>
      </div>

      {/* Panel Retake Foto Satuan */}
      <div className="w-full max-w-xs bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white p-4 shadow-xl flex flex-col gap-3">
        <div className="border-b pb-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-sky-950">
            Ada pose yang kurang pas?
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pilih pose di bawah untuk foto ulang tanpa mengulang pose lainnya.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={photo}
                  alt={`Slot ${idx + 1}`}
                  className="w-11 h-11 rounded-lg object-cover border border-white shadow-sm"
                />
                <span className="font-bold text-xs text-slate-700">Pose #{idx + 1}</span>
              </div>

              <button
                onClick={() => onRetakeSingle(idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] rounded-lg shadow-sm transition active:scale-95"
              >
                <Camera size={13} /> Retake
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}