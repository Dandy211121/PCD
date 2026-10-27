import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info,
  Sliders,
  HelpCircle,
  Activity
} from 'lucide-react';

export const SEVERITY_LEVELS = [
  {
    key: 'Aman',
    title: 'Aman',
    subtitle: 'Bebas Retak Struktural',
    rangeText: '0.0%',
    gridRangeText: '0 dari 36 petak',
    min: 0,
    max: 0,
    colorName: 'emerald',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    barClass: 'bg-emerald-500',
    borderActiveClass: 'border-emerald-500 bg-slate-900',
    description: 'Permukaan beton berada dalam kondisi utuh dan prima. Tidak ditemukan anomali atau patahan struktur pada petak grid pemindaian.',
    action: 'Pemeliharaan berkala standar dan pencatatan audit rutin.'
  },
  {
    key: 'Ringan',
    title: 'Ringan',
    subtitle: 'Retak Rambut / Mikro (Hairline)',
    rangeText: '> 0% s.d. 10.0%',
    gridRangeText: '1 - 3 dari 36 petak',
    min: 0.01,
    max: 10.0,
    colorName: 'yellow',
    badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    barClass: 'bg-yellow-500',
    borderActiveClass: 'border-yellow-500 bg-slate-900',
    description: 'Retak mikro superfisial pada selimut beton (lebar < 0.2 mm). Belum mengancam integritas daya dukung beban struktur.',
    action: 'Coating anti-karbonasi / sealing permukaan dan pasang glass tell-tale monitor.'
  },
  {
    key: 'Sedang',
    title: 'Sedang',
    subtitle: 'Retak Struktural Aktif',
    rangeText: '> 10.0% s.d. 25.0%',
    gridRangeText: '4 - 9 dari 36 petak',
    min: 10.01,
    max: 25.0,
    colorName: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    barClass: 'bg-amber-500',
    borderActiveClass: 'border-amber-500 bg-slate-900',
    description: 'Retakan menjalar kontinu antar petak yang berpotensi memicu penetrasi air, korosi besi tulangan, dan delaminasi spalling.',
    action: 'Injeksi resin epoxy tekanan rendah (low-pressure injection) dan uji Ultrasonic Pulse Velocity (UPV).'
  },
  {
    key: 'Kritis',
    title: 'Kritis',
    subtitle: 'Degradasi Struktural Berat',
    rangeText: '> 25.0%',
    gridRangeText: '≥ 10 dari 36 petak',
    min: 25.01,
    max: 100.0,
    colorName: 'rose',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    barClass: 'bg-rose-500',
    borderActiveClass: 'border-rose-500 bg-slate-900',
    description: 'Penyebaran retak masif lintas elemen pemikul beban utama. Risiko tinggi terhadap penurunan kapasitas beban struktural.',
    action: 'Audit teknis forensik sipil menyeluruh, pembatasan beban dinamis, dan perkuatan struktur (retrofitting/carbon wrap) segera.'
  }
];

export default function SeverityScaleGuide({ currentRatio = null, currentLevel = null, compact = false }) {
  // Determine position percentage for the gauge marker (clamp to 100)
  const markerPos = currentRatio !== null ? Math.min(Math.max(currentRatio, 0), 100) : null;

  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Panduan Standar Tingkat Keparahan Keretakan Beton
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Klasifikasi berdasarkan rasio sebaran petak terdeteksi retak dari total 36 petak grid matriks (6x6).
          </p>
        </div>

        {currentRatio !== null && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs self-start sm:self-auto">
            <span className="text-slate-400">Posisi Nilai Audit:</span>
            <span className="font-mono font-bold text-blue-400">{currentRatio}%</span>
            {currentLevel && (
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                currentLevel === 'Kritis' ? 'bg-rose-500/20 text-rose-400' :
                currentLevel === 'Sedang' ? 'bg-amber-500/20 text-amber-400' :
                currentLevel === 'Ringan' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {currentLevel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Visual Spectrum / Gauge Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
          <span>0% (Aman)</span>
          <span>10% (Batas Ringan)</span>
          <span>25% (Batas Sedang)</span>
          <span>100% (Kritis Maksimal)</span>
        </div>

        {/* Multi-segment Gauge Bar */}
        <div className="relative h-4 w-full rounded-full bg-slate-950 overflow-visible border border-slate-800 p-0.5">
          <div className="w-full h-full rounded-full flex overflow-hidden">
            {/* 0 - 10% (width 10%) */}
            <div 
              style={{ width: '10%' }} 
              className="bg-emerald-500 transition-all" 
              title="Aman: 0% - Ringan: s.d. 10%" 
            />
            {/* 10 - 25% (width 15%) */}
            <div 
              style={{ width: '15%' }} 
              className="bg-amber-500 transition-all" 
              title="Sedang: >10% s.d. 25%" 
            />
            {/* 25 - 100% (width 75%) */}
            <div 
              style={{ width: '75%' }} 
              className="bg-rose-600 transition-all" 
              title="Kritis: >25%" 
            />
          </div>

          {/* Current Marker Pin if available */}
          {markerPos !== null && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-20 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
              style={{ left: `${Math.max(2, Math.min(markerPos, 98))}%` }}
            >
              {/* Floating Pin Tooltip */}
              <div className="absolute -top-7 px-2 py-0.5 rounded-md bg-white text-slate-950 text-[10px] font-black font-mono shadow-md whitespace-nowrap flex items-center gap-1">
                <span>{currentRatio}%</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-white ring-4 ring-blue-500 shadow-lg shadow-blue-500/50" />
            </div>
          )}
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4 pt-2`}>
        {SEVERITY_LEVELS.map((level) => {
          const isActive = currentLevel === level.key || (
            currentRatio !== null && (
              level.key === 'Aman' ? currentRatio === 0 :
              currentRatio > level.min && currentRatio <= level.max
            )
          );

          return (
            <div
              key={level.key}
              className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isActive 
                  ? level.borderActiveClass 
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700/80'
              }`}
            >
              {/* Active Tag */}
              {isActive && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-blue-500 text-white font-black text-[9px] uppercase tracking-wider shadow">
                  Status Saat Ini
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${level.badgeClass}`}>
                    {level.title.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {level.rangeText}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {level.subtitle}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {level.gridRangeText}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Engineering Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase mb-0.5">
                  Protokol Rekomendasi:
                </span>
                <span className="leading-snug block">
                  {level.action}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Rumus Perhitungan:</strong> Persentase Keretakan dihitung otomatis dengan formula <code className="text-blue-300 bg-slate-950 px-1.5 py-0.5 rounded">Rasio = (Jumlah Petak Retak / 36 Petak) × 100%</code>. Tiap petak diproses dengan resolusi spasial penuh melalui Convolutional Neural Network ResNet-18.
        </span>
      </div>
    </div>
  );
}
