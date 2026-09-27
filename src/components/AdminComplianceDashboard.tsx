import React, { useState } from 'react';
import { AdminWorker, AdminProfile, Language } from '../types';
import { mockAdminWorkers } from '../data/mockData';
import { defaultAdminProfile } from '../data/authData';
import { translations } from '../data/translations';
import {
  Users,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Download,
  Building2,
  FileSpreadsheet,
  QrCode,
  TrendingUp,
  ShieldCheck,
  HardHat,
  AlertTriangle,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface AdminComplianceDashboardProps {
  admin?: AdminProfile;
  language?: Language;
  onSwitchToWorkerApp: () => void;
  onVerifyCertificateId: (certId: string) => void;
  onLogout?: () => void;
}

export const AdminComplianceDashboard: React.FC<AdminComplianceDashboardProps> = ({
  admin = defaultAdminProfile,
  language = 'en',
  onSwitchToWorkerApp,
  onVerifyCertificateId,
  onLogout,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'workers' | 'reports' | 'verification'>('workers');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMine, setFilterMine] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [verifyInput, setVerifyInput] = useState<string>('JH-SAFE-2026-001284');

  const filteredWorkers = mockAdminWorkers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.mine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMine = filterMine === 'all' || w.mine.includes(filterMine);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'certified' && w.fireSafetyStatus === 'Certified' && w.gasSafetyStatus === 'Certified') ||
      (filterStatus === 'pending' && (w.fireSafetyStatus === 'Pending' || w.gasSafetyStatus === 'Pending'));

    return matchesSearch && matchesMine && matchesStatus;
  });

  const handleExportCSV = () => {
    sfx.playSuccess();
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Mine,Category,FireSafety,GasSafety,OverallScore,LastTrained\n' +
      mockAdminWorkers
        .map(
          (w) =>
            `${w.id},${w.name},"${w.mine}",${w.category},${w.fireSafetyStatus},${w.gasSafetyStatus},${w.overallScore}%,${w.lastTrained}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Minding_Mines_Compliance_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                MM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold tracking-wider uppercase text-slate-300">
                    {t.inspectorate}
                  </span>
                  <span className="text-xs text-slate-400">{t.stateRegistry}</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {language === 'hi'
                    ? 'माइंडिंग माइंस प्रशासक एवं निरीक्षण पोर्टल'
                    : language === 'sat'
                    ? 'Minding Mines ᱮᱰᱢᱤᱱ ᱯᱳᱨᱴᱟᱞ'
                    : 'Minding Mines Administrator Portal'}
                </h1>
                <p className="text-xs text-slate-400">
                  {language === 'hi'
                    ? 'खान सुरक्षा महानिदेशालय · कोलियरी कार्यबल अनुपालन एवं सत्यापन'
                    : language === 'sat'
                    ? 'DGMS · ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱹᱵᱤᱛ ᱯᱳᱨᱴᱟᱞ'
                    : 'Directorate General of Mines Safety · Colliery Workforce Verification'}
                </p>
              </div>
            </div>

            {/* Header Action Buttons & Logged In Officer Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden lg:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-left">
                <div className="w-7 h-7 rounded-md bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{admin.name}</div>
                  <div className="text-[10px] text-slate-300 truncate max-w-[170px]">{admin.designation}</div>
                </div>
              </div>

              <button
                type="button"
                id="admin-export-btn"
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-200" />
                <span className="hidden sm:inline">{t.exportCsv}</span>
              </button>

              <button
                type="button"
                id="switch-to-worker-btn"
                onClick={() => {
                  sfx.playTargetLock();
                  onSwitchToWorkerApp();
                }}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <HardHat className="w-4 h-4 text-blue-700" />
                <span className="hidden sm:inline">{t.workerApp}</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  id="admin-logout-btn"
                  onClick={() => {
                    sfx.playWarning();
                    onLogout();
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 hover:text-white border border-rose-400/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign Out of Admin Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Primary Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Workers Trained */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-blue-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.totalWorkforce}
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                1,420
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'प्रमाणित खनिक' : language === 'sat' ? 'ᱯᱟᱥ ᱠᱟᱹᱢᱤᱭᱟᱹ' : 'certified recruits'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+186</span> {language === 'hi' ? 'इस माह प्रशिक्षित' : language === 'sat' ? 'ᱱᱚᱶᱟ ᱪᱟᱸᱫᱚ ᱥᱮᱪᱮᱫ' : 'trained this month'}
            </p>
          </div>

          {/* Compliance Rate */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-emerald-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.auditReadiness}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
                94.2%
              </span>
              <span className="text-xs text-slate-500 font-medium">DGMS § 114</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-md mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-md w-[94.2%]" />
            </div>
          </div>

          {/* Active Mines Covered */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-slate-900 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {language === 'hi' ? 'सक्रिय खदान प्रभाग' : language === 'sat' ? 'ᱪᱟᱹᱞᱩ ᱠᱷᱟᱫᱟᱱ' : 'Active Mine Divisions'}
              </span>
              <Building2 className="w-4 h-4 text-slate-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                18
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'कार्यरत स्थल' : language === 'sat' ? 'ᱠᱷᱟᱫᱟᱱ ᱡᱟᱭᱜᱟ' : 'operational sites'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Dhanbad, Bokaro, Jharia &amp; Chaibasa
            </p>
          </div>

          {/* Fully Certified */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-emerald-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t.fullyCertified}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                1,338
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'डिजिटल क्यूआर सनद' : language === 'sat' ? 'QR ᱥᱟᱠᱟᱢ' : 'QR verified passes'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <span>
                {language === 'hi'
                  ? 'शून्य दुर्घटना रिकॉर्ड'
                  : language === 'sat'
                  ? 'ᱵᱤᱯᱚᱫᱽ ᱵᱟᱝ ᱦᱩᱭ ᱟᱠᱟᱱᱟ'
                  : 'Zero safety incidents'}
              </span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            id="admin-tab-workers"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('workers');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'workers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.workersTab}</span>
          </button>

          <button
            type="button"
            id="admin-tab-reports"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('reports');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.reportsTab}</span>
          </button>

          <button
            type="button"
            id="admin-tab-verification"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('verification');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.verificationTab}</span>
          </button>
        </div>

        {/* Tab 1: Worker Management */}
        {activeTab === 'workers' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterMine}
                  onChange={(e) => setFilterMine(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">{t.allMines}</option>
                  <option value="Dhanbad">Dhanbad Colliery</option>
                  <option value="Bokaro">Bokaro Steel</option>
                  <option value="Jharia">Jharia Coalfields</option>
                  <option value="Chaibasa">Chaibasa Iron Ore</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">{t.allStatuses}</option>
                  <option value="certified">{t.certifiedBadge}</option>
                  <option value="pending">{t.notCompletedBadge}</option>
                </select>
              </div>
            </div>

            {/* Workers Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-3.5">{t.workerNameCol}</th>
                    <th className="p-3.5">{t.collieryCol}</th>
                    <th className="p-3.5">{t.categoryCol}</th>
                    <th className="p-3.5">{t.fireSafetyCol}</th>
                    <th className="p-3.5">{t.gasSafetyCol}</th>
                    <th className="p-3.5">{t.overallScoreCol}</th>
                    <th className="p-3.5 text-right">{t.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{w.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{w.id}</div>
                      </td>
                      <td className="p-3.5 text-slate-700">{w.mine}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {w.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            w.fireSafetyStatus === 'Certified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {w.fireSafetyStatus === 'Certified' ? t.certifiedBadge : t.notCompletedBadge}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            w.gasSafetyStatus === 'Certified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {w.gasSafetyStatus === 'Certified' ? t.certifiedBadge : t.notCompletedBadge}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {w.overallScore}%
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          id={`inspect-worker-${w.id}`}
                          onClick={() => {
                            sfx.playTargetLock();
                            onVerifyCertificateId('JH-SAFE-2026-001284');
                          }}
                          className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-blue-700 text-[11px] font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
                        >
                          {t.viewQrCredential}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Compliance Analytics */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                {language === 'hi'
                  ? 'खनन क्लस्टर अनुसार क्षेत्रीय सुरक्षा अनुपालन'
                  : language === 'sat'
                  ? 'ᱠᱷᱟᱫᱟᱱ ᱦᱟᱹᱴᱤᱧ ᱞᱮᱠᱟᱛᱮ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱦᱟᱞᱚᱛ'
                  : 'Regional Compliance by Mining Cluster'}
              </h3>
              <div className="space-y-3 pt-1">
                {[
                  { name: 'Dhanbad Underground Coalfields', total: 420, certified: 402, pct: 95.7 },
                  { name: 'Bokaro Steel Raw Material Division', total: 340, certified: 320, pct: 94.1 },
                  { name: 'Jharia Deep Shaft Colliery', total: 360, certified: 338, pct: 93.8 },
                  { name: 'Chaibasa Iron & Mica Open Cast', total: 300, certified: 280, pct: 93.3 },
                ].map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">{c.name}</span>
                      <span className="text-slate-900 font-bold">
                        {c.certified}/{c.total} ({c.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-md overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-md"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                {language === 'hi'
                  ? 'भाषाई समावेशन एवं आदिवासी खनिक प्रशिक्षण प्रभाव'
                  : language === 'sat'
                  ? 'ᱯᱟᱹᱨᱥᱤ ᱥᱩᱵᱤᱫᱷᱟ ᱟᱨ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱮᱪᱮᱫ'
                  : 'Linguistic Inclusion & Tribal Worker Retention'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'hi'
                  ? 'संथाली एवं हिंदी दृश्य-श्रव्य एआर सिमुलेशन से पहली बार में ही 94.2% कामगारों ने परीक्षा उत्तीर्ण की, जबकि पारंपरिक कागजी प्रशिक्षण में यह दर मात्र 34% थी।'
                  : language === 'sat'
                  ? 'ᱥᱟᱱᱛᱟᱲᱤ ᱟᱨ ᱦᱤᱱᱫᱤ ᱛᱮ AR ᱥᱮᱪᱮᱫ ᱮᱢ ᱠᱷᱟᱹᱛᱤᱨ 94.2% ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱩᱭᱞᱩ ᱫᱷᱟᱣ ᱨᱮᱜᱮ ᱯᱟᱥ ᱮᱱᱟᱠᱚ᱾'
                  : 'Santali & Hindi audio-visual AR simulations have resulted in an unprecedented 94.2% first-attempt retention among non-literate and newly recruited indigenous operators compared to traditional 34% static manual pass rates.'}
              </p>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === 'hi' ? 'संथाली भाषा सत्र:' : language === 'sat' ? 'ᱥᱟᱱᱛᱟᱲᱤ ᱥᱮᱪᱮᱫ ᱥᱮᱥᱚᱱ:' : 'Santali Language Sessions:'}
                  </span>
                  <span className="font-bold text-blue-700">682 {language === 'hi' ? 'पूर्ण' : language === 'sat' ? 'ᱯᱩᱨᱟᱹᱣ' : 'Completions'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === 'hi' ? 'हिंदी भाषा सत्र:' : language === 'sat' ? 'ᱦᱤᱱᱫᱤ ᱥᱮᱪᱮᱫ ᱥᱮᱥᱚᱱ:' : 'Hindi Language Sessions:'}
                  </span>
                  <span className="font-bold text-slate-800">738 {language === 'hi' ? 'पूर्ण' : language === 'sat' ? 'ᱯᱩᱨᱟᱹᱣ' : 'Completions'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === 'hi' ? 'एआर उपरांत दुर्घटना दर:' : language === 'sat' ? 'AR ᱛᱟᱭᱚᱢ ᱵᱤᱯᱚᱫᱽ ᱦᱟᱞᱚᱛ:' : 'Zero Incident Rate Post-AR:'}
                  </span>
                  <span className="font-bold text-emerald-700">100% Zero-Loss Time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Certificate Audit Registry */}
        {activeTab === 'verification' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  {t.verificationTab}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.verifyCertificate}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 font-medium block">
                {language === 'hi' ? 'प्रमाणपत्र कोड दर्ज करें' : language === 'sat' ? 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱳᱰ ᱮᱢ ᱢᱮ' : 'Certificate Identification Code'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder="e.g. JH-SAFE-2026-001284"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  id="direct-verify-audit-btn"
                  onClick={() => {
                    sfx.playSuccess();
                    onVerifyCertificateId(verifyInput);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  {language === 'hi' ? 'जांच करें' : language === 'sat' ? 'ᱯᱚᱨᱤᱠᱷᱭᱟ' : 'Inspect Record'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                {language === 'hi' ? 'त्वरित परीक्षण कोड:' : language === 'sat' ? 'ᱞᱚᱜᱚᱱ ᱴᱮᱥᱴ ᱠᱳᱰ:' : 'Quick Test IDs:'}
              </p>
              <p
                className="font-mono text-blue-700 cursor-pointer hover:underline"
                onClick={() => setVerifyInput('JH-SAFE-2026-001284')}
              >
                • JH-SAFE-2026-001284 (Rahul Kumar · Fire Safety · 86%)
              </p>
              <p
                className="font-mono text-slate-600 cursor-pointer hover:underline"
                onClick={() => setVerifyInput('JH-SAFE-2026-000841')}
              >
                • JH-SAFE-2026-000841 (Rahul Kumar · Gas Safety · 82%)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
