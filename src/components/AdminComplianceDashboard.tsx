import React, { useState } from 'react';
import { AdminWorker, AdminProfile } from '../types';
import { mockAdminWorkers } from '../data/mockData';
import { defaultAdminProfile } from '../data/authData';
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
  onSwitchToWorkerApp: () => void;
  onVerifyCertificateId: (certId: string) => void;
  onLogout?: () => void;
}

export const AdminComplianceDashboard: React.FC<AdminComplianceDashboardProps> = ({
  admin = defaultAdminProfile,
  onSwitchToWorkerApp,
  onVerifyCertificateId,
  onLogout,
}) => {
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
    link.setAttribute('download', `SAFEAR_Jharkhand_Compliance_Report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      {/* Blue Top Navigation Bar (Gov-Tech Analytics Portal) */}
      <header className="bg-blue-900 text-white border-b border-blue-950/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-extrabold text-lg shadow-xs shrink-0">
                SA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-800/80 border border-blue-700 text-[10px] font-bold tracking-wider uppercase text-blue-200">
                    Mining Safety Portal
                  </span>
                  <span className="text-xs text-blue-200">State Analytics</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  SAFEAR Admin Dashboard
                </h1>
                <p className="text-xs text-blue-200">
                  Directorate General of Mines Safety &amp; Industrial Training • Government of Jharkhand
                </p>
              </div>
            </div>

            {/* Header Action Buttons & Logged In Officer Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="hidden lg:flex items-center gap-2 bg-blue-800/80 border border-blue-700/80 px-3 py-1.5 rounded-xl text-left">
                <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs border border-blue-600">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{admin.name}</div>
                  <div className="text-[10px] text-blue-200 truncate max-w-[170px]">{admin.designation}</div>
                </div>
              </div>

              <button
                type="button"
                id="admin-export-btn"
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-blue-800/90 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-blue-700 shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline">Export Audit CSV</span>
              </button>

              <button
                type="button"
                id="switch-to-worker-btn"
                onClick={() => {
                  sfx.playTargetLock();
                  onSwitchToWorkerApp();
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-blue-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <HardHat className="w-4 h-4 text-blue-700" />
                <span className="hidden sm:inline">Worker App</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  id="admin-logout-btn"
                  onClick={() => {
                    sfx.playWarning();
                    onLogout();
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 hover:text-white border border-rose-400/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign Out of Admin Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Primary Key Metrics (Requested: Workers Trained: 1,420 | Compliance Rate: 94.2% | Active Mines Covered: 18 | Critical Hazards Prevented: 312) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Workers Trained */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-blue-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Workers Trained
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                1,420
              </span>
              <span className="text-xs text-slate-500 font-medium">certified recruits</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+186 workers</span> trained this month
            </p>
          </div>

          {/* Compliance Rate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-emerald-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Compliance Rate
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
                94.2%
              </span>
              <span className="text-xs text-slate-500 font-medium">DGMS § 114 Target</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[94.2%]" />
            </div>
          </div>

          {/* Active Mines Covered */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-blue-800 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active Mines Covered
              </span>
              <Building2 className="w-4 h-4 text-blue-800" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                18
              </span>
              <span className="text-xs text-slate-500 font-medium">operational sites</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Dhanbad, Bokaro, Jharia &amp; Chaibasa
            </p>
          </div>

          {/* Critical Hazards Prevented */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="h-1 bg-emerald-600 absolute top-0 inset-x-0" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Critical Hazards Prevented
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                312
              </span>
              <span className="text-xs text-slate-500 font-medium">near-misses resolved</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <span>Zero fatalities</span> recorded in AR-trained shifts
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
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'workers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Worker Management</span>
          </button>

          <button
            type="button"
            id="admin-tab-reports"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('reports');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Compliance Analytics</span>
          </button>

          <button
            type="button"
            id="admin-tab-verification"
            onClick={() => {
              sfx.playTargetLock();
              setActiveTab('verification');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Certificate Audit Registry</span>
          </button>
        </div>

        {/* Tab 1: Worker Management */}
        {activeTab === 'workers' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search worker by name, ID, or colliery..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterMine}
                  onChange={(e) => setFilterMine(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Mine Sectors</option>
                  <option value="Dhanbad">Dhanbad Colliery</option>
                  <option value="Bokaro">Bokaro Steel</option>
                  <option value="Jharia">Jharia Coalfields</option>
                  <option value="Chaibasa">Chaibasa Iron Ore</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="certified">Certified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
            </div>

            {/* Workers Table (Gov-Tech Clean White Table) */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-3.5">Worker Name &amp; ID</th>
                    <th className="p-3.5">Colliery Location</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Fire Safety</th>
                    <th className="p-3.5">Gas Safety</th>
                    <th className="p-3.5">Score</th>
                    <th className="p-3.5 text-right">Action</th>
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
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            w.fireSafetyStatus === 'Certified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {w.fireSafetyStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            w.gasSafetyStatus === 'Certified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : w.gasSafetyStatus === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {w.gasSafetyStatus}
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
                          View Cert
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                Regional Compliance by Mining Cluster
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
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                Linguistic Inclusion &amp; Tribal Worker Retention
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Santali (Ol Chiki) &amp; Hindi audio-visual AR simulations have resulted in an unprecedented <span className="text-emerald-700 font-bold">94.2% first-attempt retention</span> among non-literate and newly recruited indigenous operators compared to traditional 34% static manual pass rates.
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Santali Language Sessions:</span>
                  <span className="font-bold text-blue-700">682 Completions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hindi Language Sessions:</span>
                  <span className="font-bold text-slate-800">738 Completions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Zero Incident Rate Post-AR:</span>
                  <span className="font-bold text-emerald-700">100% Zero-Loss Time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Certificate Audit Registry */}
        {activeTab === 'verification' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Direct Certificate Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Verify any issued SAFEAR safety certification code
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 font-medium block">
                Certificate Identification Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder="e.g. JH-SAFE-2026-001284"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  id="direct-verify-audit-btn"
                  onClick={() => {
                    sfx.playSuccess();
                    onVerifyCertificateId(verifyInput);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Inspect Record
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Quick Test IDs:</p>
              <p
                className="font-mono text-blue-700 cursor-pointer hover:underline"
                onClick={() => setVerifyInput('JH-SAFE-2026-001284')}
              >
                • JH-SAFE-2026-001284 (Rahul Kumar - Fire Safety - 86%)
              </p>
              <p
                className="font-mono text-slate-600 cursor-pointer hover:underline"
                onClick={() => setVerifyInput('JH-SAFE-2026-000841')}
              >
                • JH-SAFE-2026-000841 (Rahul Kumar - Gas Safety - 82%)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
