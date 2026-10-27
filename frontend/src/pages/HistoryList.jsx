import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  User, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpDown
} from 'lucide-react';

import { inspectionService, locationService, mediaUrl } from '../services/api';

export default function HistoryList() {
  const [inspections, setInspections] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inspData, locData] = await Promise.all([
        inspectionService.getAll(),
        locationService.getAll()
      ]);
      setInspections(inspData);
      setLocations(locData);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Hapus catatan inspeksi #${id}?`)) {
      try {
        await inspectionService.delete(id);
        setInspections(inspections.filter((item) => item.id !== id));
      } catch (err) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const filteredInspections = inspections.filter((item) => {
    const matchesSearch =
      !search ||
      item.location_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.inspector_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.notes?.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = !selectedSeverity || item.severity_level === selectedSeverity;
    const matchesLocation = !selectedLocation || item.location_id.toString() === selectedLocation;

    return matchesSearch && matchesSeverity && matchesLocation;
  });

  const getSeverityBadge = (level) => {
    switch (level) {
      case 'Kritis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            KRITIS
          </span>
        );
      case 'Sedang':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            SEDANG
          </span>
        );
      case 'Ringan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            RINGAN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            AMAN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono text-[11px] mb-2">
            <span>REPOSITORY</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">AUDIT_LOGS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Riwayat Audit Struktural
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Arsip telemetri pemindaian retak, analisis petak grid slicing ResNet-18, dan berkas laporan inspeksi resmi.
          </p>
        </div>

        <Link
          to="/new-inspection"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Inspeksi Baru
        </Link>
      </div>

      {/* Filter Toolbar (Bento Style) */}
      <div className="bento-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari lokasi, inspektor, atau catatan audit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Location Select */}
          <div className="w-full md:w-64">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-300">Semua Objek Lokasi</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-300">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Segmented Severity Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/[0.06]">
          <span className="text-[11px] font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> SEVERITY:
          </span>
          {[
            { id: '', label: 'Semua' },
            { id: 'Kritis', label: 'Kritis (≥30%)', dot: 'bg-rose-500' },
            { id: 'Sedang', label: 'Sedang (15–29%)', dot: 'bg-amber-500' },
            { id: 'Ringan', label: 'Ringan (1–14%)', dot: 'bg-yellow-500' },
            { id: 'Aman', label: 'Aman (0%)', dot: 'bg-emerald-500' },
          ].map((pill) => {
            const isActive = selectedSeverity === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedSeverity(pill.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.12] text-white border border-white/[0.2] shadow-sm font-semibold'
                    : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                {pill.dot && <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />}
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Dokumentasi</th>
                <th className="py-3.5 px-4 font-semibold">Objek Infrastruktur</th>
                <th className="py-3.5 px-4 font-semibold">Inspektor & Waktu</th>
                <th className="py-3.5 px-4 font-semibold">Petak Retak</th>
                <th className="py-3.5 px-4 font-semibold">Rasio Kerusakan</th>
                <th className="py-3.5 px-4 font-semibold">Klasifikasi</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                    Memuat riwayat inspeksi...
                  </td>
                </tr>
              ) : filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500">
                    Tidak ada catatan inspeksi yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredInspections.map((insp) => (
                  <tr
                    key={insp.id}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => window.location.href = `/inspection/${insp.id}`}
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-white/[0.08]">
                        <img
                          src={mediaUrl(insp.annotated_image || insp.original_image, 'annotated')}
                          alt="Thumbnail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {insp.location_name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {insp.location_type}
                      </div>
                    </td>

                    {/* Inspector & Date */}
                    <td className="py-3 px-4">
                      <div className="text-slate-300 font-medium">{insp.inspector_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(insp.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Petak counts */}
                    <td className="py-3 px-4 font-mono font-medium tabular-nums">
                      <span className="text-rose-400 font-bold">{insp.crack_grids}</span>
                      <span className="text-slate-500"> / {insp.total_grids} petak</span>
                    </td>

                    {/* Crack Ratio Progress */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              insp.severity_level === 'Kritis' ? 'bg-rose-500' :
                              insp.severity_level === 'Sedang' ? 'bg-amber-500' :
                              insp.severity_level === 'Ringan' ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, insp.crack_ratio))}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-300 tabular-nums">
                          {insp.crack_ratio}%
                        </span>
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3 px-4">
                      {getSeverityBadge(insp.severity_level)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/inspection/${insp.id}`}
                          className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
                          title="Lihat Detail Analisis"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {insp.report_pdf && (
                          <a
                            href={inspectionService.getPdfDownloadUrl(insp.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-colors"
                            title="Unduh PDF Resmi"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => handleDelete(insp.id, e)}
                          className="p-1.5 rounded-md bg-white/[0.02] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/[0.04] hover:border-rose-500/30 transition-colors"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3 px-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong>{filteredInspections.length}</strong> data inspeksi</span>
          <span>Sistem Komputasi ResNet-18 Grid Slicing</span>
        </div>
      </div>

    </div>
  );
}
