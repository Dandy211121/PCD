import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin creator
const createCustomPin = (severity = 'Aman') => {
  const colors = {
    Aman: '#22c55e',     // green
    Ringan: '#eab308',   // yellow
    Sedang: '#f97316',   // orange
    Kritis: '#ef4444',   // red
  };
  const color = colors[severity] || '#3b82f6';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: ${color};
          opacity: 0.25;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0f172a;
          border: 3px solid ${color};
          box-shadow: 0 0 10px ${color}88;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

function AutoCenter({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [locations, map]);
  return null;
}

export default function InspectionMap({ locations = [], height = "h-[450px]" }) {
  // Default center around Indonesia (Java)
  const defaultCenter = [-6.2088, 106.8456];

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950`}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <AutoCenter locations={locations} />

        {locations.map((loc) => {
          const pinIcon = createCustomPin(loc.highest_severity || 'Sedang');

          return (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={pinIcon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                      {loc.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ID #{loc.id}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100 leading-snug">
                    {loc.name}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {loc.address || 'Alamat belum dispesifikasikan'}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Total Inspeksi: <strong className="text-white">{loc.inspection_count || 0}</strong>
                    </span>
                    <Link
                      to={`/new-inspection?location_id=${loc.id}`}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-[11px]"
                    >
                      Audit Sekarang <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Floating Tag */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-xl pointer-events-auto flex items-center gap-3">
        <span className="font-semibold text-slate-400">Status:</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Ringan</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Sedang</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Kritis</span>
      </div>
    </div>
  );
}
