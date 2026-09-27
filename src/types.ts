export type Language = 'en' | 'hi' | 'khr' | 'nag' | 'sat';

export interface GasReading {
  gas: 'CH4' | 'O2' | 'CO' | 'H2S';
  formula: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  alarmThreshold: number;
  criticalThreshold: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  dgmsRule: string;
}

export interface EvacuationTarget {
  id: 'fresh-air-base' | 'refuge-chamber' | 'self-rescuer-station';
  name: string;
  distanceMeters: number;
  bearingDeg: number;
  description: string;
  dgmsRequirement: string;
  status: 'ACTIVE_POSITIVE_PRESSURE' | 'SEALED_O2_READY' | 'CACHE_VERIFIED';
}

export interface DGMSVTCPass {
  passNumber: string;
  workerId: string;
  workerName: string;
  designation: string;
  vtcCenter: string;
  moduleId: string;
  moduleTitle: string;
  score: number;
  completionTimestamp: string;
  validUntil: string;
  dgmsRegulationRef: string;
  qrPayload: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  mineBlock: string;
  avatarUrl?: string;
  completedModules: string[];
  scores: Record<string, number>;
  certificates: CertificateRecord[];
}

export interface ARMarker {
  id: string;
  label: string;
  icon: string;
  type: 'danger' | 'warning' | 'safety' | 'equipment';
  x: number; // percentage in view (0-100)
  y: number; // percentage in view (0-100)
  description: string;
  actionRequired?: string;
}

export interface ARScenario {
  id: string;
  title: string;
  subtitle: string;
  situation: string;
  environmentType: 'coal_mine' | 'processing_plant' | 'confined_tunnel';
  markers: ARMarker[];
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  interactiveType?: 'choice' | 'ppe_selector' | 'evacuation_map' | 'hazard_click';
}

export interface TrainingModule {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  badgeColor: string;
  estimatedTime: string;
  description: string;
  scenarios: ARScenario[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CertificateRecord {
  id: string;
  workerName: string;
  workerId: string;
  moduleId: string;
  moduleTitle: string;
  score: number;
  issueDate: string;
  expiryDate: string;
  verificationCode: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  issuedBy: string;
}

export interface AdminWorker {
  id: string;
  name: string;
  mine: string;
  category: 'Tribal Recruit' | 'Permanent Miner' | 'Contract Worker';
  fireSafetyStatus: 'Certified' | 'Pending' | 'In Progress';
  gasSafetyStatus: 'Certified' | 'Pending' | 'In Progress';
  overallScore: number;
  lastTrained: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  zone: string;
  badgeNumber: string;
  clearanceLevel: string;
}

export interface WorkerAccount {
  loginId: string;
  password: string;
  phone: string;
  profile: WorkerProfile;
}

export interface AdminAccount {
  loginId: string;
  password: string;
  profile: AdminProfile;
}
