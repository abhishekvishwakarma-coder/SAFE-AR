import React, { useState } from 'react';
import { CertificateRecord, Language } from '../types';
import { translations } from '../data/translations';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Search,
  Award,
  HardHat,
  Fingerprint,
  Calendar,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface QRVerificationModalProps {
  isOpen: boolean;
  certificate: CertificateRecord;
  language: Language;
  onClose: () => void;
}

export const QRVerificationModal: React.FC<QRVerificationModalProps> = ({
  isOpen,
  certificate,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [searchCertId, setSearchCertId] = useState<string>(certificate.id);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    sfx.playTargetLock();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      sfx.playSuccess();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Deep Blue Header Accent Bar */}
        <div className="bg-blue-600 h-1.5 w-full" />

        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                CERTIFICATE VERIFICATION
              </h2>
              <p className="text-xs text-slate-500">
                Minding Mines Credential Audit Registry · Online &amp; Offline
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-verify-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Verification Indicator Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 tracking-wide">
                  VALID CERTIFICATE
                </span>
                <p className="text-xs text-emerald-700 font-medium">
                  Verified with Minding Mines Registry
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
              {certificate.status}
            </span>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 divide-y divide-slate-200 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <HardHat className="w-3.5 h-3.5 text-blue-600" />
                Worker Name:
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {certificate.workerName}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                Certificate ID:
              </span>
              <span className="font-mono font-bold text-blue-700">
                {certificate.id}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                Training Module:
              </span>
              <span className="font-bold text-slate-800 text-right max-w-[220px]">
                {certificate.moduleTitle}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Score Achieved:</span>
              <span className="font-bold text-emerald-700 text-sm">
                {certificate.score}%
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Issue Date:
              </span>
              <span className="text-slate-700 font-mono">
                {certificate.issueDate}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Initiative Context:</span>
              <span className="text-slate-700 text-right font-medium">
                Govt. of Jharkhand Mining Safety Initiative
              </span>
            </div>
          </div>

          {/* Quick Inspector Audit Input Tool */}
          <div className="pt-1">
            <label className="text-[11px] text-slate-500 font-medium block mb-1.5">
              Mine Safety Officer Verification Lookup
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchCertId}
                  onChange={(e) => setSearchCertId(e.target.value)}
                  placeholder="Enter Certificate ID..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                id="search-cert-audit-btn"
                onClick={handleSimulateScan}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Re-Verify</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center italic">
            Tamper-evident verification registry
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            HASH: 8f4a2e...b901c
          </span>

          <button
            type="button"
            id="close-qr-verify-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            CONFIRM &amp; CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
