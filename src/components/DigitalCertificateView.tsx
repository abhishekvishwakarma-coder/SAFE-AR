import React, { useEffect, useState } from 'react';
import { CertificateRecord, Language } from '../types';
import { translations } from '../data/translations';
import {
  ShieldCheck,
  QrCode,
  Download,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import QRCode from 'qrcode';
import { sfx } from '../utils/audio';

interface DigitalCertificateViewProps {
  certificate: CertificateRecord;
  language: Language;
  onBackToDashboard: () => void;
  onOpenQRVerification: (certId: string) => void;
}

export const DigitalCertificateView: React.FC<DigitalCertificateViewProps> = ({
  certificate,
  language,
  onBackToDashboard,
  onOpenQRVerification,
}) => {
  const t = translations[language];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate authentic verification QR payload
    const verificationPayload = JSON.stringify({
      certId: certificate.id,
      worker: certificate.workerName,
      module: certificate.moduleTitle,
      score: certificate.score,
      issueDate: certificate.issueDate,
      authority: 'DGMS Jharkhand',
      project: 'SAFEAR Industrial Safety App',
      status: 'VALID',
    });

    QRCode.toDataURL(verificationPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: unknown) => console.error('QR code generation error:', err));
  }, [certificate]);

  const handlePrint = () => {
    sfx.playSuccess();
    window.print();
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="cert-back-btn"
          onClick={() => {
            sfx.playTargetLock();
            onBackToDashboard();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="print-cert-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
            title="Print or Save PDF"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            type="button"
            id="verify-from-cert-top-btn"
            onClick={() => {
              sfx.playSuccess();
              onOpenQRVerification(certificate.id);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify QR</span>
          </button>
        </div>
      </div>

      {/* Official Gov-Tech Style Certificate Canvas (Clean White & Navy) */}
      <div className="relative w-full bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-sm border-2 border-slate-300 overflow-hidden print:m-0 print:border-2">
        {/* Subtle Decorative Security Line */}
        <div className="absolute inset-2 border border-slate-200 rounded-xl pointer-events-none" />

        {/* Certificate Header with Event & Context */}
        <div className="text-center relative z-10 space-y-1.5 border-b border-slate-200 pb-5">
          {/* Official Competency Credential Pill */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold tracking-wide uppercase">
              DGMS Approved Competency Credential
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-extrabold text-sm">
              SA
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SAFE<span className="text-blue-600">AR</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Government of Jharkhand • Mining &amp; Industrial Safety Initiative
          </p>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 pt-2 tracking-wide uppercase">
            SAFETY TRAINING CERTIFICATE
          </h1>
        </div>

        {/* Certificate Body */}
        <div className="relative z-10 py-6 sm:py-8 text-center space-y-4">
          <p className="text-xs sm:text-sm text-slate-500 italic">
            This is to certify that
          </p>

          <div className="py-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-wide uppercase">
              {certificate.workerName}
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-1.5">
              Worker ID: <span className="font-bold text-slate-800">{certificate.workerId}</span> • Underground Mining Operator
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            has successfully demonstrated competency in the AR vocational training simulator and passed the statutory evaluation for:
          </p>

          {/* Module Title Highlight Box */}
          <div className="inline-block px-6 py-2.5 rounded-xl bg-blue-50 border border-blue-200/80 shadow-xs">
            <span className="text-base sm:text-lg font-bold text-blue-950 uppercase tracking-wide">
              {certificate.moduleTitle}
            </span>
          </div>

          {/* Score & Evaluation Details */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                {certificate.score}%
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Evaluation Score
              </p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <span className="text-sm sm:text-base font-bold text-slate-800">
                DGMS § 114
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Statutory Rule
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Footer / QR & Signatures */}
        <div className="relative z-10 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Interactive QR Code Card */}
          <div
            onClick={() => {
              sfx.playSuccess();
              onOpenQRVerification(certificate.id);
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-xs group"
            title="Click to verify certificate online"
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Certificate Verification QR Code"
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 animate-pulse rounded" />
            )}
            <div className="text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>TAP TO VERIFY</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                ID: {certificate.id}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Status: <span className="text-emerald-700 font-bold">{certificate.status}</span>
              </p>
            </div>
          </div>

          {/* Issue Date & Prototype Authority Signatures */}
          <div className="text-center sm:text-right space-y-1">
            <p className="text-xs font-mono text-slate-600">
              Date of Issue: <span className="font-bold text-slate-800">{certificate.issueDate}</span>
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Certificate ID: <span className="font-bold text-slate-900">{certificate.id}</span>
            </p>

            <div className="pt-2 flex flex-col items-center sm:items-end">
              <div className="font-serif italic text-sm text-slate-800 font-medium">
                Dr. A. K. Verma, Dy. DGMS
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Controller of Mining Examinations
              </p>
            </div>
          </div>
        </div>

        {/* Official Credential Registration Footer */}
        <div className="mt-6 pt-3 border-t border-slate-200/60 text-center">
          <p className="text-[11px] font-bold text-slate-700">
            Official DGMS Vocational Safety Credential
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Cryptographically signed &amp; registered under Directorate General of Mines Safety regulations (Govt. of Jharkhand).
          </p>
        </div>
      </div>

      {/* Quick Action under Certificate */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Offline verified credential saved in local cache. Verifiable without cloud connectivity.</span>
        </div>

        <button
          type="button"
          id="open-verify-modal-btn"
          onClick={() => {
            sfx.playSuccess();
            onOpenQRVerification(certificate.id);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <QrCode className="w-4 h-4" />
          <span>{t.verifyCertificate}</span>
        </button>
      </div>
    </div>
  );
};
