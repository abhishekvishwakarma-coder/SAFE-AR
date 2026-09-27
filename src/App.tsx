import React, { useState, useEffect } from 'react';
import {
  Language,
  WorkerProfile,
  AdminProfile,
  TrainingModule,
  CertificateRecord,
} from './types';
import { initialWorker, modulesData, defaultCertificate } from './data/mockData';
import { defaultAdminProfile } from './data/authData';
import { LanguageModal } from './components/LanguageModal';
import { LandingScreen } from './components/LandingScreen';
import { WorkerDashboard } from './components/WorkerDashboard';
import { ARSimulationView } from './components/ARSimulationView';
import { AssessmentEngine } from './components/AssessmentEngine';
import { DigitalCertificateView } from './components/DigitalCertificateView';
import { QRVerificationModal } from './components/QRVerificationModal';
import { AdminComplianceDashboard } from './components/AdminComplianceDashboard';
import { ARSimulationScreen } from './components/ARSimulationScreen';
import { DeviceSimulatorFrame, AppView } from './components/DeviceSimulatorFrame';

type WorkerScreen = 'dashboard' | 'ar-simulation' | 'assessment' | 'certificate';

export default function App() {
  // Offline persistence for language
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('safear_language');
      if (saved === 'en' || saved === 'hi' || saved === 'sat') return saved;
    } catch {
      // ignore
    }
    return 'hi'; // Default to Hindi for Jharkhand industrial demonstration
  });

  // Offline persistence for worker profile
  const [worker, setWorker] = useState<WorkerProfile>(() => {
    try {
      const saved = localStorage.getItem('safear_worker');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return initialWorker;
  });

  // Authentication states
  const [isWorkerLoggedIn, setIsWorkerLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('safear_worker_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('safear_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    try {
      const saved = localStorage.getItem('safear_admin_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultAdminProfile;
  });

  // Active view: 'landing' | 'worker-login' | 'worker' | 'admin-login' | 'admin'
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Active worker sub-screen
  const [workerScreen, setWorkerScreen] = useState<WorkerScreen>('dashboard');

  // Currently active training module (default to 'fire-safety' for the primary demo flow)
  const [activeModuleId, setActiveModuleId] = useState<string>('fire-safety');

  // Active certificate being viewed or verified
  const [activeCertificate, setActiveCertificate] = useState<CertificateRecord>(defaultCertificate);

  // Modals
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  // Save changes to localStorage for offline simulation
  useEffect(() => {
    try {
      localStorage.setItem('safear_language', language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('safear_worker', JSON.stringify(worker));
    } catch {
      // ignore
    }
  }, [worker]);

  useEffect(() => {
    try {
      localStorage.setItem('safear_worker_logged_in', isWorkerLoggedIn ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isWorkerLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('safear_admin_logged_in', isAdminLoggedIn ? 'true' : 'false');
      localStorage.setItem('safear_admin_profile', JSON.stringify(adminProfile));
    } catch {
      // ignore
    }
  }, [isAdminLoggedIn, adminProfile]);

  // Find active module object
  const activeModule: TrainingModule =
    modulesData.find((m) => m.id === activeModuleId) || modulesData[0];

  // Auth Action Handlers
  const handleWorkerLoginSuccess = (loggedInWorker: WorkerProfile) => {
    setWorker(loggedInWorker);
    setIsWorkerLoggedIn(true);
    setCurrentView('worker');
    setWorkerScreen('dashboard');
  };

  const handleWorkerLogout = () => {
    setIsWorkerLoggedIn(false);
    setCurrentView('worker-login');
  };

  const handleAdminLoginSuccess = (admin: AdminProfile) => {
    setAdminProfile(admin);
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('admin-login');
  };

  // Training Navigation handlers
  const handleStartModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setWorkerScreen('ar-simulation');
  };

  const handleFinishSimulation = () => {
    setWorkerScreen('assessment');
  };

  const handleAssessmentPassed = (score: number) => {
    // Generate new digital certificate
    const newCert: CertificateRecord = {
      id: activeModuleId === 'fire-safety' ? 'JH-SAFE-2026-001284' : `JH-SAFE-2026-00${Math.floor(1000 + Math.random() * 9000)}`,
      workerName: worker.name,
      workerId: worker.id,
      moduleId: activeModule.id,
      moduleTitle: activeModule.title,
      score: score,
      issueDate: '12 September 2026',
      expiryDate: '12 September 2028',
      verificationCode: `VRF-JH-${Math.floor(1000 + Math.random() * 9000)}-DGMS`,
      status: 'VALID',
      issuedBy: 'Directorate General of Mines Safety (Govt. of Jharkhand)',
    };

    // Update worker state
    setWorker((prev) => {
      const alreadyCompleted = prev.completedModules.includes(activeModule.id);
      const newCompleted = alreadyCompleted
        ? prev.completedModules
        : [...prev.completedModules, activeModule.id];

      const newScores = {
        ...prev.scores,
        [activeModule.id]: score,
      };

      // avoid duplicate certificates
      const updatedCerts = [
        newCert,
        ...prev.certificates.filter((c) => c.moduleId !== activeModule.id),
      ];

      return {
        ...prev,
        completedModules: newCompleted,
        scores: newScores,
        certificates: updatedCerts,
      };
    });

    setActiveCertificate(newCert);
    setWorkerScreen('certificate');
  };

  const handleViewCertificate = (certId?: string) => {
    if (certId) {
      const found = worker.certificates.find((c) => c.id === certId);
      if (found) {
        setActiveCertificate(found);
      } else {
        setActiveCertificate(defaultCertificate);
      }
    } else if (worker.certificates.length > 0) {
      setActiveCertificate(worker.certificates[0]);
    } else {
      setActiveCertificate(defaultCertificate);
    }
    setWorkerScreen('certificate');
  };

  const handleOpenQRVerification = (certId?: string) => {
    if (certId) {
      const found = worker.certificates.find((c) => c.id === certId);
      if (found) {
        setActiveCertificate(found);
      } else {
        setActiveCertificate({
          ...defaultCertificate,
          id: certId,
        });
      }
    }
    setIsQRModalOpen(true);
  };

  return (
    <DeviceSimulatorFrame
      currentView={currentView}
      language={language}
      isWorkerLoggedIn={isWorkerLoggedIn}
      isAdminLoggedIn={isAdminLoggedIn}
      workerName={worker.name}
      adminName={adminProfile.name}
      onViewChange={(view) => setCurrentView(view)}
      onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      onSelectLanguage={(lang) => setLanguage(lang)}
      onWorkerLogout={handleWorkerLogout}
      onAdminLogout={handleAdminLogout}
    >
      {currentView === 'landing' || currentView === 'worker-login' || currentView === 'admin-login' ? (
        /* Minding Mines Official Login Portal */
        <LandingScreen
          language={language}
          initialRole={currentView === 'admin-login' ? 'admin' : 'worker'}
          onWorkerLoginSuccess={handleWorkerLoginSuccess}
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />
      ) : currentView === 'ar-simulation' ? (
        /* Dedicated AR Simulation Screen */
        <ARSimulationScreen
          language={language}
          initialModuleId={activeModuleId}
          onBackToDashboard={() => {
            if (isWorkerLoggedIn) {
              setCurrentView('worker');
              setWorkerScreen('dashboard');
            } else {
              setCurrentView('landing');
            }
          }}
          onProceedToAssessment={(moduleId) => {
            setActiveModuleId(moduleId);
            setCurrentView('worker');
            setWorkerScreen('assessment');
          }}
          onStartWorkerApp={() => {
            setCurrentView(isWorkerLoggedIn ? 'worker' : 'landing');
          }}
        />
      ) : currentView === 'admin' ? (
        /* Admin Compliance Dashboard View */
        <AdminComplianceDashboard
          admin={adminProfile}
          language={language}
          onSwitchToWorkerApp={() => setCurrentView(isWorkerLoggedIn ? 'worker' : 'worker-login')}
          onVerifyCertificateId={(id) => handleOpenQRVerification(id)}
          onLogout={handleAdminLogout}
        />
      ) : (
        /* Worker Mobile Experience (gated by auth) */
        <>
          {workerScreen === 'dashboard' && (
            <WorkerDashboard
              worker={worker}
              language={language}
              onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              onStartModule={handleStartModule}
              onViewCertificate={handleViewCertificate}
              onOpenQRVerification={handleOpenQRVerification}
              onOpenARSimulation={() => setCurrentView('ar-simulation')}
              onLogout={handleWorkerLogout}
            />
          )}

          {workerScreen === 'ar-simulation' && (
            <ARSimulationView
              module={activeModule}
              language={language}
              onBackToDashboard={() => setWorkerScreen('dashboard')}
              onCompleteSimulation={handleFinishSimulation}
              onSelectModule={(modId) => setActiveModuleId(modId)}
              onProceedToAssessment={(modId) => {
                setActiveModuleId(modId);
                setWorkerScreen('assessment');
              }}
            />
          )}

          {workerScreen === 'assessment' && (
            <AssessmentEngine
              module={activeModule}
              language={language}
              onAssessmentPassed={handleAssessmentPassed}
              onCancel={() => setWorkerScreen('dashboard')}
            />
          )}

          {workerScreen === 'certificate' && (
            <DigitalCertificateView
              certificate={activeCertificate}
              language={language}
              onBackToDashboard={() => setWorkerScreen('dashboard')}
              onOpenQRVerification={handleOpenQRVerification}
            />
          )}
        </>
      )}

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        selectedLanguage={language}
        onSelectLanguage={(lang) => {
          setLanguage(lang);
          setIsLanguageModalOpen(false);
        }}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* QR Certificate Verification Modal */}
      <QRVerificationModal
        isOpen={isQRModalOpen}
        certificate={activeCertificate}
        language={language}
        onClose={() => setIsQRModalOpen(false)}
      />
    </DeviceSimulatorFrame>
  );
}

