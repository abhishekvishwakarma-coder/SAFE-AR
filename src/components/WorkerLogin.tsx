import React, { useState } from 'react';
import { Language, WorkerProfile } from '../types';
import { translations } from '../data/translations';
import {
  DEFAULT_WORKER_CREDENTIALS,
  registeredWorkers,
} from '../data/authData';
import {
  HardHat,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Globe2,
  KeyRound,
  AlertCircle,
  Building2,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface WorkerLoginProps {
  language: Language;
  onLoginSuccess: (worker: WorkerProfile) => void;
  onOpenLanguageModal: () => void;
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export const WorkerLogin: React.FC<WorkerLoginProps> = ({
  language,
  onLoginSuccess,
  onOpenLanguageModal,
  onNavigateHome,
  onNavigateAdmin,
}) => {
  const t = translations[language];

  const [loginId, setLoginId] = useState<string>(DEFAULT_WORKER_CREDENTIALS.loginId);
  const [password, setPassword] = useState<string>(DEFAULT_WORKER_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick autofill preset
  const handleSelectPreset = (workerId: string) => {
    sfx.playTargetLock();
    const found = registeredWorkers.find((w) => w.loginId === workerId);
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
      setErrorMessage(
        language === 'hi'
          ? 'कृपया अपना वर्कर आईडी या मोबाइल नंबर दर्ज करें'
          : language === 'sat'
          ? 'ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ ᱚᱞ ᱢᱮ'
          : 'Please enter your Worker ID or Mobile Number'
      );
      return;
    }

    if (!cleanPass) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया अपना पासवर्ड दर्ज करें'
          : language === 'sat'
          ? 'ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱯᱟᱥᱣᱟᱨᱰ ᱚᱞ ᱢᱮ'
          : 'Please enter your Security Password'
      );
      return;
    }

    setIsLoading(true);

    // Simulate verification check
    setTimeout(() => {
      setIsLoading(false);

      // Check registered workers
      const matched = registeredWorkers.find(
        (w) =>
          (w.loginId.toLowerCase() === cleanId.toLowerCase() ||
            w.phone === cleanId ||
            cleanId === 'worker') &&
          w.password === cleanPass
      );

      if (matched) {
        sfx.playSuccess();
        if (rememberMe) {
          try {
            localStorage.setItem('safear_worker_auth', 'true');
            localStorage.setItem('safear_worker_id', matched.profile.id);
          } catch {
            // ignore
          }
        }
        onLoginSuccess(matched.profile);
      } else if (cleanPass === 'miner123' || cleanPass === 'safear@2026') {
        // Universal fallback for any custom mining ID
        sfx.playSuccess();
        const fallbackProfile: WorkerProfile = {
          ...registeredWorkers[0].profile,
          id: cleanId.startsWith('EMP') ? cleanId : `EMP-JH-${cleanId.slice(-4) || '9901'}`,
          name: cleanId === 'worker' ? 'Ramesh Hansda' : `Operator ${cleanId}`,
        };
        onLoginSuccess(fallbackProfile);
      } else {
        sfx.playWarning();
        setErrorMessage(
          language === 'hi'
            ? 'अमान्य क्रेडेंशियल! डिफ़ॉल्ट पासवर्ड "miner123" का उपयोग करें।'
            : language === 'sat'
            ? 'ᱵᱟᱹᱲᱤᱡ ᱠᱨᱮᱰᱮᱱᱥᱤᱭᱟᱞ! "miner123" ᱵᱮᱵᱷᱟᱨ ᱢᱮ'
            : 'Invalid credentials. Use default password "miner123" or click demo quick login.'
        );
      }
    }, 350);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Top Header Controls: Back & Language */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
        >
          <Globe2 className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ᱥᱟᱱᱛᱟᱲᱤ'}
          </span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Top Decorative Industrial Gradient Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-amber-500" />

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-xs mb-3">
            <HardHat className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold tracking-wide uppercase">
            <span>{t.workerApp}</span>
            <span className="text-blue-300">•</span>
            <span>Jharkhand Mining</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'hi'
              ? 'खनन सुरक्षा लॉगिन'
              : language === 'sat'
              ? 'ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱚᱜᱤᱱ'
              : 'Worker Safety Login'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'एआर प्रशिक्षण और डिजिटल सुरक्षा प्रमाणन के लिए लॉगिन करें'
              : language === 'sat'
              ? 'AR ᱥᱮᱪᱮᱫ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱟᱹᱜᱤᱫ ᱞᱚᱜᱤᱱ ᱢᱮ'
              : 'Sign in to access AR simulations & safety credentials'}
          </p>
        </div>

        {/* Credentials Reminder Box (Requested: login id & password) */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 mb-5 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-950">
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Worker Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1.5 bg-white/80 p-2 rounded-xl border border-amber-200/80 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">Login ID:</span>
              <span className="font-bold text-slate-800">{DEFAULT_WORKER_CREDENTIALS.loginId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">Password:</span>
              <span className="font-bold text-slate-800">{DEFAULT_WORKER_CREDENTIALS.password}</span>
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

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Worker ID / Phone Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'hi'
                ? 'श्रमिक आईडी या मोबाइल नंबर'
                : language === 'sat'
                ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ / ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ'
                : 'Worker ID or Mobile'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="worker-login-id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="EMP-JH-8832"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'hi'
                ? 'सुरक्षा पासवर्ड / पिन'
                : language === 'sat'
                ? 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱟᱥᱣᱟᱨᱰ'
                : 'Security Password / PIN'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="worker-password"
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

          {/* Remember me & Offline check */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Remember on this device</span>
            </label>

            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="worker-login-submit-btn"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-pulse">Authenticating...</span>
            ) : (
              <>
                <HardHat className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? 'सुरक्षा पोर्टल में प्रवेश करें'
                    : language === 'sat'
                    ? 'ᱵᱚᱞᱚᱱ ᱢᱮ'
                    : 'LOGIN TO WORKER APP'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Worker Selectors */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Or Switch Demo Worker Account
          </p>

          <div className="space-y-1.5">
            {registeredWorkers.map((w) => {
              const isSelected = loginId === w.loginId;
              return (
                <button
                  key={w.loginId}
                  type="button"
                  onClick={() => handleSelectPreset(w.loginId)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                      {w.profile.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight">{w.profile.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[210px]">
                        {w.loginId} • {w.profile.company.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 px-2 py-0.5 rounded bg-white border border-blue-100">
                    Auto-Fill
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Switch to Admin Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onNavigateAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Government Officer or Inspector? Access Admin Portal →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
