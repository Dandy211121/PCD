import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import InspectionDetail from './pages/InspectionDetail';
import HistoryList from './pages/HistoryList';
import { Shield, Cpu } from 'lucide-react';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Navigation Header */}
        <Navbar />

        {/* Main Application Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-inspection" element={<NewInspection />} />
            <Route path="/inspection/:id" element={<InspectionDetail />} />
            <Route path="/history" element={<HistoryList />} />
          </Routes>
        </main>

        {/* Sleek Engineering Telemetry Footer */}
        <footer className="border-t border-white/[0.08] bg-dark-950 py-5 text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-slate-300">Crack Inspection Platform</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">AI Structural Vision v1.0</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                ResNet-18 Slicing Engine
              </span>
              <span className="text-slate-600">/</span>
              <span>FastAPI & PyTorch</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
