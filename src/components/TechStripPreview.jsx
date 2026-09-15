import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, Sparkles, Terminal } from 'lucide-react';

export function TechStripPreview({ photos, onRetake }) {
  const stripRef = useRef(null);

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      // Mengubah elemen HTML strip menjadi PNG beresolusi tajam (pixelRatio 2)
      const dataUrl = await toPng(stripRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `tech-booth-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh strip:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 my-8">
      {/* ========================================================
          AREA PHOTOSTRIP DENGAN STYLE TECH & DOODLE OVERLAY
         ======================================================== */}
      <div
        ref={stripRef}
        id="photostrip-target"
        className="relative w-[340px] bg-[#0c1017] text-white p-5 font-mono border-2 border-slate-800 shadow-[0_0_35px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm"
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:18px_18px] opacity-70 pointer-events-none" />

        {/* Header Strip */}
        <div className="relative z-10 flex justify-between items-center border-b border-cyan-500/40 pb-2 mb-3 text-[11px]">
          <span className="font-bold text-cyan-400 flex items-center gap-1">
            <Terminal size={13} /> // PHOTO_LABS
          </span>
          <span className="text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
            {new Date().toISOString().slice(0, 10)}
          </span>
        </div>

        {/* 3 Frame Foto dengan Sticker Overlap */}
        <div className="space-y-4 relative z-10">
          {photos.map((img, i) => (
            <div
              key={i}
              className="relative border-2 border-cyan-400/80 bg-black p-1 shadow-[3px_3px_0px_#00f0ff]"
            >
              <img
                src={img}
                alt={`Shot ${i + 1}`}
                className="w-full h-44 object-cover"
              />

              {/* Doodle / Stiker sudut dinamis */}
              {i === 0 && (
                <span className="absolute -top-3 -right-2 bg-yellow-400 text-black px-2 py-0.5 text-[10px] font-black tracking-wider uppercase rotate-6 border border-black shadow">
                  SYS_OK ★
                </span>
              )}
              {i === 1 && (
                <span className="absolute -bottom-2.5 -left-2 bg-pink-500 text-white px-2 py-0.5 text-[9px] font-bold tracking-widest -rotate-3 border border-black shadow">
                  RUN_PROGRAM
                </span>
              )}
              {i === 2 && (
                <span className="absolute -top-2.5 -left-2 bg-cyan-400 text-black px-1.5 py-0.5 text-[9px] font-bold rotate-[-6deg] border border-black shadow">
                  #03_FINAL
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Stiker & Footer Tech Bawah */}
        <div className="relative z-10 mt-5 pt-3 border-t-2 border-dashed border-cyan-500/40 text-center">
          <div className="flex justify-center items-center gap-1 text-cyan-400 mb-1">
            <Sparkles size={16} />
            <span className="text-[10px] tracking-widest font-bold">DIGITAL ARCHIVE</span>
            <Sparkles size={16} />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-400 drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)]">
            TECH NIGHT!
          </h2>

          {/* Fake Barcode Generator Effect */}
          <div className="flex justify-center items-end gap-[3px] h-6 mt-3 opacity-80">
            {[4, 2, 5, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 3, 6, 2, 4, 1].map((h, idx) => (
              <div
                key={idx}
                className="bg-cyan-400 w-[2px]"
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
          <p className="text-[9px] text-slate-500 tracking-widest mt-1">9823-TECH-PHOTO-STRIP</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-700 hover:border-slate-500 rounded text-xs tracking-wider uppercase font-semibold text-slate-300 transition-all hover:bg-slate-900"
        >
          <RefreshCw size={15} /> Retake
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95"
        >
          <Download size={15} /> Download Strip (.PNG)
        </button>
      </div>
    </div>
  );
}