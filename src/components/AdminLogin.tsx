import React, { useState } from 'react';
import { AdminProfile } from '../types';
import {
  DEFAULT_ADMIN_CREDENTIALS,
  registeredAdmins,
} from '../data/authData';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  HardHat,
  Home,
  CheckCircle2,
  FileCheck,
  BadgeCheck,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminProfile) => void;
  onNavigateHome: () => void;
  onNavigateWorker: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
  onNavigateWorker,
}) => {
  const [loginId, setLoginId] = useState<string>(DEFAULT_ADMIN_CREDENTIALS.loginId);
  const [password, setPassword] = useState<string>(DEFAULT_ADMIN_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedCircle, setSelectedCircle] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectPreset = (adminId: string) => {
    sfx.playTargetLock();
    const found = registeredAdmins.find((a) => a.loginId === adminId);
    if (found) {
      setLoginId(found.loginId);
      setPassword(found.password);
      setErrorMessage(null);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = loginId.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your Official Officer ID or Email.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your Security Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const matched = registeredAdmins.find(
        (a) =>
          (a.loginId.toLowerCase() === cleanId.toLowerCase() ||
            a.profile.email.toLowerCase() === cleanId.toLowerCase() ||
            cleanId.toLowerCase() === 'admin') &&
          a.password === cleanPass
      );

      if (matched) {
        sfx.playSuccess();
        if (rememberMe) {
          try {
            localStorage.setItem('safear_admin_auth', 'true');
            localStorage.setItem('safear_admin_id', matched.profile.id);
          } catch {
            // ignore
          }
        }
        onLoginSuccess(matched.profile);
      } else if (cleanPass === 'admin123' || cleanPass === 'safear@admin2026') {
        // Universal fallback for any officer ID
        sfx.playSuccess();
        const fallbackProfile: AdminProfile = {
          ...registeredAdmins[0].profile,
          id: cleanId.toUpperCase(),
          name: cleanId === 'admin' ? 'Inspector General' : `Officer ${cleanId}`,
        };
        onLoginSuccess(fallbackProfile);
      } else {
        sfx.playWarning();
        setErrorMessage('Authentication failed. Default password is "admin123". Please check credentials.');
      }
    }, 400);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>DGMS Secure Registry</span>
        </div>
      </div>

      {/* Main Admin Card */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Top Header Dark Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-900" />

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10 mb-3">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wide uppercase">
            <span>GOVERNMENT OF JHARKHAND</span>
            <span className="text-slate-300">•</span>
            <span>DGMS PORTAL</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Admin &amp; Inspector Portal
          </h1>
          <p className="text-xs text-slate-500">
            Directorate General of Mines Safety • State Compliance &amp; Audit Registry
          </p>
        </div>

        {/* Credentials Reminder Box (Requested: login id & password) */}
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-3.5 mb-5 text-xs text-blue-950">
          <div className="flex items-center justify-between font-bold mb-1.5">
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Admin Portal Credentials:</span>
            </div>
            <span className="text-[10px] bg-blue-200/60 text-blue-900 px-1.5 py-0.5 rounded font-mono font-semibold">
              Authorized Access
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-white/90 p-2.5 rounded-xl border border-blue-200/80 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans font-medium">Login ID:</span>
              <span className="font-bold text-slate-900">{DEFAULT_ADMIN_CREDENTIALS.loginId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans font-medium">Password:</span>
              <span className="font-bold text-slate-900">{DEFAULT_ADMIN_CREDENTIALS.password}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Officer ID / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Inspector ID / Official Gov Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="admin-login-id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="DGMS-ADMIN-01"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Portal Access Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Jurisdiction / Circle Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mining Jurisdiction / Circle
            </label>
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Jharkhand Statewide Safety Jurisdiction (HQ Ranchi)</option>
              <option value="dhanbad">Dhanbad Colliery &amp; Coking Coal Circle</option>
              <option value="bokaro">Bokaro Industrial &amp; Steel Raw Material Grid</option>
              <option value="chaibasa">Chaibasa Iron Ore &amp; Chromite Mining Zone</option>
              <option value="hazaribagh">Hazaribagh &amp; Ramgarh Coal Preparation Circle</option>
            </select>
          </div>

          {/* Remember me & Security Banner */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded border-slate-300 focus:ring-blue-800"
              />
              <span>Remember administrator session</span>
            </label>

            <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>TLS-256 Encrypted</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-login-submit-btn"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-slate-900 active:bg-black text-white font-bold text-sm shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-pulse">Verifying Credentials...</span>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                <span>SIGN IN TO ADMIN PORTAL</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Officer Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Or Switch Official Officer Account
          </p>

          <div className="space-y-1.5">
            {registeredAdmins.slice(0, 2).map((a) => {
              const isSelected = loginId === a.loginId;
              return (
                <button
                  key={a.loginId}
                  type="button"
                  onClick={() => handleSelectPreset(a.loginId)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {a.profile.name.split(' ')[1]?.[0] || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight">{a.profile.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[210px]">
                        {a.loginId} • {a.profile.designation}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 px-2 py-0.5 rounded bg-white border border-blue-200">
                    Auto-Fill
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Switch to Worker Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onNavigateWorker}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <HardHat className="w-3.5 h-3.5 text-blue-600" />
            <span>Looking for Worker AR Simulation App? Go to Worker Login →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
