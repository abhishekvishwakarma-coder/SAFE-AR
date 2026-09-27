import React, { useState } from 'react';
import { WorkerProfile, Language, TrainingModule } from '../types';
import { modulesData } from '../data/mockData';
import { translations } from '../data/translations';
import {
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Crosshair,
  Flame,
  HardHat,
  ShieldCheck,
  Skull,
  Sparkles,
  Target,
  Trophy,
  Zap,
  RotateCcw,
  Check,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { sfx } from '../utils/audio';

export interface VisualProgressTrackerProps {
  worker: WorkerProfile;
  language: Language;
  modules?: TrainingModule[];
  onStartModule: (moduleId: string) => void;
  onViewCertificate?: (certId?: string) => void;
  onOpenARSimulation?: () => void;
}

// Module-specific competency skills breakdown for granular mastery insight
interface SkillBreakdown {
  name: { en: string; hi: string; sat: string };
  weight: number; // percentage weight
}

const MODULE_SKILLS: Record<string, SkillBreakdown[]> = {
  'fire-safety': [
    {
      name: {
        en: 'Methane Flare & Dust Friction Recognition',
        hi: 'मीथेन और कोयला धूल पहचान',
        sat: 'ᱢᱤᱛᱷᱮᱱ ᱟᱨ ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱪᱤᱱᱦᱟᱹᱣ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'ABC Dry Chemical Extinguisher Application',
        hi: 'एबीसी अग्निशामक संचालन (PASS)',
        sat: 'ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱮᱵᱷᱟᱨ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'Intake Escapeway & Blast Door Evacuation',
        hi: 'इंटेक एस्केपवे और ब्लास्ट डोर निकासी',
        sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ ᱟᱨ ᱫᱩᱣᱟᱹᱨ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'DGMS § 114 Statutory Emergency Protocol',
        hi: 'डीजीएमएस धारा 114 वैधानिक अनुपालन',
        sat: 'DGMS § 114 ᱥᱚᱨᱠᱟᱨᱤ ᱱᱤᱭᱚᱢ',
      },
      weight: 25,
    },
  ],
  'gas-safety': [
    {
      name: {
        en: 'Multi-Gas Multi-Sensor Detection (CH4 / CO / O2)',
        hi: 'मल्टी-गैस सेंसर पहचान (CH4 / CO / O2)',
        sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱥᱮᱱᱥᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'SCBA Sealed Mask & Level-A PPE Readiness',
        hi: 'एससीबीए श्वास मास्क और पीपीई सूट',
        sat: 'SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ PPE ᱦᱚᱨᱚᱜ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'Confined Space Buddy System & Lifeline Tether',
        hi: 'संकीर्ण स्थान बडी सिस्टम और लाइफलाइन',
        sat: 'ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ ᱨᱮ ᱜᱟᱛᱮ ᱥᱟᱶᱛᱮ ᱠᱟᱹᱢᱤ',
      },
      weight: 25,
    },
    {
      name: {
        en: 'Auxiliary Forced Ventilation Clearance Check',
        hi: 'सहायक वेंटिलेशन और जहरीली गैस निकासी',
        sat: 'ᱦᱚᱭ ᱪᱟᱞᱟᱣ ᱟᱨ ᱵᱤᱥ ᱜᱮᱥ ᱚᱰᱚᱠ',
      },
      weight: 25,
    },
  ],
};

export const VisualProgressTracker: React.FC<VisualProgressTrackerProps> = ({
  worker,
  language,
  modules = modulesData,
  onStartModule,
  onViewCertificate,
  onOpenARSimulation,
}) => {
  const t = translations[language];

  // Expanded card state for individual modules
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'certified' | 'pending'>('all');

  const totalModules = modules.length;
  const completedCount = worker.completedModules.length;
  const overallPercentage = Math.round((completedCount / totalModules) * 100);

  // Compute average score across attempted modules
  const scoreValues = (Object.values(worker.scores || {}) as number[]);
  const avgScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((sum: number, val: number) => sum + val, 0) / scoreValues.length)
      : 0;

  // Filter modules
  const displayedModules = modules.filter((m) => {
    const isCompleted = worker.completedModules.includes(m.id);
    if (filterMode === 'certified') return isCompleted;
    if (filterMode === 'pending') return !isCompleted;
    return true;
  });

  const toggleExpand = (modId: string) => {
    sfx.playTargetLock();
    setExpandedModuleId((prev) => (prev === modId ? null : modId));
  };

  // SVG Circular Meter Constants
  const circleSize = 110;
  const strokeWidth = 10;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  // Localized mastery helpers
  const getMasteryLevel = (score: number | undefined, isCompleted: boolean) => {
    if (!isCompleted || score === undefined) {
      return {
        tier: 'Tier 0',
        label: {
          en: 'Not Certified',
          hi: 'प्रमाणित नहीं',
          sat: 'ᱵᱟᱝ ᱥᱟᱨᱴᱤᱯᱷᱟᱭᱰ',
        },
        badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
        barColor: 'from-slate-300 to-slate-400',
        starCount: 0,
      };
    }
    if (score >= 85) {
      return {
        tier: 'Master Miner',
        label: {
          en: 'Mastery Level 3 (Expert)',
          hi: 'दक्षता स्तर 3 (विशेषज्ञ)',
          sat: 'ᱫᱟᱲᱮ ᱞᱮᱵᱷᱮᱞ 3 (ᱢᱟᱥᱴᱟᱨ)',
        },
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        barColor: 'from-emerald-500 to-teal-500',
        starCount: 3,
      };
    }
    if (score >= 70) {
      return {
        tier: 'Proficient',
        label: {
          en: 'Mastery Level 2 (Certified)',
          hi: 'दक्षता स्तर 2 (प्रमाणित)',
          sat: 'ᱫᱟᱲᱮ ᱞᱮᱵᱷᱮᱞ 2 (ᱯᱟᱥ)',
        },
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-300',
        barColor: 'from-blue-500 to-indigo-500',
        starCount: 2,
      };
    }
    return {
      tier: 'Needs Retake',
      label: {
        en: 'Re-assessment Recommended',
        hi: 'पुनः प्रशिक्षण आवश्यक (<70%)',
        sat: 'ᱟᱨᱦᱚᱸ ᱵᱤᱱᱤᱰ ᱞᱟᱹᱠᱛᱤ (<70%)',
      },
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-300',
      barColor: 'from-amber-500 to-orange-500',
      starCount: 1,
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header with Title and Overall Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>
                {language === 'hi'
                  ? 'व्यक्तिगत प्रशिक्षण प्रगति एवं मॉड्यूल दक्षता'
                  : language === 'sat'
                  ? 'ᱦᱟᱹᱴᱤᱧ ᱫᱟᱲᱮ ᱟᱨ ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ ᱴᱨᱮᱠᱟᱨ'
                  : 'Individual Module Mastery & Training Progress'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-bold">
                LIVE METRICS
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {language === 'hi'
                ? 'डीजीएमएस सुरक्षा मानक § 114 के तहत वास्तविक समय दक्षता ट्रैकिंग'
                : language === 'sat'
                ? 'DGMS § 114 ᱥᱚᱨᱠᱟᱨᱤ ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱫᱟᱲᱮ ᱧᱮᱞ'
                : 'Real-time vocational competency tracking aligned with DGMS Safety Standards'}
            </p>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'सभी' : language === 'sat' ? 'ᱡᱚᱛᱚ' : 'All'} ({totalModules})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('certified')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              filterMode === 'certified'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'प्रमाणित' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱟᱭᱰ' : 'Certified'} ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              filterMode === 'pending'
                ? 'bg-white text-amber-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'शेष' : language === 'sat' ? 'ᱵᱟᱹᱠᱤ' : 'Pending'} ({totalModules - completedCount})
          </button>
        </div>
      </div>

      {/* Main Visual Progress Showcase: Radial Dial + KPI Cards */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-xs border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Radial Donut Gauge */}
          <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width={circleSize} height={circleSize} className="transform -rotate-90">
                {/* Track */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Progress arc */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="#3b82f6"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              {/* Inside center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                  {overallPercentage}%
                </span>
                <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider mt-0.5">
                  {language === 'hi' ? 'पूर्णता' : language === 'sat' ? 'ᱯᱩᱨᱟᱹᱣ' : 'Overall'}
                </span>
              </div>
            </div>

            {/* Overall Completion Text & Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    overallPercentage === 100
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : overallPercentage >= 50
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {overallPercentage === 100
                    ? language === 'hi'
                      ? '100% डीजीएमएस प्रमाणित खनिक'
                      : language === 'sat'
                      ? '100% DGMS ᱯᱟᱥ ᱠᱟᱹᱢᱤᱭᱟᱹ'
                      : '100% DGMS Certified Miner'
                    : overallPercentage >= 50
                    ? language === 'hi'
                      ? 'अर्ध-प्रमाणित परिचालन स्थिति'
                      : language === 'sat'
                      ? 'ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ ᱠᱟᱹᱢᱤᱭᱟᱹ'
                      : 'Operational Readiness Level 2'
                    : language === 'hi'
                    ? 'प्रारंभिक प्रशिक्षण प्रगति पर'
                    : language === 'sat'
                    ? 'ᱮᱦᱚᱵ ᱥᱮᱪᱮᱫ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ'
                    : 'Initial Induction In Progress'}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                {worker.name} · {completedCount} of {totalModules}{' '}
                {language === 'hi' ? 'मॉड्यूल पूर्ण' : language === 'sat' ? 'ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ' : 'Modules Certified'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                {overallPercentage === 100
                  ? language === 'hi'
                    ? 'बधाई! आपके दोनों खान सुरक्षा मॉड्यूल उच्च दक्षता के साथ प्रमाणित हैं।'
                    : language === 'sat'
                    ? 'ᱥᱟᱨᱦᱟᱣ! ᱟᱢᱟᱜ ᱵᱟᱱᱟᱨ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ᱾'
                    : 'All mandatory underground safety modules completed with verified digital certification.'
                  : language === 'hi'
                  ? `आपकी समग्र प्रशिक्षण प्रगति ${overallPercentage}% है। पूर्ण प्रमाणन हेतु शेष मॉड्यूल पूरा करें।`
                  : language === 'sat'
                  ? `ᱟᱢᱟᱜ ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ ${overallPercentage}% ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾ ᱵᱟᱹᱠᱤ ᱦᱟᱹᱴᱤᱧ ᱞᱚᱜᱚᱱ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾`
                  : `${overallPercentage}% of underground statutory curriculum completed. Finish pending modules for full licensure.`}
              </p>
            </div>
          </div>

          {/* 3 Micro KPI Stat Boxes */}
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            {/* Avg Mastery Score */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'औसत अंक' : language === 'sat' ? 'ᱚᱨᱡᱚ' : 'Avg Score'}
              </span>
              <span className="text-lg font-bold text-emerald-400 mt-0.5">
                {avgScore > 0 ? `${avgScore}%` : 'N/A'}
              </span>
              <span className="text-[9px] text-slate-400">
                {avgScore >= 70 ? 'DGMS Pass' : 'Pending'}
              </span>
            </div>

            {/* Certified Count */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'प्रमाणित' : language === 'sat' ? 'ᱯᱩᱨᱟᱹᱣ' : 'Modules'}
              </span>
              <span className="text-lg font-bold text-blue-400 mt-0.5">
                {completedCount}/{totalModules}
              </span>
              <span className="text-[9px] text-slate-400">
                {completedCount === totalModules
                  ? language === 'hi'
                    ? '100% पूर्ण'
                    : language === 'sat'
                    ? '100% ᱯᱩᱨᱟᱹᱣ'
                    : '100% Done'
                  : `${totalModules - completedCount} ${language === 'hi' ? 'शेष' : language === 'sat' ? 'ᱵᱟᱹᱠᱤ' : 'Left'}`}
              </span>
            </div>

            {/* Digital Credentials */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'hi' ? 'क्यूआर सनद' : language === 'sat' ? 'QR ᱥᱟᱠᱟᱢ' : 'QR Passes'}
              </span>
              <span className="text-lg font-bold text-amber-400 mt-0.5">
                {worker.certificates.length}
              </span>
              <span className="text-[9px] text-slate-400">
                {language === 'hi' ? 'छेड़छाड़-मुक्त' : language === 'sat' ? 'ᱴᱮᱢᱯᱟᱨ-ᱯᱨᱩᱯᱷ' : 'Tamper-Proof'}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Step Bar for Overall Modules */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {language === 'hi'
                  ? 'प्रमाणन रोडमैप'
                  : language === 'sat'
                  ? 'ᱥᱮᱪᱮᱫ ᱰᱟᱦᱟᱨ'
                  : 'Statutory Certification Roadmap'}
              </span>
            </span>
            <span className="font-mono text-xs font-bold text-white">
              {completedCount} / {totalModules} {language === 'hi' ? 'पूर्ण' : language === 'sat' ? 'ᱯᱩᱨᱟᱹᱣ' : 'Completed'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-md p-0.5 border border-slate-700 flex gap-1.5">
            {modules.map((mod, index) => {
              const isDone = worker.completedModules.includes(mod.id);
              const score = worker.scores[mod.id];
              return (
                <div
                  key={mod.id}
                  className="flex-1 h-full rounded-sm relative group cursor-pointer overflow-hidden transition-all"
                  onClick={() => toggleExpand(mod.id)}
                  title={`${mod.title} - ${isDone ? `Certified (${score}%)` : 'Not Completed'}`}
                >
                  <div
                    className={`w-full h-full rounded-sm transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <span>
              {language === 'hi'
                ? 'चरण 1: अग्नि एवं गैस आधार'
                : language === 'sat'
                ? 'ᱦᱟᱹᱴᱤᱧ ᱑: ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱜᱮᱥ'
                : 'Stage 1: Fire & Gas Baseline'}
            </span>
            <span>
              {language === 'hi'
                ? 'चरण 2: पूर्ण डीजीएमएस खदान प्राधिकरण'
                : language === 'sat'
                ? 'ᱦᱟᱹᱴᱤᱧ ᱒: ᱯᱩᱨᱟᱹ DGMS ᱦᱩᱠᱩᱢ'
                : 'Stage 2: Full DGMS Heavy Machinery Authorization'}
            </span>
          </div>
        </div>
      </div>

      {/* Individual Module Mastery Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi'
                ? 'व्यक्तिगत मॉड्यूल दक्षता विवरण'
                : language === 'sat'
                ? 'ᱢᱤᱫ-ᱢᱤᱫ ᱦᱟᱹᱴᱤᱧ ᱫᱟᱲᱮ ᱵᱤᱵᱚᱨᱚᱬ'
                : 'Individual Module Mastery Breakdown'}
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            {displayedModules.length} {displayedModules.length === 1 ? 'Module' : 'Modules'}
          </span>
        </div>

        {displayedModules.map((module) => {
          const isCompleted = worker.completedModules.includes(module.id);
          const score = worker.scores[module.id];
          const isExpanded = expandedModuleId === module.id;
          const isFire = module.id === 'fire-safety';
          const mastery = getMasteryLevel(score, isCompleted);
          const skills = MODULE_SKILLS[module.id] || [];
          const cert = worker.certificates.find((c) => c.moduleId === module.id);

          // Simulated or calculated mastery percentage (score or 0)
          const masteryPercent = isCompleted && score !== undefined ? score : 0;

          return (
            <div
              key={module.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCompleted
                  ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
              }`}
            >
              {/* Card Header & Summary Bar */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Icon with status ring */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : isFire
                            ? 'bg-orange-50 border-orange-200 text-orange-600'
                            : 'bg-rose-50 border-rose-200 text-rose-600'
                        }`}
                      >
                        {isFire ? <Flame className="w-6 h-6" /> : <Skull className="w-6 h-6" />}
                      </div>
                      {isCompleted && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-emerald-600 border border-white flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          {isFire ? t.fireModuleTitle : t.gasModuleTitle}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${mastery.badgeBg}`}
                        >
                          {mastery.label[language]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 sm:line-clamp-none">
                        {isFire ? t.fireModuleDesc : t.gasModuleDesc}
                      </p>

                      {/* Meta badges: Time, Scenarios, Certification score */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {module.estimatedTime}
                        </span>
                        <span>·</span>
                        <span className="font-medium">
                          {module.scenarios.length}{' '}
                          {language === 'hi'
                            ? 'एआर स्लैम परिदृश्य'
                            : language === 'sat'
                            ? 'AR SLAM ᱫᱟᱹᱭᱠᱟᱹ'
                            : 'AR SLAM Scenarios'}
                        </span>
                        {score !== undefined && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                              <Trophy className="w-3 h-3 text-emerald-600" />
                              {language === 'hi' ? 'अंक' : language === 'sat' ? 'ᱚᱨᱡᱚ' : 'Score'}: {score}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expand / Details Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(module.id)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer shrink-0"
                    title={isExpanded ? 'Hide Details' : 'View Module Mastery Details'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Module Mastery Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {language === 'hi'
                          ? 'मॉड्यूल दक्षता स्तर'
                          : language === 'sat'
                          ? 'ᱦᱟᱹᱴᱤᱧ ᱫᱟᱲᱮ'
                          : 'Module Competency Mastery'}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {isCompleted
                        ? `${masteryPercent}% ${language === 'hi' ? 'दक्षता' : language === 'sat' ? 'ᱫᱟᱲᱮ' : 'Mastery'}`
                        : `0% (${language === 'hi' ? 'प्रशिक्षण आवश्यक' : language === 'sat' ? 'ᱥᱮᱪᱮᱫ ᱞᱟᱹᱠᱛᱤ' : 'Training Required'})`}
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-md overflow-hidden p-0.5 border border-slate-200/80">
                    <div
                      className={`h-full rounded-sm transition-all duration-500 bg-gradient-to-r ${mastery.barColor}`}
                      style={{ width: `${Math.max(masteryPercent, isCompleted ? 5 : 0)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {language === 'hi' ? 'आधार (0%)' : language === 'sat' ? 'ᱮᱛᱚᱦᱚᱵ (0%)' : 'Baseline (0%)'}
                    </span>
                    <span>
                      {language === 'hi' ? 'डीजीएमएस पास अंक (70%)' : language === 'sat' ? 'DGMS ᱯᱟᱥ (70%)' : 'DGMS Pass Mark (70%)'}
                    </span>
                    <span>
                      {language === 'hi' ? 'विशेषज्ञ खनिक (85%+)' : language === 'sat' ? 'ᱫᱟᱲᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ (85%+)' : 'Expert Miner (85%+)'}
                    </span>
                  </div>
                </div>

                {/* Card Primary Action Bar */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(module.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer py-1"
                    >
                      <span>
                        {isExpanded
                          ? language === 'hi'
                            ? 'दक्षता विवरण छिपाएं'
                            : language === 'sat'
                            ? 'ᱫᱟᱲᱮ ᱩᱠᱩᱭ ᱢᱮ'
                            : 'Hide Competency Breakdown'
                          : language === 'hi'
                          ? 'दक्षता कौशल देखें'
                          : language === 'sat'
                          ? 'ᱫᱟᱲᱮ ᱧᱮᱞ ᱢᱮ'
                          : 'View Skill Breakdown'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Certificate Button (if certified) */}
                    {isCompleted && cert && onViewCertificate && (
                      <button
                        type="button"
                        id={`tracker-view-cert-${module.id}`}
                        onClick={() => {
                          sfx.playSuccess();
                          onViewCertificate(cert.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {language === 'hi'
                            ? 'सनद देखें'
                            : language === 'sat'
                            ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ'
                            : 'View Pass'}
                        </span>
                      </button>
                    )}

                    {/* Launch / Retake Module Button */}
                    <button
                      type="button"
                      id={`tracker-start-module-${module.id}`}
                      onClick={() => {
                        sfx.playTargetLock();
                        onStartModule(module.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>
                            {language === 'hi'
                              ? 'दक्षता बढ़ाएं (पुनः अभ्यास)'
                              : language === 'sat'
                              ? 'ᱟᱨᱦᱚᱸ ᱯᱟᱲᱦᱟᱣ'
                              : 'Retake to Boost'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>
                            {language === 'hi'
                              ? 'प्रशिक्षण शुरू करें'
                              : language === 'sat'
                              ? 'ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ'
                              : 'Start Training'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Skill Mastery Breakdown Accordion */}
              {isExpanded && (
                <div className="bg-slate-50/90 border-t border-slate-200/90 p-4 sm:p-5 space-y-3.5 transition-all">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>
                        {language === 'hi'
                          ? 'मूल्यांकन किए गए मुख्य सुरक्षा कौशल'
                          : language === 'sat'
                          ? 'ᱯᱚᱨᱤᱠᱷᱭᱟ ᱦᱩᱭ ᱟᱠᱟᱱ ᱫᱟᱲᱮ'
                          : 'Evaluated Safety Competencies & Sub-Skills'}
                      </span>
                    </h5>
                    <span className="text-[10px] text-slate-500 font-mono">
                      DGMS REGULATION § 114
                    </span>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-2.5">
                    {skills.map((skill, sIdx) => {
                      // Sub-score estimation based on module score or pending
                      const subScore = isCompleted && score
                        ? Math.min(100, Math.max(65, Math.round(score + (sIdx % 2 === 0 ? 4 : -3))))
                        : 0;
                      const isSkillMastered = isCompleted && subScore >= 70;

                      return (
                        <div
                          key={sIdx}
                          className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  isSkillMastered
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {isSkillMastered ? <Check className="w-3 h-3 text-emerald-700" /> : sIdx + 1}
                              </span>
                              <span className="font-semibold text-slate-800">
                                {skill.name[language]}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] font-mono font-bold ${
                                isSkillMastered ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {isCompleted
                                ? `${subScore}%`
                                : language === 'hi'
                                ? 'प्रशिक्षण शेष'
                                : language === 'sat'
                                ? 'ᱥᱮᱪᱮᱫ ᱵᱟᱹᱠᱤ'
                                : 'Pending Drill'}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                            <div
                              className={`h-full rounded-sm transition-all duration-300 ${
                                isSkillMastered
                                  ? subScore >= 85
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-600'
                                  : 'bg-slate-200'
                              }`}
                              style={{ width: `${subScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Certificate Information or Training Incentive */}
                  {isCompleted && cert ? (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {language === 'hi'
                            ? `प्रमाणपत्र सं: ${cert.id} (मान्य: ${cert.expiryDate})`
                            : language === 'sat'
                            ? `ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱮᱞ: ${cert.id} (${cert.expiryDate} ᱦᱟᱹᱵᱤᱡ)`
                            : `Official Credential ID: ${cert.id} (Valid until ${cert.expiryDate})`}
                        </p>
                        <p className="text-[11px] text-emerald-800/80 mt-0.5">
                          {language === 'hi'
                            ? 'यह योग्यता झारखंड खान निदेशालय के डेटाबेस में सत्यापित एवं पंजीकृत है।'
                            : language === 'sat'
                            ? 'ᱱᱚᱶᱟ ᱫᱟᱲᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ ᱨᱮ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱢᱮᱱᱟᱜ-ᱟ᱾'
                            : 'This qualification is officially cataloged and QR verifiable across Jharkhand collieries.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
                      <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          {language === 'hi'
                            ? 'प्रमाणीकरण हेतु 70% या अधिक अंक आवश्यक हैं।'
                            : language === 'sat'
                            ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ 70% ᱱᱚᱢᱵᱚᱨ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾'
                            : 'Achieve 70% or higher in the practical AR simulation and assessment to earn official certification.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
