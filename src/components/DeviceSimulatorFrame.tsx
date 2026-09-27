import React, { ReactNode } from 'react';
import { Language } from '../types';
import {
  Globe,
  HardHat,
  Building2,
  LogOut,
} from 'lucide-react';
import { sfx } from '../utils/audio';

export type AppView = 'landing' | 'worker-login' | 'worker' | 'admin-login' | 'admin' | 'ar-simulation';

interface DeviceSimulatorFrameProps {
  currentView: AppView;
  language: Language;
  isWorkerLoggedIn?: boolean;
  isAdminLoggedIn?: boolean;
  workerName?: string;
  adminName?: string;
  onViewChange: (view: AppView) => void;
  onOpenLanguageModal: () => void;
  onSelectLanguage: (lang: Language) => void;
  onWorkerLogout?: () => void;
  onAdminLogout?: () => void;
  children: ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  currentView,
  language,
  isWorkerLoggedIn = false,
  isAdminLoggedIn = false,
  workerName,
  adminName,
  onViewChange,
  onOpenLanguageModal,
  onSelectLanguage,
  onWorkerLogout,
  onAdminLogout,
  children,
}) => {
  const isWorkerView = currentView === 'worker' || currentView === 'worker-login';
  const isAdminView = currentView === 'admin' || currentView === 'admin-login';
  const isARView = currentView === 'ar-simulation';

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-start text-slate-800">
      {/* Universal Clean Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xs">
        {/* Left: Minding Mines Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              sfx.playTargetLock();
              onViewChange('landing');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Minding Mines Home"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs group-hover:bg-slate-800 transition-colors">
              MM
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Minding Mines
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                {language === 'hi'
                  ? '| डीजीएमएस खदान सुरक्षा पोर्टल'
                  : language === 'sat'
                  ? '| DGMS ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱳᱨᱴᱟᱞ'
                  : '| DGMS Mining Safety Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Session Indicator & Quick Logout */}
          {isWorkerLoggedIn && isWorkerView && onWorkerLogout && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
              <HardHat className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold truncate max-w-[120px]">{workerName || (language === 'hi' ? 'श्रमिक' : language === 'sat' ? 'ᱠᱟᱹᱢᱤᱭᱟᱹ' : 'Worker')}</span>
              <button
                type="button"
                onClick={onWorkerLogout}
                className="text-slate-500 hover:text-rose-600 ml-1.5 p-0.5 cursor-pointer transition-colors"
                title={language === 'hi' ? 'श्रमिक खाते से लॉगआउट करें' : language === 'sat' ? 'ᱞᱚᱜᱽ ᱟᱣᱩᱴ' : 'Log out of Worker Account'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isAdminLoggedIn && isAdminView && onAdminLogout && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span className="font-semibold truncate max-w-[120px]">{adminName || (language === 'hi' ? 'अधिकारी' : language === 'sat' ? 'ᱮᱰᱢᱤᱱ' : 'Admin')}</span>
              <button
                type="button"
                onClick={onAdminLogout}
                className="text-slate-500 hover:text-rose-600 ml-1.5 p-0.5 cursor-pointer transition-colors"
                title={language === 'hi' ? 'अधिकारी पोर्टल से लॉगआउट करें' : language === 'sat' ? 'ᱞᱚᱜᱽ ᱟᱣᱩᱴ' : 'Log out of Admin Portal'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clean Trilingual Language Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-600">
            <button
              type="button"
              id="lang-quick-en"
              onClick={() => {
                sfx.playTargetLock();
                onSelectLanguage('en');
              }}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              English
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              id="lang-quick-hi"
              onClick={() => {
                sfx.playTargetLock();
                onSelectLanguage('hi');
              }}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              id="lang-quick-sat"
              onClick={() => {
                sfx.playTargetLock();
                onSelectLanguage('sat');
              }}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                language === 'sat'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              ᱥᱟᱱᱛᱟᱲᱤ
            </button>
          </div>

          {/* Compact Language Selector Modal trigger for smaller screens */}
          <button
            type="button"
            id="top-bar-lang-toggle"
            onClick={() => {
              sfx.playTargetLock();
              onOpenLanguageModal();
            }}
            className="flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिंदी' : 'ᱥᱟᱱᱛᱟᱲᱤ'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Canvas Container - Completely Clean, Edge-to-Edge Responsive, No Phone Borders */}
      <main className="w-full flex-1 flex justify-center items-start p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {currentView === 'admin' || currentView === 'admin-login' || currentView === 'landing' ? (
          /* Desktop Clean Width for Admin / Admin Login / Landing */
          <div className="w-full max-w-7xl animate-in fade-in duration-150">
            {children}
          </div>
        ) : isARView ? (
          /* Full Studio AR Simulation Screen (edge-to-edge max width) */
          <div className="w-full max-w-6xl animate-in fade-in duration-150">
            {children}
          </div>
        ) : (
          /* Clean Worker View - responsive container without any faux phone borders */
          <div className="w-full max-w-4xl animate-in fade-in duration-150">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
