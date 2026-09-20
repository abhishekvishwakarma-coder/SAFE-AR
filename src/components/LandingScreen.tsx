import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { DEFAULT_WORKER_CREDENTIALS, DEFAULT_ADMIN_CREDENTIALS } from '../data/authData';
import {
  ShieldCheck,
  HardHat,
  Building2,
  ChevronRight,
  Globe2,
  Smartphone,
  Award,
  KeyRound,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface LandingScreenProps {
  language: Language;
  isWorkerLoggedIn?: boolean;
  isAdminLoggedIn?: boolean;
  workerName?: string;
  adminName?: string;
  onStartTraining: () => void;
  onOpenAdmin: () => void;
  onOpenLanguageModal: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  language,
  isWorkerLoggedIn = false,
  isAdminLoggedIn = false,
  workerName,
  adminName,
  onStartTraining,
  onOpenAdmin,
  onOpenLanguageModal,
}) => {
  const t = translations[language];

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 sm:py-12 px-4 max-w-4xl mx-auto">
      {/* Industrial Safety Initiative Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold tracking-wider uppercase shadow-xs mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Jharkhand Industrial Safety System</span>
        <span className="text-blue-300">•</span>
        <span className="text-blue-700 font-semibold">DGMS Regulated Application</span>
      </div>

      {/* Main Title & Subtitle: SAFEAR App */}
      <div className="text-center space-y-3 max-w-2xl">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-900/20">
            SA
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            SAFE<span className="text-blue-600">AR</span>
          </h1>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-700">
          AR-Based Industrial Safety Training &amp; Certification App
        </h2>

        <p className="text-sm font-medium text-slate-500">
          Vocational Safety &amp; Compliance System for Jharkhand&apos;s Mining &amp; Manufacturing Sector
        </p>

        <p className="text-base text-blue-900 font-medium italic pt-1">
          &ldquo;Safer Workers. Smarter Training. Digital Certification.&rdquo;
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full max-w-md">
        <button
          type="button"
          id="landing-start-training-btn"
          onClick={() => {
            sfx.playSuccess();
            onStartTraining();
          }}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <HardHat className="w-4 h-4" />
          <span>{isWorkerLoggedIn ? `RESUME (${workerName || 'WORKER'})` : 'WORKER APP LOGIN'}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>

        <button
          type="button"
          id="landing-admin-dashboard-btn"
          onClick={() => {
            sfx.playTargetLock();
            onOpenAdmin();
          }}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{isAdminLoggedIn ? 'ADMIN PORTAL' : 'ADMIN PORTAL LOGIN'}</span>
        </button>
      </div>

      {/* App Credentials Card for Both Portals */}
      <div className="mt-8 w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">System Login Credentials</h3>
              <p className="text-[11px] text-slate-500">Preset IDs &amp; Passwords for Worker App &amp; Government Admin Portal</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Active Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Worker Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                <HardHat className="w-3.5 h-3.5 text-blue-600" />
                <span>Worker App</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">BCCL Dhanbad</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-sans">Login ID:</span>
                <span className="font-bold text-slate-900">{DEFAULT_WORKER_CREDENTIALS.loginId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-sans">Password:</span>
                <span className="font-bold text-slate-900">{DEFAULT_WORKER_CREDENTIALS.password}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sfx.playSuccess();
                onStartTraining();
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Go to Worker Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Building2 className="w-3.5 h-3.5 text-blue-800" />
                <span>Admin &amp; Inspector Portal</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">DGMS State HQ</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-sans">Login ID:</span>
                <span className="font-bold text-slate-900">{DEFAULT_ADMIN_CREDENTIALS.loginId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-sans">Password:</span>
                <span className="font-bold text-slate-900">{DEFAULT_ADMIN_CREDENTIALS.password}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sfx.playTargetLock();
                onOpenAdmin();
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">
            Smartphone AR (No Headsets)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Accessible on standard Android phones for frontline mining and industrial operators.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-orange-600 flex items-center justify-center font-semibold">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">
            Regional Multilingual
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Interactive voice &amp; visual training in Hindi, Santali (ᱚᱞ ᱪᱤᱠᱤ), and English.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">
            QR Digital Certification
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tamper-evident verification registry for DGMS on-site compliance audits.
          </p>
        </div>
      </div>

      {/* Official System Footer */}
      <div className="mt-8 text-center text-xs text-slate-400 max-w-lg leading-relaxed">
        SAFEAR Industrial Safety Training &amp; Certification Platform — Operational compliance system for Jharkhand&apos;s mining &amp; manufacturing workforce.
      </div>
    </div>
  );
};

