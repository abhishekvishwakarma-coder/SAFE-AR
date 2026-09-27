import React from 'react';
import { WorkerProfile, Language } from '../types';
import { translations } from '../data/translations';
import { modulesData } from '../data/mockData';
import { VisualProgressTracker } from './VisualProgressTracker';
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
  Camera,
  Crosshair,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface WorkerDashboardProps {
  worker: WorkerProfile;
  language: Language;
  onOpenLanguageModal: () => void;
  onStartModule: (moduleId: string) => void;
  onViewCertificate: (certId?: string) => void;
  onOpenQRVerification: (certId?: string) => void;
  onOpenARSimulation?: () => void;
  onLogout?: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  worker,
  language,
  onOpenLanguageModal,
  onStartModule,
  onViewCertificate,
  onOpenQRVerification,
  onOpenARSimulation,
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
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
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
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Worker Greeting & ID Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                <HardHat className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-emerald-600 border border-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  {language === 'hi' ? 'श्रमिक आईडी:' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ:' : 'Worker ID:'}
                </span>
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {worker.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {t.welcome}, {worker.name}
              </h2>
              <p className="text-xs text-slate-500">
                {worker.role} · <span className="text-slate-700 font-medium">{worker.company}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {worker.mineBlock}, {worker.location}
              </p>
            </div>
          </div>
        </div>

        {/* Offline Status Badge */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-xs bg-emerald-600 inline-block" />
            <span className="text-[11px] sm:text-xs">
              {t.offlineStatus}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {language === 'hi' ? 'स्थानीय खदान डेटा सुरक्षित' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱰᱮᱴᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ' : 'Local Mine Cache Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progress Tracker: Overall Completion & Individual Module Mastery */}
      <VisualProgressTracker
        worker={worker}
        language={language}
        modules={modulesData}
        onStartModule={onStartModule}
        onViewCertificate={onViewCertificate}
        onOpenARSimulation={onOpenARSimulation}
      />

      {/* AR Camera Simulator Studio Quick Launch Card (75% Camera / 25% Quiz) */}
      {onOpenARSimulation && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'hi' ? 'एआर सिमुलेशन स्टूडियो (75/25)' : language === 'sat' ? 'AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱥᱴᱩᱰᱤᱭᱳ' : 'AR Simulation Screen (75/25)'}
                </h4>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {language === 'hi' ? 'केवल पिछला कैमरा' : language === 'sat' ? 'ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ' : 'REAR CAMERA'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {language === 'hi'
                  ? '75% कैमरा व 25% प्रश्नोत्तरी, लैंडस्केप/पोर्ट्रेट लेआउट एवं कार्यक्षेत्र स्कैनिंग'
                  : language === 'sat'
                  ? '75% ᱠᱮᱢᱮᱨᱟ ᱟᱨ 25% ᱠᱩᱠᱞᱤ, ᱞᱮᱱᱰᱥᱠᱮᱯ/ᱯᱚᱨᱴᱨᱮᱴ ᱥᱟᱶ ᱠᱷᱟᱫᱟᱱ ᱥᱠᱮᱱ'
                  : 'Launch 75% camera simulator with SLAM surface tracking, 25% quiz sheet & orientation controls'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="dashboard-open-ar-btn"
            onClick={() => {
              sfx.playSuccess();
              onOpenARSimulation();
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'शुरू करें' : language === 'sat' ? 'ᱮᱦᱚᱵ' : 'Launch'}</span>
          </button>
        </div>
      )}

      {/* Training Modules Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'hi' ? 'व्यावहारिक एआर सुरक्षा मॉड्यूल' : language === 'sat' ? 'AR ᱥᱩᱨᱚᱠᱷᱭᱟ ᱦᱟᱹᱴᱤᱧ' : 'Interactive AR Safety Modules'}
          </h3>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {language === 'hi' ? 'डीजीएमएस अनुपालन' : language === 'sat' ? 'DGMS ᱱᱤᱭᱚᱢ' : 'DGMS Compliant'}
          </span>
        </div>

        {modulesData.map((module) => {
          const isCompleted = worker.completedModules.includes(module.id);
          const score = worker.scores[module.id];
          const isFire = module.id === 'fire-safety';

          return (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 transition-colors shadow-xs overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Safety Icon */}
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
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
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
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
                        <span>·</span>
                        <span>
                          {module.scenarios.length}{' '}
                          {language === 'hi' ? 'एआर परिदृश्य' : language === 'sat' ? 'AR ᱫᱟᱹᱭᱠᱟᱹ' : 'AR Scenarios'}
                        </span>
                        {score !== undefined && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-bold">
                              {language === 'hi' ? 'अंक:' : language === 'sat' ? 'ᱚᱨᱡᱚ:' : 'Score:'} {score}%
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
                    <span>
                      {language === 'hi'
                        ? '≥70% अंक पर वैधानिक प्रमाणन'
                        : language === 'sat'
                        ? '≥70% ᱨᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ'
                        : 'Statutory Certification on ≥70%'}
                    </span>
                  </div>

                  <button
                    type="button"
                    id={`start-module-btn-${module.id}`}
                    onClick={() => {
                      sfx.playTargetLock();
                      onStartModule(module.id);
                    }}
                    className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.myCertificates}
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {language === 'hi' ? 'छेड़छाड़-मुक्त क्यूआर' : language === 'sat' ? 'QR ᱴᱮᱢᱯᱟᱨ-ᱯᱨᱩᱯᱷ' : 'QR Tamper-Proof'}
          </span>
        </div>

        {worker.certificates.length > 0 ? (
          <div className="space-y-2">
            {worker.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {cert.moduleId === 'fire-safety' ? t.fireModuleTitle : t.gasModuleTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {cert.id} · {language === 'hi' ? 'अंक:' : language === 'sat' ? 'ᱚᱨᱡᱚ:' : 'Score:'}{' '}
                      <span className="text-emerald-700 font-bold">{cert.score}%</span>
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
                    title={t.verifyCertificate}
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
                    {language === 'hi' ? 'देखें' : language === 'sat' ? 'ᱧᱮᱞ' : 'VIEW'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'अग्निशामक अथवा गैस सुरक्षा मॉड्यूल मूल्यांकन पूरा करके आधिकारिक झारखंड सरकार क्यूआर सुरक्षा प्रमाणपत्र प्राप्त करें।'
                : language === 'sat'
                ? 'ᱥᱮᱸᱜᱮᱞ ᱥᱮ ᱵᱤᱥ ᱜᱮᱥ ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱚᱨᱠᱟᱨᱤ QR ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ ᱢᱮ᱾'
                : 'Complete the Fire or Gas safety module assessment to earn your official Government of Jharkhand QR safety certificate.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
