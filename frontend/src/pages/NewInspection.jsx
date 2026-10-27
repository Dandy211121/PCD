import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  MapPin, 
  User, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Plus,
  X
} from 'lucide-react';

import { locationService, inspectionService } from '../services/api';
import SeverityScaleGuide from '../components/SeverityScaleGuide';

export default function NewInspection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialLocId = searchParams.get('location_id') || '';

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialLocId);
  const [inspectorName, setInspectorName] = useState('Ir. Hendra Pratama, S.T.');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Quick Add Location modal state
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocForm, setNewLocForm] = useState({
    name: '',
    type: 'Jembatan',
    address: '',
    latitude: -6.2088,
    longitude: 106.8456,
    description: ''
  });

  // Scanning progress state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const scanSteps = [
    'Mengunggah berkas foto ke server storage...',
    'Melakukan Grid Slicing 6x6 (36 petak komputasi)...',
    'Menjalankan inferensi konvolusi ResNet-18...',
    'Menghitung rasio keretakan & analisis keparahan struktur...',
    'Menyusun dokumen laporan resmi PDF...'
  ];

  useEffect(() => {
    async function fetchLocations() {
      try {
        const data = await locationService.getAll();
        setLocations(data);
        if (!selectedLocationId && data.length > 0) {
          setSelectedLocationId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    }
    fetchLocations();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Silakan pilih berkas format gambar (JPG/PNG/WEBP)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrorMessage('');
      } else {
        setErrorMessage('Hanya berkas gambar yang didukung');
      }
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      const created = await locationService.create(newLocForm);
      setLocations([created, ...locations]);
      setSelectedLocationId(created.id.toString());
      setShowAddLocation(false);
      setNewLocForm({
        name: '',
        type: 'Jembatan',
        address: '',
        latitude: -6.2088,
        longitude: 106.8456,
        description: ''
      });
    } catch (err) {
      alert('Gagal menambah lokasi: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleSubmitScan = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Harap unggah foto struktur beton untuk dipindai.');
      return;
    }
    if (!selectedLocationId) {
      setErrorMessage('Harap pilih lokasi objek inspeksi.');
      return;
    }

    setErrorMessage('');
    setIsScanning(true);
    setScanStep(0);

    // Simulate step progress while request runs
    const interval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('location_id', selectedLocationId);
      formData.append('inspector_name', inspectorName);
      formData.append('notes', notes);

      const result = await inspectionService.scan(formData);
      clearInterval(interval);
      setScanStep(scanSteps.length - 1);

      // Brief delay before redirecting to detail view
      setTimeout(() => {
        navigate(`/inspection/${result.id}`);
      }, 700);

    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      setErrorMessage(
        err.response?.data?.detail || 'Terjadi kesalahan saat memproses pemindaian AI.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Registrasi & Pemindaian Struktur Baru
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Unggah dokumentasi fotografi permukaan beton untuk evaluasi matriks petak (Grid Slicing) dan penerbitan dokumen audit resmi.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmitScan} className="space-y-6">
        
        {/* Upload Box */}
        <div className="bento-card p-6 space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
            Unggah Ortofoto Permukaan Beton *
          </label>

          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border border-dashed border-white/[0.14] hover:border-blue-500/60 rounded-xl p-8 sm:p-12 text-center transition-all bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer group"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm text-slate-200">
                Tarik & letakkan foto di sini, atau <span className="text-blue-400 underline">pilih dari perangkat</span>
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                JPG, PNG, WEBP • Disarankan resolusi tinggi untuk akurasi petak 6x6
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/[0.1] bg-[#06080d] aspect-[16/9] max-h-[360px] group">
              <img
                src={previewUrl}
                alt="Pratinjau Foto"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-[#06080d]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload').click()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md hover:bg-blue-500 transition-colors"
                >
                  Ganti Foto
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-500 transition-colors"
                >
                  Hapus
                </button>
              </div>
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#06080d]/90 text-[11px] text-slate-300 font-mono border border-white/[0.08]">
                {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)
              </div>
            </div>
          )}
        </div>

        {/* Inspection Details Section */}
        <div className="bento-card p-6 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Metadata Lapangan & Titik Struktur
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Lokasi / Objek Struktur *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddLocation(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Tambah Baru
                </button>
              </div>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-[#0d121f]">
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Inspector Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Inspektor Lapangan *
                </span>
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                placeholder="Contoh: Ir. Hendra Pratama, S.T."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Catatan Lapangan / Gejala Awal
              </span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan kondisi visual awal, beban operasional, atau area spesifik..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080d] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit Action Strip */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isScanning || !selectedFile}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all ${
              isScanning || !selectedFile
                ? 'bg-white/[0.04] text-slate-500 border border-white/[0.06] cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sedang Memindai...
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" /> Mulai Analisis Grid ResNet-18
              </>
            )}
          </button>
        </div>

      </form>

      {/* Standard Severity Scale & Threshold Reference Guide */}
      <SeverityScaleGuide />

      {/* Scanning Modal Animation */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card border border-blue-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="w-full h-full rounded-full flex items-center justify-center text-blue-400">
                <Cpu className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">AI Vision Scanner Aktif</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sedang memproses petak citra dengan resolusi penuh...
              </p>
            </div>

            {/* Stepper list */}
            <div className="space-y-2 text-left">
              {scanSteps.map((step, idx) => {
                const isCompleted = idx < scanStep;
                const isCurrent = idx === scanStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                      isCompleted ? 'text-emerald-400 bg-emerald-500/10' :
                      isCurrent ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin text-blue-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] flex-shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Location Modal */}
      {showAddLocation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Tambah Lokasi Objek Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddLocation(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Struktur *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jembatan Ampera - Pier 2"
                  value={newLocForm.name}
                  onChange={(e) => setNewLocForm({ ...newLocForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe *</label>
                  <select
                    value={newLocForm.type}
                    onChange={(e) => setNewLocForm({ ...newLocForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Jembatan">Jembatan</option>
                    <option value="Gedung">Gedung</option>
                    <option value="Bendungan">Bendungan</option>
                    <option value="Jalan Tol">Jalan Tol</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Kota</label>
                  <input
                    type="text"
                    placeholder="Palembang, Sumsel"
                    value={newLocForm.address}
                    onChange={(e) => setNewLocForm({ ...newLocForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLocForm.latitude}
                    onChange={(e) => setNewLocForm({ ...newLocForm, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLocForm.longitude}
                    onChange={(e) => setNewLocForm({ ...newLocForm, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLocation(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
