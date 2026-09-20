import React from 'react';
import { WorkerProfile, Language } from '../types';
import { translations } from '../data/translations';
import { modulesData } from '../data/mockData';
import {
  Flame,
  Skull,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  HardHat,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Wifi,
  QrCode,
  Check,
  LogOut,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface WorkerDashboardProps {
  worker: WorkerProfile;
  language: Language;
  onOpenLanguageModal: () => void;
  onStartModule: (moduleId: string) => void;
  onViewCertificate: (certId?: string) => void;
  onOpenQRVerification: (certId?: string) => void;
  onLogout?: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  worker,
  language,
  onOpenLanguageModal,
  onStartModule,
  onViewCertificate,
  onOpenQRVerification,
  onLogout,
}) => {
  const t = translations[language];

  // Calculate completed count
  const completedCount = worker.completedModules.length;
  const totalModules = modulesData.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="w-full flex flex-col space-y-4 pb-10">
      {/* Top Gov Tech Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              JH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                  {t.govtHeader}
                </span>
                <span className="text-[10px] bg-blue-100/70 text-blue-800 font-semibold px-1.5 py-0.5 rounded">
                  DGMS § 114
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-none">
                {t.govtSubheader}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Language Pill */}
            <button
              type="button"
              id="dashboard-lang-btn"
              onClick={() => {
                sfx.playTargetLock();
                onOpenLanguageModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ᱥᱟᱱᱛᱟᱲᱤ'}
              </span>
            </button>

            {onLogout && (
              <button
                type="button"
                id="worker-logout-btn"
                onClick={() => {
                  sfx.playWarning();
                  onLogout();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Log out of Worker Profile"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Worker Greeting & ID Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-orange-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                <HardHat className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  Worker ID:
                </span>
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {worker.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Welcome, {worker.name} 👋
              </h2>
              <p className="text-xs text-slate-500">
                {worker.role} • <span className="text-slate-700 font-medium">{worker.company}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                📍 {worker.mineBlock}, {worker.location}
              </p>
            </div>
          </div>
        </div>

        {/* Offline Status Badge */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-[11px] sm:text-xs">
              {t.offlineStatus}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <span>Local Mine Cache Active</span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.progressTitle}
            </h3>
          </div>
          <span className="text-xs font-bold text-blue-700">
            {completedCount} / {totalModules} Modules Completed ({progressPercent}%)
          </span>
        </div>

        {/* Clean Blue Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
          {modulesData.map((m, idx) => {
            const isDone = worker.completedModules.includes(m.id);
            return (
              <div
                key={m.id}
                className={`h-full rounded-full transition-all duration-500 flex-1 ${
                  isDone ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>{completedCount} {language === 'hi' ? 'मॉड्यूल प्रमाणित' : language === 'sat' ? 'ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ' : 'Modules Certified'}</span>
          <span>{totalModules - completedCount} {language === 'hi' ? 'मॉड्यूल शेष' : language === 'sat' ? 'ᱦᱟᱹᱴᱤᱧ ᱵᱟᱹᱠᱤ' : 'Pending Certification'}</span>
        </div>
      </div>

      {/* Training Modules Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'hi' ? 'व्यावहारिक एआर सुरक्षा मॉड्यूल' : language === 'sat' ? 'AR ᱥᱩᱨᱚᱠᱷᱭᱟ ᱦᱟᱹᱴᱤᱧ' : 'Interactive AR Safety Modules'}
          </h3>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            DGMS Compliant
          </span>
        </div>

        {modulesData.map((module) => {
          const isCompleted = worker.completedModules.includes(module.id);
          const score = worker.scores[module.id];
          const isFire = module.id === 'fire-safety';

          return (
            <div
              key={module.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 transition-all shadow-xs overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Safety Icon with subtle tint */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCompleted
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : isFire
                          ? 'bg-orange-50 border-orange-200 text-orange-600'
                          : 'bg-rose-50 border-rose-200 text-rose-600'
                      }`}
                    >
                      {isFire ? (
                        <Flame className="w-5 h-5" />
                      ) : (
                        <Skull className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          {isFire ? t.fireModuleTitle : t.gasModuleTitle}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? t.certifiedBadge : t.notCompletedBadge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {isFire ? t.fireModuleDesc : t.gasModuleDesc}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {module.estimatedTime}
                        </span>
                        <span>•</span>
                        <span>{module.scenarios.length} AR Scenarios</span>
                        {score !== undefined && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              Score: {score}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Statutory Certification on &ge;70%</span>
                  </div>

                  <button
                    type="button"
                    id={`start-module-btn-${module.id}`}
                    onClick={() => {
                      sfx.playTargetLock();
                      onStartModule(module.id);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{isCompleted ? t.retakeTraining : t.startTraining}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificates Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.myCertificates}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            QR Tamper-Proof
          </span>
        </div>

        {worker.certificates.length > 0 ? (
          <div className="space-y-2">
            {worker.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-blue-300 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {cert.moduleTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {cert.id} • Score: <span className="text-emerald-700 font-bold">{cert.score}%</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`verify-qr-btn-${cert.id}`}
                    onClick={() => {
                      sfx.playTargetLock();
                      onOpenQRVerification(cert.id);
                    }}
                    className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                    title="Scan / Verify QR Code"
                  >
                    <QrCode className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    type="button"
                    id={`view-cert-btn-${cert.id}`}
                    onClick={() => {
                      sfx.playSuccess();
                      onViewCertificate(cert.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Complete the Fire or Gas safety module assessment to earn your official Government of Jharkhand QR safety certificate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
