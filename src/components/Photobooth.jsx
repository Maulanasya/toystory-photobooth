import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Terminal, Activity } from 'lucide-react';
import { TechStripPreview } from './TechStripPreview';

const videoConstraints = {
  width: { ideal: 1080 },
  height: { ideal: 1440 },
  facingMode: "user"
};

export default function Photobooth() {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [timeString, setTimeString] = useState('');

  // Jam digital real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    const timer = setInterval(updateTime, 50);
    return () => clearInterval(timer);
  }, []);

  const captureSingle = useCallback(() => {
    if (webcamRef.current) {
      return webcamRef.current.getScreenshot();
    }
    return null;
  }, [webcamRef]);

  const startSession = async () => {
    setPhotos([]);
    setIsCapturing(true);

    const captured = [];
    for (let i = 0; i < 3; i++) {
      setCurrentSlot(i + 1);
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise(r => setTimeout(r, 1000));
      }
      setCountdown("SNAP!");
      await new Promise(r => setTimeout(r, 300));

      const shot = captureSingle();
      if (shot) {
        captured.push(shot);
        setPhotos([...captured]);
      }
      setCountdown(null);

      if (i < 2) await new Promise(r => setTimeout(r, 1000));
    }

    setCurrentSlot(0);
    setIsCapturing(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between p-3 sm:p-5 font-mono select-none">
      
      {/* Top Cyber Status Bar (Responsive Header) */}
      <header className="w-full flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 font-bold tracking-wider flex items-center gap-1.5 text-xs sm:text-sm">
             CYBER_BOOTH
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-cyan-400 font-mono text-[11px] sm:text-xs tracking-wider">
            {timeString || "00:00:00"}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[9px] sm:text-[10px] font-bold">
            ONLINE
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      {photos.length < 3 ? (
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 w-full max-w-6xl mx-auto my-auto">
          
          {/* Viewfinder Container */}
          <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.12)] flex items-center justify-center shrink-0">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              mirrored={true}
            />

            {/* Laser Scanning Animation */}
            {isCapturing && (
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-[bounce_2s_infinite] pointer-events-none z-20" />
            )}

            {/* Viewfinder HUD Overlays */}
            <div className="absolute inset-3 pointer-events-none z-10 flex flex-col justify-between">
              {/* Top Corners */}
              <div className="flex justify-between items-start">
                <div className="w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-bold bg-black/60 px-1 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                </span>
                <div className="w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
              </div>

              {/* Center Crosshair */}
              <div className="self-center w-8 h-8 border border-cyan-500/30 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_#00f0ff]" />
              </div>

              {/* Bottom Corners */}
              <div className="flex justify-between items-end">
                <div className="w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
                <span className="text-[9px] text-cyan-400/80 bg-black/60 px-1 rounded">
                  TARGET: LOCKED
                </span>
                <div className="w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>

            {/* Countdown Overlay */}
            {countdown && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/65 backdrop-blur-xs">
                <span className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-500 drop-shadow-[0_0_25px_#00f0ff] animate-pulse">
                  {countdown}
                </span>
                <span className="text-xs uppercase tracking-widest text-cyan-300 mt-2 font-bold">
                  Pose #{currentSlot}
                </span>
              </div>
            )}
          </div>

          {/* Slots & Status Panel */}
          <div className="w-full max-w-[420px] lg:max-w-[240px] flex flex-col gap-3 bg-slate-900/40 border border-slate-800 p-3 sm:p-4 rounded-xl backdrop-blur-sm shrink-0">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Activity size={13} /> Sequence Slots
              </span>
              <span className="text-slate-400 text-[10px]">{photos.length}/3 Done</span>
            </div>

            {/* Preview Slot (Grid 3 kolom di mobile, 1 kolom di desktop) */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              {[0, 1, 2].map((idx) => {
                const img = photos[idx];
                const isActive = currentSlot === idx + 1;

                return (
                  <div
                    key={idx}
                    className={`relative rounded-lg overflow-hidden border transition-all h-16 sm:h-20 lg:h-24 flex items-center justify-center ${
                      isActive
                        ? "border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] bg-cyan-950/30"
                        : img
                        ? "border-slate-700 bg-slate-950"
                        : "border-slate-800 border-dashed bg-slate-950/40 text-slate-600"
                    }`}
                  >
                    {img ? (
                      <img src={img} alt={`Slot ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[10px] tracking-wider font-mono flex flex-col items-center">
                        <span>#0{idx + 1}</span>
                        {isActive && <span className="text-[8px] text-cyan-400 animate-pulse">REC</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Preview & Download Area */
        <div className="flex-1 flex items-center justify-center py-4 overflow-y-auto">
          <TechStripPreview photos={photos} onRetake={() => setPhotos([])} />
        </div>
      )}

      {/* Bottom Shutter Action Button */}
      {photos.length < 3 && (
        <footer className="w-full flex flex-col items-center justify-center gap-1.5 shrink-0 pt-3 pb-2">
          <button
            onClick={startSession}
            disabled={isCapturing}
            className="w-full max-w-[420px] sm:w-auto px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 text-slate-950 font-black tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.35)] disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2.5 disabled:text-slate-500"
          >
            <Camera size={18} />
            {isCapturing ? `CAPTURING POSE ${currentSlot}/3...` : "START SEQUENCE (3 SHOTS)"}
          </button>
          <span className="text-[10px] text-slate-500 text-center">Auto countdown 3 detik tiap jepretan</span>
        </footer>
      )}

    </div>
  );
}