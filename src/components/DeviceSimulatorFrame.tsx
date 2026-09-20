import React, { ReactNode } from 'react';
import { Language } from '../types';
import {
  Smartphone,
  Maximize2,
  Globe,
  HardHat,
  Building2,
  Wifi,
  Battery,
  Home,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { sfx } from '../utils/audio';

export type AppView = 'landing' | 'worker-login' | 'worker' | 'admin-login' | 'admin';

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
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
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
  isMobileFrame,
  onToggleMobileFrame,
  children,
}) => {
  const isWorkerView = currentView === 'worker' || currentView === 'worker-login';
  const isAdminView = currentView === 'admin' || currentView === 'admin-login';

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-start text-slate-800">
      {/* Universal Clean White Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xs">
        {/* Left: SAFEAR Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              sfx.playTargetLock();
              onViewChange('landing');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="SAFEAR Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs group-hover:bg-blue-800 transition-colors">
              SA
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                SAFE<span className="text-blue-600">AR</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                | Mining &amp; Industrial Safety App
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick View Switches */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              id="nav-home-btn"
              onClick={() => {
                sfx.playTargetLock();
                onViewChange('landing');
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              type="button"
              id="nav-worker-mode-btn"
              onClick={() => {
                sfx.playTargetLock();
                onViewChange(isWorkerLoggedIn ? 'worker' : 'worker-login');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                isWorkerView
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Worker App</span>
              {isWorkerLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 inline-block" />
              )}
            </button>

            <button
              type="button"
              id="nav-admin-mode-btn"
              onClick={() => {
                sfx.playTargetLock();
                onViewChange(isAdminLoggedIn ? 'admin' : 'admin-login');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdminView
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
              {isAdminLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 inline-block" />
              )}
            </button>
          </div>

          {/* Active Session Indicator & Quick Logout */}
          {isWorkerLoggedIn && isWorkerView && onWorkerLogout && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold truncate max-w-[100px]">{workerName || 'Worker'}</span>
              <button
                type="button"
                onClick={onWorkerLogout}
                className="text-emerald-700 hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )}

          {isAdminLoggedIn && isAdminView && onAdminLogout && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-semibold truncate max-w-[110px]">{adminName || 'Admin'}</span>
              <button
                type="button"
                onClick={onAdminLogout}
                className="text-blue-700 hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Clean Language Bar: English | हिंदी | ᱥᱟᱱᱛᱟᱲᱤ */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-medium text-slate-600">
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
            className="flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिंदी' : 'ᱥᱟᱱᱛᱟᱲᱤ'}
            </span>
          </button>

          {/* Device Frame Toggle (in worker views) */}
          {isWorkerView && (
            <button
              type="button"
              id="toggle-phone-frame-btn"
              onClick={() => {
                sfx.playTargetLock();
                onToggleMobileFrame();
              }}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 cursor-pointer shadow-xs transition-colors"
              title={isMobileFrame ? 'Expand to Full Width' : 'Simulate Mobile Device Frame'}
            >
              {isMobileFrame ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Canvas Container */}
      <main className="w-full flex-1 flex justify-center items-start p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {currentView === 'admin' || currentView === 'admin-login' || currentView === 'landing' ? (
          /* Desktop Clean Width for Admin / Admin Login / Landing */
          <div className="w-full max-w-7xl animate-in fade-in duration-150">
            {children}
          </div>
        ) : isMobileFrame ? (
          /* Android Smartphone Frame View with clean modern chassis */
          <div className="w-full max-w-[420px] bg-slate-900 border-[8px] border-slate-800 rounded-[44px] shadow-xl overflow-hidden flex flex-col relative my-2 min-h-[790px]">
            {/* Phone Top Notch / Speaker & Status Bar */}
            <div className="h-8 w-full bg-slate-900 flex items-center justify-between px-6 pt-1 text-[11px] text-slate-300 font-medium select-none z-30">
              <span>10:42</span>
              {/* Camera punch hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold">4G</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Android Screen Body in light theme */}
            <div className="flex-1 w-full p-3.5 overflow-y-auto overflow-x-hidden bg-slate-50">
              {children}
            </div>

            {/* Android Home Navigation Bar */}
            <div className="h-5 w-full bg-slate-900 flex items-center justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-slate-600" />
            </div>
          </div>
        ) : (
          /* Responsive Mobile/Tablet View */
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl animate-in fade-in duration-150">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
