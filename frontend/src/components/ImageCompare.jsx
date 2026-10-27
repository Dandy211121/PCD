import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical, Eye, Layers } from 'lucide-react';

export default function ImageCompare({
  originalSrc,
  annotatedSrc,
  aspectRatio = 'aspect-[4/3]',
  originalLabel = 'Foto Asli Struktur',
  annotatedLabel = 'Hasil Pemindaian AI (ResNet-18)'
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side'
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((p) => Math.min(100, p + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  return (
    <div className="space-y-3">
      {/* View Mode Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Komparasi Visual
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800" role="group" aria-label="Mode tampilan visual">
          <button
            onClick={() => setViewMode('slider')}
            aria-pressed={viewMode === 'slider'}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'slider'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" /> Slider Geser
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            aria-pressed={viewMode === 'side-by-side'}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'side-by-side'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Berdampingan
          </button>
        </div>
      </div>

      {viewMode === 'slider' ? (
        /* Interactive Split Slider */
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Slider komparasi citra asli dan anotasi AI"
          aria-valuenow={Math.round(sliderPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`relative select-none overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 ${aspectRatio} cursor-ew-resize group shadow-2xl touch-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {/* Base Layer: Annotated Image (Right side) */}
          <img
            src={annotatedSrc}
            alt={annotatedLabel}
            className="absolute inset-0 w-full h-full object-contain bg-slate-900 pointer-events-none"
          />

          {/* Top Layer: Original Image clipped to slider position (Left side) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalSrc}
              alt={originalLabel}
              className="absolute inset-0 w-full h-full object-contain bg-slate-900 pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none',
              }}
            />
            {/* Original Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-slate-200 shadow-md">
                {originalLabel}
              </span>
            </div>
          </div>

          {/* Annotated Badge (Always on the right) */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-2.5 py-1 rounded-md bg-blue-900/85 backdrop-blur-md border border-blue-500/40 text-[11px] font-semibold text-blue-200 shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              {annotatedLabel}
            </span>
          </div>

          {/* Divider Line & Draggable Handle */}
          <div
            className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-sm border-2 border-blue-600 transition-transform group-hover:scale-110 active:scale-95"
              aria-hidden="true"
            >
              ↔
            </div>
          </div>

          {/* Quick Click presets */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/60 text-[10px]">
            <button
              onClick={() => setSliderPos(0)}
              className="px-2 py-0.5 rounded-full hover:bg-slate-700 text-slate-300"
            >
              100% AI
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setSliderPos(50)}
              className="px-2 py-0.5 rounded-full hover:bg-slate-700 text-slate-300"
            >
              50:50
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setSliderPos(100)}
              className="px-2 py-0.5 rounded-full hover:bg-slate-700 text-slate-300"
            >
              100% Asli
            </button>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3]">
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200">
                {originalLabel}
              </span>
            </div>
            <img
              src={originalSrc}
              alt={originalLabel}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-blue-900/40 bg-slate-950 aspect-[4/3]">
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-md bg-blue-950/85 backdrop-blur-md border border-blue-500/40 text-xs font-semibold text-blue-200">
                {annotatedLabel}
              </span>
            </div>
            <img
              src={annotatedSrc}
              alt={annotatedLabel}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
