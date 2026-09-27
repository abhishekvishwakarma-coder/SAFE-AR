import React from 'react';
import { Language } from '../types';
import { Globe, Check, Volume2 } from 'lucide-react';
import { sfx } from '../utils/audio';

interface LanguageModalProps {
  isOpen: boolean;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onClose: () => void;
}

const languages: { code: Language; name: string; nativeName: string; region: string; tag: string }[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Standard)',
    region: 'Official Vocational Standard',
    tag: 'GLOBAL',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी (राष्ट्रभाषा)',
    region: 'राजकीय भाषा (झारखंड खनन क्षेत्र)',
    tag: 'STATE',
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (ᱚᱞ ᱪᱤᱠᱤ)',
    region: 'ᱥᱟᱱᱛᱟᱲ ᱯᱟᱹᱨᱥᱤ - ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ',
    tag: 'REGIONAL TRIBAL',
  },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header with hazard stripe styling */}
        <div className="hazard-stripe-amber h-2.5 w-full" />
        
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-100 font-industrial tracking-wide">
                SELECT TRAINING LANGUAGE
              </h2>
              <p className="text-xs text-neutral-400">
                भाषा चुनें / ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Optimized for indigenous mining recruits and factory technicians across Jharkhand&apos;s mineral belts.
          </p>

          <div className="space-y-2.5">
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-select-${lang.code}`}
                  onClick={() => {
                    sfx.playTargetLock();
                    onSelectLanguage(lang.code);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 text-neutral-100'
                      : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-black'
                          : 'border-neutral-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base tracking-wide">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] font-industrial px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">
                          {lang.tag}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {lang.region}
                      </p>
                    </div>
                  </div>
                  <div className="text-neutral-500 hover:text-amber-400 p-1">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              type="button"
              id="confirm-language-btn"
              onClick={() => {
                sfx.playSuccess();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-industrial text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
            >
              CONFIRM & PROCEED TO DASHBOARD
            </button>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-neutral-950/80 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Offline Language Pack Cached</span>
          <span>DGMS Standard 2026</span>
        </div>
      </div>
    </div>
  );
};
