import React, { useState } from 'react';
import { Language, WorkerProfile, AdminProfile } from '../types';
import { translations } from '../data/translations';
import {
  DEFAULT_WORKER_CREDENTIALS,
  DEFAULT_ADMIN_CREDENTIALS,
  registeredWorkers,
  registeredAdmins,
} from '../data/authData';
import {
  HardHat,
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Check,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface LandingScreenProps {
  language: Language;
  onWorkerLoginSuccess: (worker: WorkerProfile) => void;
  onAdminLoginSuccess: (admin: AdminProfile) => void;
  onOpenLanguageModal: () => void;
  initialRole?: 'worker' | 'admin';
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  language,
  onWorkerLoginSuccess,
  onAdminLoginSuccess,
  onOpenLanguageModal,
  initialRole = 'worker',
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'worker' | 'admin'>(initialRole);

  // Worker form state
  const [workerId, setWorkerId] = useState<string>(DEFAULT_WORKER_CREDENTIALS.loginId);
  const [workerPass, setWorkerPass] = useState<string>(DEFAULT_WORKER_CREDENTIALS.password);
  const [showWorkerPass, setShowWorkerPass] = useState<boolean>(false);
  const [workerError, setWorkerError] = useState<string | null>(null);

  // Admin form state
  const [adminId, setAdminId] = useState<string>(DEFAULT_ADMIN_CREDENTIALS.loginId);
  const [adminPass, setAdminPass] = useState<string>(DEFAULT_ADMIN_CREDENTIALS.password);
  const [showAdminPass, setShowAdminPass] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Handle worker login submit
  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerError(null);

    const cleanId = workerId.trim();
    const cleanPass = workerPass.trim();

    if (!cleanId || !cleanPass) {
      setWorkerError(t.loginErrorMissing);
      return;
    }

    const matched = registeredWorkers.find(
      (w) =>
        (w.loginId.toLowerCase() === cleanId.toLowerCase() ||
          w.phone === cleanId ||
          cleanId.toLowerCase() === 'worker') &&
        w.password === cleanPass
    );

    if (matched) {
      sfx.playSuccess();
      try {
        localStorage.setItem('safear_worker_auth', 'true');
        localStorage.setItem('safear_worker_id', matched.profile.id);
      } catch {
        // ignore
      }
      onWorkerLoginSuccess(matched.profile);
    } else if (cleanPass === 'miner123') {
      sfx.playSuccess();
      const fallback: WorkerProfile = {
        ...registeredWorkers[0].profile,
        id: cleanId.toUpperCase(),
      };
      onWorkerLoginSuccess(fallback);
    } else {
      sfx.playWarning();
      setWorkerError(t.loginErrorWorker);
    }
  };

  // Handle admin login submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const cleanId = adminId.trim();
    const cleanPass = adminPass.trim();

    if (!cleanId || !cleanPass) {
      setAdminError(t.loginErrorMissing);
      return;
    }

    const matched = registeredAdmins.find(
      (a) =>
        (a.loginId.toLowerCase() === cleanId.toLowerCase() ||
          a.profile.email.toLowerCase() === cleanId.toLowerCase() ||
          cleanId.toLowerCase() === 'admin') &&
        a.password === cleanPass
    );

    if (matched) {
      sfx.playSuccess();
      try {
        localStorage.setItem('safear_admin_auth', 'true');
        localStorage.setItem('safear_admin_id', matched.profile.id);
      } catch {
        // ignore
      }
      onAdminLoginSuccess(matched.profile);
    } else if (cleanPass === 'admin123') {
      sfx.playSuccess();
      const fallback: AdminProfile = {
        ...registeredAdmins[0].profile,
        id: cleanId.toUpperCase(),
      };
      onAdminLoginSuccess(fallback);
    } else {
      sfx.playWarning();
      setAdminError(t.loginErrorAdmin);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 sm:py-10 px-4 max-w-xl mx-auto">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
            MM
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            Minding Mines
          </span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {language === 'hi'
            ? 'खान सुरक्षा महानिदेशालय (डीजीएमएस) पोर्टल'
            : language === 'sat'
            ? 'DGMS ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱳᱨᱴᱟᱞ'
            : 'Directorate General of Mines Safety (DGMS) Portal'}
        </p>

        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          {t.portalDescription}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Role Toggle Bar: Worker Login vs Admin Login */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            id="tab-worker-login"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('worker');
            }}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'worker'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-4 h-4 text-blue-700" />
            <span>{t.workerLogin}</span>
          </button>

          <button
            type="button"
            id="tab-admin-login"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('admin');
            }}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-800" />
            <span>{t.adminLogin}</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          {activeTab === 'worker' ? (
            /* Worker Login Form */
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t.workerPortalTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.workerPortalDesc}
                </p>
              </div>

              {workerError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{workerError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700" htmlFor="worker-id-input">
                  {t.employeeId}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="worker-id-input"
                    type="text"
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    placeholder="e.g. EMP-JH-8832"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700" htmlFor="worker-password-input">
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="worker-password-input"
                    type={showWorkerPass ? 'text' : 'password'}
                    value={workerPass}
                    onChange={(e) => setWorkerPass(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-9 pr-10 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowWorkerPass((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showWorkerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="worker-submit-btn"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{t.signInWorker}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Verified Account Presets */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold uppercase tracking-wider">{t.quickFill}</span>
                  <span>{t.quickFillPasswordNote}</span>
                </div>

                <div className="space-y-1.5">
                  {registeredWorkers.map((w) => (
                    <button
                      key={w.loginId}
                      type="button"
                      onClick={() => {
                        sfx.playTargetLock();
                        setWorkerId(w.loginId);
                        setWorkerPass(w.password);
                        setWorkerError(null);
                      }}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{w.profile.name}</span>
                        <span className="text-slate-500 text-[11px] block">{w.profile.role}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {w.loginId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Admin Login Form */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t.adminPortalTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.adminPortalDesc}
                </p>
              </div>

              {adminError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700" htmlFor="admin-id-input">
                  {t.officerId}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-id-input"
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. DGMS-ADMIN-01"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700" htmlFor="admin-password-input">
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password-input"
                    type={showAdminPass ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-9 pr-10 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="admin-submit-btn"
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{t.signInAdmin}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Verified Admin Presets */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold uppercase tracking-wider">{t.quickFill}</span>
                  <span>Password: admin123</span>
                </div>

                <div className="space-y-1.5">
                  {registeredAdmins.map((a) => (
                    <button
                      key={a.loginId}
                      type="button"
                      onClick={() => {
                        sfx.playTargetLock();
                        setAdminId(a.loginId);
                        setAdminPass(a.password);
                        setAdminError(null);
                      }}
                      className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{a.profile.name}</span>
                        <span className="text-slate-500 text-[11px] block">{a.profile.designation}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {a.loginId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Official Registry Footer */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-md">
        {language === 'hi'
          ? 'माइंडिंग माइंस · खान सुरक्षा महानिदेशालय कार्यबल सत्यापन नेटवर्क'
          : language === 'sat'
          ? 'Minding Mines · DGMS ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱹᱵᱤᱛ ᱱᱮᱴᱣᱚᱨᱠ'
          : 'Minding Mines · Directorate General of Mines Safety compliance network for colliery workforce verification.'}
      </div>
    </div>
  );
};
