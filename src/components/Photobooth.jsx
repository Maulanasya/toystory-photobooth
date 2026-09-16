import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Sparkles, ChevronRight, Check, Wand2 } from 'lucide-react';
import { TechStripPreview } from './TechStripPreview';

const videoConstraints = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  facingMode: "user"
};

const FILTERS = [
  { id: 'normal', name: 'Normal', filterStyle: 'none' },
  { id: 'hd-vibrant', name: 'HD Toy Story', filterStyle: 'contrast(108%) saturate(125%) brightness(103%)' },
  { id: 'warm-soft', name: 'Warm Cozy', filterStyle: 'contrast(105%) brightness(105%) sepia(15%) saturate(115%)' },
  { id: 'clean-sharp', name: 'Crisp Clear', filterStyle: 'contrast(115%) brightness(102%)' },
];

const THEMES = [
  {
    id: 'buzz',
    name: 'Buzz Lightyear',
    edition: 'Buzz Edition',
    accentColor: 'border-amber-400 text-amber-500',
    btnBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    totalShots: 4,
    thumbnail: '/frames/buzz.png',
  },
  {
    id: 'alien',
    name: 'Little Green Men',
    edition: 'Alien Edition',
    accentColor: 'border-lime-400 text-lime-600',
    btnBg: 'bg-lime-400 hover:bg-lime-300 text-slate-950',
    totalShots: 5,
    thumbnail: '/frames/alien.png',
  }
];

export default function Photobooth() {
  const webcamRef = useRef(null);
  const [step, setStep] = useState('select');
  const [selectedThemeId, setSelectedThemeId] = useState('buzz');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[1]);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [singleRetakeIndex, setSingleRetakeIndex] = useState(null);

  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  const captureSingle = useCallback(() => {
    if (!webcamRef.current) return null;
    const canvas = webcamRef.current.getCanvas();
    if (!canvas) return null;

    if (selectedFilter.filterStyle !== 'none') {
      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = canvas.width;
      filteredCanvas.height = canvas.height;
      const ctx = filteredCanvas.getContext('2d');
      ctx.filter = selectedFilter.filterStyle;
      ctx.drawImage(canvas, 0, 0);
      return filteredCanvas.toDataURL('image/jpeg', 0.95);
    }

    return webcamRef.current.getScreenshot();
  }, [webcamRef, selectedFilter]);

  const startSession = async () => {
    setPhotos([]);
    setIsCapturing(true);

    const captured = [];
    for (let i = 0; i < currentTheme.totalShots; i++) {
      setCurrentSlot(i + 1);
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise((r) => setTimeout(r, 1000));
      }
      setCountdown("CHEESE!");
      await new Promise((r) => setTimeout(r, 400));

      const shot = captureSingle();
      if (shot) {
        captured.push(shot);
        setPhotos([...captured]);
      }
      setCountdown(null);

      if (i < currentTheme.totalShots - 1) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    setCurrentSlot(0);
    setIsCapturing(false);
    setStep('preview');
  };

  const handleRetakeSingle = (index) => {
    setSingleRetakeIndex(index);
    setStep('capture');
  };

  const executeSingleCapture = async () => {
    setIsCapturing(true);
    setCurrentSlot(singleRetakeIndex + 1);

    for (let c = 3; c > 0; c--) {
      setCountdown(c);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown("CHEESE!");
    await new Promise((r) => setTimeout(r, 400));

    const newShot = captureSingle();
    if (newShot) {
      setPhotos((prev) => {
        const updated = [...prev];
        updated[singleRetakeIndex] = newShot;
        return updated;
      });
    }

    setCountdown(null);
    setIsCapturing(false);
    setSingleRetakeIndex(null);
    setCurrentSlot(0);
    setStep('preview');
  };

  const resetAll = () => {
    setPhotos([]);
    setSingleRetakeIndex(null);
    setStep('select');
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 select-none text-slate-800 backdrop-blur-[1px]">
      <header className="w-full flex items-center justify-between border-b-2 border-white/40 pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded text-xs tracking-wider border-2 border-amber-500 shadow-sm">
            TOY BOOTH
          </div>
          <span className="text-white font-extrabold tracking-wide text-sm drop-shadow-sm flex items-center gap-1.5">
            Andy's Room 
          </span>
        </div>
        
        <div className="text-white/90 text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
          {step === 'select' && "Step 1: Pilih Frame"}
          {step === 'capture' && (singleRetakeIndex !== null ? `Retake Pose #${singleRetakeIndex + 1}` : `Step 2: Take ${currentTheme.totalShots} Shots`)}
          {step === 'preview' && "Step 3: Simpan / Retake"}
        </div>
      </header>

      {step === 'select' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto my-auto w-full">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              Pilih Desain Photostrip Kamu
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              Setiap template memiliki tata letak polaroid khusus
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
            {THEMES.map((theme) => {
              const isSelected = theme.id === selectedThemeId;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`cursor-pointer group relative bg-white/70 backdrop-blur-md rounded-2xl p-4 border-4 transition-all duration-200 flex flex-col items-center gap-3 shadow-lg ${
                    isSelected
                      ? `${theme.accentColor} scale-102 ring-4 ring-white/60`
                      : 'border-white/80 hover:border-white'
                  }`}
                >
                  <div className="relative w-36 h-56 rounded-xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center">
                    <img
                      src={theme.thumbnail}
                      alt={theme.name}
                      className="w-full h-full object-contain"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-slate-900 p-1 rounded-full shadow-md">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="font-extrabold text-sm text-slate-900">{theme.edition}</h3>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {theme.totalShots} Poses
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
  type="button"
  onClick={() => setStep('capture')}
  className={`relative z-30 cursor-pointer px-8 py-3.5 ${currentTheme.btnBg} font-black text-sm uppercase tracking-wider rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 border-2 border-white transition-all hover:scale-105 active:scale-95`}
>
  Lanjut ke Kamera <ChevronRight size={18} />
</button>
        </div>
      )}

      {step === 'capture' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-5xl mx-auto my-auto">
          {/* Pilihan Filter Real-time */}
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
            <span className="text-[11px] font-extrabold text-sky-900 flex items-center gap-1">
              <Wand2 size={13} /> Filter:
            </span>
            <div className="flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    selectedFilter.id === f.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 bg-white/50'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
            {/* Viewport Kamera */}
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl overflow-hidden bg-white p-2.5 border-4 border-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: selectedFilter.filterStyle }}
                  mirrored={true}
                />

                <div className="absolute inset-3 pointer-events-none border-2 border-dashed border-white/40 rounded-xl" />

                {countdown && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sky-900/50 backdrop-blur-xs">
                    <span className="text-6xl sm:text-7xl font-black text-amber-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] animate-bounce">
                      {countdown}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-white mt-3 font-extrabold bg-red-500 px-3 py-1 rounded-full shadow">
                      {singleRetakeIndex !== null ? `Retake Pose ${singleRetakeIndex + 1}` : `Pose ${currentSlot} / ${currentTheme.totalShots}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Slot Preview */}
            <div className="w-full max-w-[480px] lg:max-w-[200px] flex flex-col gap-2 bg-white/60 backdrop-blur-md border-2 border-white p-3.5 rounded-2xl shadow-md shrink-0">
              <div className="text-xs font-extrabold text-sky-900 uppercase tracking-wider flex items-center justify-between border-b border-sky-200 pb-2">
                <span>{currentTheme.name}</span>
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  {photos.length}/{currentTheme.totalShots}
                </span>
              </div>

              <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
                {Array.from({ length: currentTheme.totalShots }).map((_, idx) => {
                  const img = photos[idx];
                  const isTargetSlot = singleRetakeIndex === idx || currentSlot === idx + 1;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square flex items-center justify-center ${
                        isTargetSlot
                          ? "border-amber-400 ring-2 ring-amber-300 bg-amber-50"
                          : img
                          ? "border-white bg-slate-900 shadow-sm"
                          : "border-sky-300/60 border-dashed bg-white/40 text-sky-700"
                      }`}
                    >
                      {img ? (
                        <img src={img} alt={`Pose ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] font-black">{idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="flex-1 flex items-center justify-center py-2 overflow-y-auto">
          <TechStripPreview
            photos={photos}
            selectedTheme={selectedThemeId}
            onRetakeAll={resetAll}
            onRetakeSingle={handleRetakeSingle}
          />
        </div>
      )}

      {step === 'capture' && (
        <footer className="w-full flex flex-col items-center justify-center gap-2 shrink-0 pt-2 pb-2">
          <div className="flex items-center gap-3">
            {singleRetakeIndex !== null ? (
              <>
                <button
                  onClick={() => {
                    setSingleRetakeIndex(null);
                    setStep('preview');
                  }}
                  disabled={isCapturing}
                  className="px-5 py-3.5 bg-white text-slate-700 font-bold text-xs uppercase rounded-full shadow border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={executeSingleCapture}
                  disabled={isCapturing}
                  className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black tracking-wider uppercase text-xs sm:text-sm rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 flex items-center gap-2.5 border-2 border-white disabled:opacity-50"
                >
                  <Camera size={18} />
                  {isCapturing ? `Mengambil Pose #${singleRetakeIndex + 1}...` : `Jepret Ulang Pose #${singleRetakeIndex + 1}`}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep('select')}
                  disabled={isCapturing}
                  className="px-5 py-3.5 bg-white text-slate-700 font-bold text-xs uppercase rounded-full shadow border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  Ganti Frame
                </button>
                <button
                  onClick={startSession}
                  disabled={isCapturing}
                  className={`px-8 py-3.5 ${currentTheme.btnBg} font-black tracking-wider uppercase text-xs sm:text-sm rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 flex items-center gap-2.5 border-2 border-white disabled:opacity-50`}
                >
                  <Camera size={18} />
                  {isCapturing 
                    ? `Capturing Pose ${currentSlot}/${currentTheme.totalShots}...` 
                    : `Mulai Foto (Auto ${currentTheme.totalShots}X)`}
                </button>
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}