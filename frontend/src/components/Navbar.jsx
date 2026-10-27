import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Plus, 
  History, 
  User as UserIcon,
  Menu,
  X,
  Search
} from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = authService.getCurrentUser() || { full_name: 'Ir. Hendra Pratama', role: 'Lead Inspector' };

  const navLinks = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/new-inspection', label: 'Audit Baru', icon: Plus },
    { to: '/history', label: 'Arsip Riwayat', icon: History },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/85 backdrop-blur-xl border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 border border-blue-400/40 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                CRACKINSPECT
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-medium px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/[0.08]">
                v2.4
              </span>
            </div>
          </Link>

          {/* Segmented Linear-Style Tab Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-[#0d121f] border border-white/[0.06] shadow-inner" aria-label="Navigasi Utama">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#1c2438] text-white shadow-sm border border-white/[0.08]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Operator Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Audit Button */}
            <Link
              to="/new-inspection"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Audit Foto</span>
            </Link>

            {/* Status Telemetry Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0d121f] border border-white/[0.06] text-xs font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-slate-400">ResNet-18</span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <div className="w-7 h-7 rounded-lg bg-[#1c2438] border border-white/[0.08] flex items-center justify-center text-slate-300 font-mono text-xs font-bold">
                HP
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200 leading-none">{currentUser.full_name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{currentUser.role}</div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-[#090d16] border-b border-white/[0.08]">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  active
                    ? 'bg-[#1c2438] text-white border border-white/[0.08]'
                    : 'text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
