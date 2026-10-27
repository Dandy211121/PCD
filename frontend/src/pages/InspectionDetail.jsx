import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Calendar, 
  MapPin, 
  User, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info,
  Clock,
  ShieldCheck,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';

import { inspectionService, mediaUrl } from '../services/api';
import ImageCompare from '../components/ImageCompare';
import SeverityScaleGuide from '../components/SeverityScaleGuide';

export default function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await inspectionService.getById(id);
        setInspection(data);
        if (data.grid_data && data.grid_data.length > 0) {
          // Select first crack cell if available, else first cell
          const firstCrack = data.grid_data.find(g => g.is_crack) || data.grid_data[0];
          setSelectedCell(firstCrack);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal memuat rincian inspeksi');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus arsip data inspeksi ini?')) {
      try {
        await inspectionService.delete(id);
        navigate('/history');
      } catch (err) {
        alert('Gagal menghapus inspeksi: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Memuat analisis data inspeksi...</p>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Data Tidak Ditemukan</h2>
        <p className="text-xs text-slate-400">{error || 'Inspeksi dengan ID tersebut tidak tersedia.'}</p>
        <Link to="/history" className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  const getSeverityBadge = (level) => {
    switch (level) {
      case 'Kritis':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            TINGKAT KRITIS
          </span>
        );
      case 'Sedang':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            TINGKAT SEDANG
          </span>
        );
      case 'Ringan':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            TINGKAT RINGAN
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            STRUKTUR AMAN
          </span>
        );
    }
  };

  const gridData = inspection.grid_data || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Top Navigation & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip Riwayat
        </Link>

        <div className="flex items-center gap-2">
          {inspection.report_pdf && (
            <a
              href={inspectionService.getPdfDownloadUrl(inspection.id)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh PDF Resmi
            </a>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.08] transition-colors"
            title="Hapus Data Inspeksi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Info Panel */}
      <div className="bento-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                AUDIT ID #{inspection.id.toString().padStart(4, '0')}
              </span>
              {getSeverityBadge(inspection.severity_level)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {inspection.location_name}
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-4 flex-wrap pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {inspection.location_type}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <User className="w-3.5 h-3.5 text-slate-500" /> {inspection.inspector_name}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-600" /> {new Date(inspection.created_at).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center sm:min-w-[320px]">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Petak</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5 tabular-nums">{inspection.total_grids}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-rose-400">Petak Retak</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5 tabular-nums">{inspection.crack_grids}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400">Rasio Retak</div>
              <div className="text-xl font-bold font-mono text-blue-400 mt-0.5 tabular-nums">{inspection.crack_ratio}%</div>
            </div>
          </div>
        </div>

        {/* Notes block if present */}
        {inspection.notes && (
          <div className="text-xs text-slate-300 bg-white/[0.02] p-3.5 rounded-lg border border-white/[0.06]">
            <strong className="text-slate-200 font-mono text-[11px] uppercase mr-2 text-slate-400">Catatan Lapangan:</strong>
            {inspection.notes}
          </div>
        )}
      </div>

      {/* Interactive Severity Scale & Range Reference Guide */}
      <SeverityScaleGuide 
        currentRatio={inspection.crack_ratio} 
        currentLevel={inspection.severity_level} 
      />

      {/* Visual Image Comparison Section */}
      <div className="bento-card p-6 sm:p-7 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono text-[11px] mb-2">
            <span>IMAGE_ANALYSIS</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">DUAL_VIEW</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Visualisasi Komparasi Citra Asli vs Pemindaian AI
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geser slider ke kiri dan kanan untuk membandingkan foto asli dengan deteksi petak berkotak merah ResNet-18.
          </p>
        </div>

        <ImageCompare
          originalSrc={mediaUrl(inspection.original_image, 'uploads')}
          annotatedSrc={mediaUrl(inspection.annotated_image, 'annotated')}
          originalLabel="Foto Asli Struktur"
          annotatedLabel="Pemindaian Berkotak Merah (ResNet-18)"
        />
      </div>

      {/* Grid Petak Matrix Interactive Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 6x6 Matrix Cells */}
        <div className="lg:col-span-2 bento-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                Matriks Petak Grid Slicing (6x6 = 36 Petak)
              </h3>
              <p className="text-xs text-slate-400">
                Klik salah satu kotak petak untuk menginspeksi koordinat dan probabilitas deteksi.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
              ResNet-18
            </span>
          </div>

          {/* 6x6 Matrix Grid */}
          <div className="grid grid-cols-6 gap-2 sm:gap-2.5 p-3.5 bg-black/40 rounded-xl border border-white/[0.06] aspect-square max-h-[440px] mx-auto">
            {gridData.map((cell) => {
              const isSelected = selectedCell && selectedCell.cell_id === cell.cell_id;
              return (
                <button
                  key={cell.cell_id}
                  type="button"
                  onClick={() => setSelectedCell(cell)}
                  className={`relative rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${
                    cell.is_crack
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:border-rose-400'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
                  } ${
                    isSelected ? 'ring-2 ring-blue-500 border-transparent scale-105 z-10' : ''
                  }`}
                >
                  <span className="text-[10px] font-bold font-mono">P{cell.cell_id}</span>
                  <span className="text-[8px] font-mono opacity-70">
                    [{cell.row},{cell.col}]
                  </span>
                  <span className={`text-[9px] font-mono font-bold mt-1 tabular-nums ${cell.is_crack ? 'text-rose-400' : 'text-slate-500'}`}>
                    {cell.confidence}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/40"></span>
              Petak Terdeteksi Retak
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-white/[0.03] border border-white/[0.08]"></span>
              Petak Normal / Bebas Retak
            </span>
          </div>
        </div>

        {/* Right 1 Col: Petak Inspector Card & Engineering Recommendations */}
        <div className="space-y-6">
          {/* Selected Petak Inspector */}
          <div className="bento-card p-5 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" /> Detail Petak Terpilih
            </h4>

            {selectedCell ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <div className="font-bold text-base text-white font-mono">
                    Petak #{selectedCell.cell_id}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    selectedCell.is_crack
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {selectedCell.is_crack ? 'RETAK AKTIF' : 'NORMAL'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Koordinat</span>
                    <div className="font-semibold text-slate-200 mt-0.5 font-mono">
                      R:{selectedCell.row} C:{selectedCell.col}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Confidence AI</span>
                    <div className="font-bold text-blue-400 mt-0.5 font-mono tabular-nums">
                      {selectedCell.confidence}%
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                  <span className="font-semibold text-slate-300 font-mono text-[11px]">Rekomendasi Penanganan:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {selectedCell.is_crack
                      ? 'Injeksi resin epoxy tekanan rendah untuk menutup rongga retak mikro dan mencegah penetrasi kelembapan korosi tulangan.'
                      : 'Permukaan petak dalam batas toleransi standar fisik beton.'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                Pilih petak pada matriks untuk melihat detail.
              </p>
            )}
          </div>

          {/* Action Protocol Checklist */}
          <div className="bento-card p-5 space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Protokol Evaluasi Standar
            </h4>

            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <span className="text-[11px] text-slate-400">Verifikasi dimensi lebar retak dengan Crack Width Ruler lapangan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <span className="text-[11px] text-slate-400">Pemasangan glass tell-tale monitor untuk mendeteksi pergerakan retak aktif.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <span className="text-[11px] text-slate-400">Penyampaian laporan PDF resmi ke Lead Structural Engineer penanggung jawab.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
