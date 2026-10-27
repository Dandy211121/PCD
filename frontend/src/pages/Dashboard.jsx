import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

import StatCard from '../components/StatCard';
import InspectionMap from '../components/InspectionMap';
import { inspectionService, locationService, mediaUrl } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_inspections: 0,
    total_locations: 0,
    critical_count: 0,
    moderate_count: 0,
    minor_count: 0,
    safe_count: 0,
    avg_crack_ratio: 0
  });
  const [locations, setLocations] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsData, locsData, inspData] = await Promise.all([
          inspectionService.getStats().catch(() => null),
          locationService.getAll().catch(() => []),
          inspectionService.getAll({ limit: 5 }).catch(() => [])
        ]);

        if (statsData) setStats(statsData);
        if (locsData) setLocations(locsData);
        if (inspData) setRecentInspections(inspData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getSeverityBadge = (level) => {
    switch (level) {
      case 'Kritis':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">KRITIS</span>;
      case 'Sedang':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">SEDANG</span>;
      case 'Ringan':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">RINGAN</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">AMAN</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Command Strip */}
      <div className="bento-card p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                Telemetry Console • SNI / ACI 224R-01
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pusat Kendali Inspeksi Struktur Beton
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Pemantauan dan deteksi degradasi permukaan infrastruktur via dekomposisi matriks petak ortofoto (Grid Slicing 6x6).
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Link
              to="/new-inspection"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all hover:shadow-blue-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Inspeksi Baru
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.08] transition-colors"
            >
              <FileText className="w-4 h-4" /> Riwayat Audit
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Card Bento Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audit Selesai"
          value={stats.total_inspections}
          unit="Inspeksi"
          icon={Activity}
          trend="Sinkronisasi Realtime"
          trendType="neutral"
        />

        <StatCard
          title="Risiko Tingkat Kritis"
          value={stats.critical_count}
          unit="Titik"
          icon={AlertTriangle}
          trend={stats.critical_count > 0 ? "Perlu Tindakan Segera" : "Nihil Kerusakan Kritis"}
          trendType={stats.critical_count > 0 ? "negative" : "positive"}
        />

        <StatCard
          title="Rata-rata Rasio Retak"
          value={stats.avg_crack_ratio}
          unit="%"
          icon={TrendingUp}
          trend="Toleransi Normal"
          trendType="neutral"
        />

        <StatCard
          title="Infrastruktur Terdaftar"
          value={stats.total_locations}
          unit="Titik"
          icon={MapPin}
          trend="Jembatan, Gedung, Dam"
          trendType="positive"
        />
      </div>

      {/* Main Bento Layout: GIS Map & Recent Inspection Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Leaflet Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Peta Sebaran Titik Inspeksi Geografis
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              {locations.length} Lokasi Terpetakan
            </span>
          </div>

          <div className="bento-card p-2 overflow-hidden">
            <InspectionMap locations={locations} height="h-[430px]" />
          </div>
        </div>

        {/* Right 1 Col: Feed of Recent Inspections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Inspeksi Terkini
              </h2>
            </div>
            <Link to="/history" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5">
              Lihat semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bento-card p-3 space-y-2.5 max-h-[445px] overflow-y-auto">
            {recentInspections.length === 0 ? (
              <div className="text-center py-14 text-slate-500 font-mono text-xs">
                Belum ada data inspeksi yang tersimpan.
              </div>
            ) : (
              recentInspections.map((insp) => (
                <Link
                  key={insp.id}
                  to={`/inspection/${insp.id}`}
                  className="block p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#06080d] flex-shrink-0 border border-white/[0.08]">
                      <img
                        src={mediaUrl(insp.annotated_image || insp.original_image, 'annotated')}
                        alt="Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                          {insp.location_name}
                        </span>
                        {getSeverityBadge(insp.severity_level)}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="truncate">{insp.inspector_name}</span>
                        <span>•</span>
                        <span>{new Date(insp.created_at).toLocaleDateString('id-ID')}</span>
                      </div>

                      {/* Crack ratio bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              insp.severity_level === 'Kritis' ? 'bg-rose-500' :
                              insp.severity_level === 'Sedang' ? 'bg-amber-500' :
                              insp.severity_level === 'Ringan' ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, insp.crack_ratio))}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-slate-300">
                          {insp.crack_ratio}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
