import React, { useState } from 'react';
import { TrainingModule, Language } from '../types';
import { modulesData } from '../data/mockData';
import { translations } from '../data/translations';
import { ARSimulationView } from './ARSimulationView';
import {
  Camera,
  Crosshair,
  Compass,
  ArrowLeft,
  Flame,
  AlertTriangle,
  FileCheck2,
  HardHat,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface ARSimulationScreenProps {
  language: Language;
  initialModuleId?: string;
  onBackToDashboard: () => void;
  onProceedToAssessment: (moduleId: string) => void;
  onStartWorkerApp: () => void;
}

export const ARSimulationScreen: React.FC<ARSimulationScreenProps> = ({
  language,
  initialModuleId = 'fire-safety',
  onBackToDashboard,
  onProceedToAssessment,
  onStartWorkerApp,
}) => {
  const t = translations[language];
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState<boolean>(false);

  const activeModule: TrainingModule =
    modulesData.find((m) => m.id === selectedModuleId) || modulesData[0];

  return (
    <div className="w-full flex flex-col space-y-4 pb-8 max-w-5xl mx-auto">
      {/* Studio Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.arScreenTitle}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600" />
                  {language === 'hi' ? 'लाइव कैमरा तैयार' : language === 'sat' ? 'ᱠᱮᱢᱮᱨᱟ ᱥᱟᱯᱲᱟᱣ' : 'LIVE CAMERA READY'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.arScreenSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Guidance Toggle & Back button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              id="ar-guidance-toggle-btn"
              onClick={() => {
                sfx.playTargetLock();
                setIsGuidanceOpen((prev) => !prev);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {isGuidanceOpen
                  ? t.hideTips
                  : t.cameraTips}
              </span>
            </button>

            <button
              type="button"
              id="ar-screen-back-btn"
              onClick={() => {
                sfx.playTargetLock();
                onBackToDashboard();
              }}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.dashboard}</span>
            </button>
          </div>
        </div>

        {/* Camera & AR Instructions Drawer */}
        {isGuidanceOpen && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200 text-xs">
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>
                  {language === 'hi' ? '1. कैमरा लक्ष्य' : language === 'sat' ? '1. ᱠᱮᱢᱮᱨᱟ ᱴᱟᱨᱜᱮᱴ' : '1. Camera Aiming'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {language === 'hi'
                  ? 'ब्राउज़र कैमरा अनुमति दें। अपने पिछले कैमरे को खदान के फर्श या दीवार की ओर लक्षित करें।'
                  : language === 'sat'
                  ? 'ᱠᱮᱢᱮᱨᱟ ᱦᱩᱠᱩᱢ ᱮᱢ ᱢᱮ᱾ ᱯᱷᱳᱱ ᱨᱮᱱᱟᱜ ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ ᱚᱛ ᱥᱮ ᱠᱟᱸᱛ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ᱾'
                  : 'Allow browser camera permission. Point your rear camera at floor or wall to detect statutory mine hazards.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>
                  {language === 'hi' ? '2. जाइरो व 3D झुकाव' : language === 'sat' ? '2. 3D ᱦᱤᱞᱟᱹᱣ ᱟᱨ ᱡᱟᱭᱨᱳ' : '2. 3D Tilt & Gyro'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {language === 'hi'
                  ? 'डिवाइस को हिलाने से वर्चुअल क्षितिज घूमता है। डेस्कटॉप पर माउस ड्रैग करें। केंद्र बिंदु से खतरे पर निशाना लगाएं।'
                  : language === 'sat'
                  ? 'ᱯᱷᱳᱱ ᱦᱤᱞᱟᱹᱣ ᱞᱮᱠᱷᱟᱱ AR ᱪᱤᱛᱟᱹᱨ ᱟᱹᱪᱩᱨᱚᱜ-ᱟ᱾ ᱛᱟᱞᱟ ᱴᱟᱨᱜᱮᱴ ᱵᱤᱯᱚᱫᱽ ᱥᱮᱫ ᱥᱚᱡᱷᱮ ᱢᱮ᱾'
                  : 'Tilting device navigates 3D space. On desktop, drag feed to pan. Aim central reticle to lock onto danger.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'hi' ? '3. डीजीएमएस प्रमाणन' : language === 'sat' ? '3. DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ' : '3. DGMS Certification'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {language === 'hi'
                  ? 'एआर आपातकालीन परिदृश्य पूरा करें, फिर आधिकारिक डिजिटल क्यूआर क्रेडेंशियल पाने हेतु योग्यता परीक्षा दें।'
                  : language === 'sat'
                  ? 'AR ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ ᱢᱮ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ QR ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱵᱤᱱᱤᱰ ᱮᱢ ᱢᱮ᱾'
                  : 'Complete AR scenarios, then take verified evaluation to earn official Government of Jharkhand QR credentials.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Module Selector Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
            {language === 'hi' ? 'प्रशिक्षण मॉड्यूल:' : language === 'sat' ? 'ᱥᱮᱪᱮᱫ ᱦᱟᱹᱴᱤᱧ:' : 'Training Module:'}
          </span>
          <div className="flex items-center gap-2">
            {modulesData.map((m) => {
              const isSelected = m.id === selectedModuleId;
              const isFire = m.id === 'fire-safety';
              return (
                <button
                  key={m.id}
                  type="button"
                  id={`screen-select-module-${m.id}`}
                  onClick={() => {
                    sfx.playTargetLock();
                    setSelectedModuleId(m.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isFire ? (
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{isFire ? t.fireModuleTitle : t.gasModuleTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jump to Assessment button */}
        <button
          type="button"
          id="screen-take-exam-btn"
          onClick={() => {
            sfx.playSuccess();
            onProceedToAssessment(activeModule.id);
          }}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{t.startAssessment}</span>
        </button>
      </div>

      {/* Interactive AR Viewport Container (75% Camera / 25% Quiz) */}
      <div className="w-full rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <ARSimulationView
          key={activeModule.id}
          module={activeModule}
          language={language}
          onBackToDashboard={onBackToDashboard}
          onCompleteSimulation={() => onProceedToAssessment(activeModule.id)}
          onSelectModule={(modId) => setSelectedModuleId(modId)}
          isDedicatedScreen={true}
          onProceedToAssessment={(modId) => onProceedToAssessment(modId)}
        />
      </div>

      {/* Safety Compliance Footer note */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-2 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {language === 'hi'
              ? 'खान सुरक्षा महानिदेशालय (डीजीएमएस) विनियम 1961 धारा 114 के अनुसार'
              : language === 'sat'
              ? 'DGMS ᱱᱤᱭᱚᱢ 1961 ᱦᱟᱹᱴᱤᱧ § 114 ᱞᱮᱠᱟᱛᱮ'
              : 'Compliant with Directorate General of Mines Safety (DGMS) Regulations 1961 § 114'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {language === 'hi'
              ? 'कैमरा डेटा केवल डिवाइस पर सुरक्षित संसाधित होता है'
              : language === 'sat'
              ? 'ᱠᱮᱢᱮᱨᱟ ᱰᱮᱴᱟ ᱯᱷᱳᱱ ᱨᱮᱜᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱᱟ'
              : 'Camera feed processed 100% locally on device'}
          </span>
          <span>·</span>
          <span className="text-emerald-700 font-semibold">ARCore SLAM Active</span>
        </div>
      </div>
    </div>
  );
};
