import { WorkerAccount, AdminAccount, AdminProfile } from '../types';
import { initialWorker } from './mockData';

// Default credentials for quick reference and display
export const DEFAULT_WORKER_CREDENTIALS = {
  loginId: 'EMP-JH-8832',
  password: 'miner123',
  mobile: '9876543210',
  name: 'Rahul Kumar',
  role: 'Underground Heavy Drill Operator (BCCL Dhanbad)',
};

export const DEFAULT_ADMIN_CREDENTIALS = {
  loginId: 'DGMS-ADMIN-01',
  password: 'admin123',
  email: 'admin@dgms.jharkhand.gov.in',
  name: 'Dr. Alok Verma',
  designation: 'Chief Mining Safety Director (DGMS)',
};

// Registered Worker Accounts
export const registeredWorkers: WorkerAccount[] = [
  {
    loginId: 'EMP-JH-8832',
    password: 'miner123',
    phone: '9876543210',
    profile: initialWorker,
  },
  {
    loginId: 'EMP-JH-8851',
    password: 'miner123',
    phone: '9876543222',
    profile: {
      id: 'EMP-JH-8851',
      name: 'Birsa Munda',
      role: 'Open Cast Blasting & Excavation Specialist',
      company: 'Tata Steel Mining Division',
      location: 'Chaibasa Iron Ore Block, Jharkhand',
      mineBlock: 'Open Cast Section C-2',
      completedModules: ['fire-safety', 'gas-safety'],
      scores: {
        'fire-safety': 90,
        'gas-safety': 86,
      },
      certificates: [
        {
          id: 'JH-SAFE-2026-000492',
          workerName: 'Birsa Munda',
          workerId: 'EMP-JH-8851',
          moduleId: 'fire-safety',
          moduleTitle: 'Fire & Explosion Response',
          score: 90,
          issueDate: '11 September 2026',
          expiryDate: '11 September 2028',
          verificationCode: 'VRF-JH-4921-DGMS',
          status: 'VALID',
          issuedBy: 'Directorate General of Mines Safety (Govt. of Jharkhand)',
        },
      ],
    },
  },
  {
    loginId: 'EMP-JH-8874',
    password: 'miner123',
    phone: '9876543233',
    profile: {
      id: 'EMP-JH-8874',
      name: 'Sunita Mahto',
      role: 'Coal Preparation & Safety Shift Supervisor',
      company: 'Central Coalfields Limited (CCL)',
      location: 'Ramgarh Coal Washery Zone, Jharkhand',
      mineBlock: 'Processing Terminal Unit 1',
      completedModules: ['fire-safety'],
      scores: {
        'fire-safety': 92,
      },
      certificates: [
        {
          id: 'JH-SAFE-2026-000781',
          workerName: 'Sunita Mahto',
          workerId: 'EMP-JH-8874',
          moduleId: 'fire-safety',
          moduleTitle: 'Fire & Explosion Response',
          score: 92,
          issueDate: '09 September 2026',
          expiryDate: '09 September 2028',
          verificationCode: 'VRF-JH-7814-DGMS',
          status: 'VALID',
          issuedBy: 'Directorate General of Mines Safety (Govt. of Jharkhand)',
        },
      ],
    },
  },
];

// Registered Administrator Accounts
export const registeredAdmins: AdminAccount[] = [
  {
    loginId: 'DGMS-ADMIN-01',
    password: 'admin123',
    profile: {
      id: 'DGMS-ADMIN-01',
      name: 'Dr. Alok Verma',
      email: 'admin@dgms.jharkhand.gov.in',
      designation: 'Chief Mining Safety Director',
      department: 'Directorate General of Mines Safety',
      zone: 'Jharkhand State Mining Headquarters (Ranchi)',
      badgeNumber: 'JH-DGMS-004',
      clearanceLevel: 'Level 3 • State Safety Auditor',
    },
  },
  {
    loginId: 'INSPECTOR-JH-04',
    password: 'admin123',
    profile: {
      id: 'INSPECTOR-JH-04',
      name: 'Smt. Ananya Sen',
      email: 'ananya.sen@mines.jharkhand.gov.in',
      designation: 'Senior Inspector of Mines (Safety & Audit)',
      department: 'Department of Mines & Geology, Govt. of Jharkhand',
      zone: 'Dhanbad & Bokaro Mining Circle',
      badgeNumber: 'JH-DGMS-019',
      clearanceLevel: 'Level 2 • Circle Compliance Officer',
    },
  },
  {
    loginId: 'admin',
    password: 'admin123',
    profile: {
      id: 'DGMS-ADMIN-01',
      name: 'Dr. Alok Verma',
      email: 'admin@dgms.jharkhand.gov.in',
      designation: 'Chief Mining Safety Director',
      department: 'Directorate General of Mines Safety',
      zone: 'Jharkhand State Mining Headquarters (Ranchi)',
      badgeNumber: 'JH-DGMS-004',
      clearanceLevel: 'Level 3 • State Safety Auditor',
    },
  },
];

export const defaultAdminProfile: AdminProfile = registeredAdmins[0].profile;
