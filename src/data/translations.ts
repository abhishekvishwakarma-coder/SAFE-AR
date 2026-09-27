import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  govtHeader: string;
  govtSubheader: string;
  selectLanguage: string;
  chooseLanguageDesc: string;
  continueBtn: string;
  workerTitle: string;
  workerName: string;
  workerMine: string;
  progressTitle: string;
  modulesCompleted: string;
  startTraining: string;
  retakeTraining: string;
  certifiedBadge: string;
  notCompletedBadge: string;
  trainingProgress: string;
  myCertificates: string;
  viewCertificate: string;
  offlineStatus: string;
  arTrainingMode: string;
  pointCameraInstruction: string;
  cameraLive: string;
  cameraSimulated: string;
  toggleCamera: string;
  nextScenario: string;
  finishSimulation: string;
  correctDecision: string;
  incorrectDecision: string;
  tryAgain: string;
  startAssessment: string;
  assessmentTitle: string;
  questionOf: string;
  submitAnswer: string;
  trainingComplete: string;
  finalScore: string;
  statusCertified: string;
  statusFailed: string;
  generateCertificate: string;
  verifyCertificate: string;
  validCertificate: string;
  adminPortal: string;
  workerApp: string;
  fireModuleTitle: string;
  fireModuleDesc: string;
  gasModuleTitle: string;
  gasModuleDesc: string;
  ppeSelectorTitle: string;
  ppeSelectorPrompt: string;
  evacuationTitle: string;
  evacuationPrompt: string;
  downloadPdf: string;
  shareCert: string;
  close: string;
  cancel: string;
  arScreenTitle: string;
  arScreenSubtitle: string;
  switchCameraFacing: string;
  torchToggle: string;
  calibrateOrientation: string;
  freezeFrame: string;
  resumeFeed: string;
  snapshotTaken: string;
  requestCameraPermission: string;
  cameraPermissionDenied: string;
  cameraUnavailable: string;
  selectModule: string;
  arSensorsActive: string;
  lowLightWarning: string;
  markerLocked: string;
  recenterHorizon: string;

  // Camera Orientation & Layout
  orientationPortrait: string;
  orientationLandscape: string;
  toggleOrientation: string;
  cameraSplit75: string;
  quizSplit25: string;
  backCameraOnly: string;
  backCameraActive: string;

  // Area Scanning & SLAM
  scanningArea: string;
  rescanArea: string;
  surfaceCoherence: string;
  areaMapped: string;
  hazardsDetected: string;
  distance: string;
  targetCrosshair: string;
  rangefinder: string;
  spatialPlaneDetected: string;
  scanMode: string;
  hazardScan: string;
  slamMesh: string;
  ppeDetect: string;

  // Decision & Quiz
  quizTitle: string;
  selectCorrectAction: string;
  actionRequired: string;
  verifyPpe: string;
  dashboard: string;
  cameraTips: string;
  hideTips: string;

  // Auth & General
  workerLogin: string;
  adminLogin: string;
  employeeId: string;
  password: string;
  signInWorker: string;
  signInAdmin: string;
  officerId: string;
  quickFill: string;
  welcome: string;
  logout: string;
  overallProgress: string;
  moduleMastery: string;
  portalDescription: string;
  workerPortalTitle: string;
  workerPortalDesc: string;
  adminPortalTitle: string;
  adminPortalDesc: string;
  passwordPlaceholder: string;
  loginErrorMissing: string;
  loginErrorWorker: string;
  loginErrorAdmin: string;
  quickFillPasswordNote: string;

  // Admin Dashboard
  inspectorate: string;
  stateRegistry: string;
  totalWorkforce: string;
  fullyCertified: string;
  pendingTraining: string;
  auditReadiness: string;
  workersTab: string;
  reportsTab: string;
  verificationTab: string;
  searchPlaceholder: string;
  allMines: string;
  allStatuses: string;
  exportCsv: string;
  workerNameCol: string;
  collieryCol: string;
  categoryCol: string;
  fireSafetyCol: string;
  gasSafetyCol: string;
  overallScoreCol: string;
  lastTrainedCol: string;
  actionCol: string;
  viewQrCredential: string;

  // Certificate & Verification
  certOfCompetency: string;
  certSubtitle: string;
  holderNameLabel: string;
  holderEmpIdLabel: string;
  collieryMineLabel: string;
  competencyFieldLabel: string;
  issueDateLabel: string;
  expiryDateLabel: string;
  certifyingAuthorityLabel: string;
  dgmsApprovedNote: string;
  tamperProofQr: string;
  scanToVerifyText: string;
  backToDashboardBtn: string;
  qrVerifiedTitle: string;
  qrVerifiedDesc: string;
  verificationAuditPassed: string;

  // Accessibility & Audio-First Voice Assistant
  listenAssistant: string;
  listenAssistantActive: string;
  voiceCommandHint: string;
  voiceListening: string;
  voiceAnswerRecognized: string;

  // Glove-Friendly & Expandable Bottom Drawer
  expandDrawer: string;
  collapseDrawer: string;
  gloveFriendlyLabel: string;

  // Gas Monitoring & Environmental Thresholds (DGMS)
  gasMonitoringTitle: string;
  ch4ThresholdWarning: string;
  o2DeficiencyWarning: string;
  coDeadlyThreshold: string;
  h2sToxicThreshold: string;
  workStoppageAlert: string;

  // Evacuation Guidance & Spatial Navigation
  evacuationGuidanceTitle: string;
  evacFreshAirBase: string;
  evacRefugeChamber: string;
  evacSelfRescuerStation: string;
  followFloorArrows: string;

  // Underground PPE Protocol Checkpoint
  undergroundPpeFSR: string;
  undergroundPpeCapLampDetector: string;
  undergroundPpeSCBA: string;

  // Offline Engine & DGMS VTC Pass
  offlineEngineTitle: string;
  offlineEngineStatus: string;
  dgmsVtcPassTitle: string;
  downloadVtcBadge: string;
  vtcCreditProof: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  // =========================================================================
  // ENGLISH (STANDARD)
  // =========================================================================
  en: {
    appName: 'Minding Mines',
    tagline: 'Vocational Mining Safety Training & DGMS Certification',
    govtHeader: 'GOVERNMENT OF JHARKHAND',
    govtSubheader: 'Directorate General of Mines Safety (DGMS) Vocational Compliance',
    selectLanguage: 'Select Language',
    chooseLanguageDesc: 'Choose your regional dialect for audio assistance & instructions',
    continueBtn: 'Continue to Workplace',
    workerTitle: 'Colliery Operator Profile',
    workerName: 'Rahul Kumar',
    workerMine: 'Pit 4B Shaft, BCCL Dhanbad',
    progressTitle: 'Statutory Safety Roadmap',
    modulesCompleted: 'Modules Certified',
    startTraining: 'Launch AR Training',
    retakeTraining: 'Retrain in AR',
    certifiedBadge: 'DGMS CERTIFIED',
    notCompletedBadge: 'COMPLIANCE REQUIRED',
    trainingProgress: 'Overall Training Progress',
    myCertificates: 'DGMS Vocational Digital Pass',
    viewCertificate: 'View Digital Pass',
    offlineStatus: '100% Offline Ready (Local SLAM Anchors Cached)',
    arTrainingMode: 'Spatial AR Simulator',
    pointCameraInstruction: 'Point rear camera at coal seam, conveyor, or tunnel face',
    cameraLive: 'Live Back Camera',
    cameraSimulated: 'Simulated Tunnel View',
    toggleCamera: 'Toggle Camera Stream',
    nextScenario: 'Next Hazard Scenario',
    finishSimulation: 'Proceed to DGMS Evaluation',
    correctDecision: 'Statutory Protocol Followed!',
    incorrectDecision: 'Safety Violation Detected!',
    tryAgain: 'Recalibrate & Retry',
    startAssessment: 'Take DGMS Certification Exam',
    assessmentTitle: 'DGMS Regulation 114 Competency Exam',
    questionOf: 'Question',
    submitAnswer: 'Confirm Decision',
    trainingComplete: 'Vocational Module Passed!',
    finalScore: 'Official Exam Score',
    statusCertified: 'DGMS VTC PASS ISSUED',
    statusFailed: 'Re-evaluation Required (Threshold 70%)',
    generateCertificate: 'Generate DGMS VTC Pass',
    verifyCertificate: 'Verify Digital Pass',
    validCertificate: 'Statutory Valid Credential',
    adminPortal: 'DGMS Admin Inspectorate',
    workerApp: 'Worker AR Portal',
    fireModuleTitle: 'Fire & Explosion Response',
    fireModuleDesc: 'Methane flare-up, coal conveyor friction fires, ABC dry powder, emergency intake airway escape',
    gasModuleTitle: 'Gas Leak & Confined Space Protocol',
    gasModuleDesc: 'CH4, CO, H2S, O2 monitoring, Filter Self-Rescuer (FSR), SCBA donning & refuge chamber navigation',
    ppeSelectorTitle: 'Underground Mandatory PPE Protocol Checkpoint',
    ppeSelectorPrompt: 'Verify FSR, Multi-Gas Cap Lamp, and SCBA before entering contaminated zone',
    evacuationTitle: 'Spatial Evacuation Floor Guidance',
    evacuationPrompt: 'Follow dynamic AR floor chevrons toward nearest Fresh Air Base or Refuge Chamber',
    downloadPdf: 'Download Official Pass',
    shareCert: 'Share Credential',
    close: 'Close',
    cancel: 'Cancel',
    arScreenTitle: 'AR Spatial Hazard Simulation',
    arScreenSubtitle: 'Real-time spatial SLAM tracking, gas threshold alerts, and bottom drawer response',
    switchCameraFacing: 'Switch Camera',
    torchToggle: 'Cap Lamp Torch',
    calibrateOrientation: 'Calibrate Gyroscope',
    freezeFrame: 'Freeze Telemetry',
    resumeFeed: 'Resume Live Feed',
    snapshotTaken: 'Hazard telemetry snapshot recorded',
    requestCameraPermission: 'Grant Camera Access for SLAM',
    cameraPermissionDenied: 'Camera permission denied. Using high-fidelity synthetic mine feed.',
    cameraUnavailable: 'Rear camera feed unavailable.',
    selectModule: 'Select Training Module',
    arSensorsActive: 'SLAM Engine Online',
    lowLightWarning: 'Low seam illumination detected. Helmet cap lamp recommended.',
    markerLocked: 'Hazard Target Locked',
    recenterHorizon: 'Recenter AR Horizon',

    orientationPortrait: 'Portrait Mode',
    orientationLandscape: 'Landscape Mode',
    toggleOrientation: 'Toggle Screen Orientation',
    cameraSplit75: 'AR Viewport Active',
    quizSplit25: 'Decision Drawer',
    backCameraOnly: 'REAR CAMERA (SLAM)',
    backCameraActive: 'Back Camera Active',

    scanningArea: 'Area Scan Active',
    rescanArea: 'Rescan Seam',
    surfaceCoherence: 'SLAM Coherence: 98.4%',
    areaMapped: 'Seam Mapped',
    hazardsDetected: 'Hazards Tracked',
    distance: 'Distance',
    targetCrosshair: 'Reticle Lock',
    rangefinder: 'Rangefinder',
    spatialPlaneDetected: 'Floor Plane Anchored',
    scanMode: 'Sensor Filter',
    hazardScan: 'Gas & Hazard',
    slamMesh: 'LiDAR Mesh',
    ppeDetect: 'PPE Check',

    quizTitle: 'Hazard Decision & Action Protocol',
    selectCorrectAction: 'Select statutory safety action:',
    actionRequired: 'Required Action',
    verifyPpe: 'Verify Underground PPE Suite',
    dashboard: 'Dashboard',
    cameraTips: 'Scanner Tips',
    hideTips: 'Hide Tips',

    workerLogin: 'Worker Login',
    adminLogin: 'DGMS Inspector Login',
    employeeId: 'Mining Worker ID',
    password: 'Password',
    signInWorker: 'Login to Vocational Portal',
    signInAdmin: 'Login to DGMS Inspectorate',
    officerId: 'Officer Badge ID / Email',
    quickFill: 'Quick Fill (Demo)',
    welcome: 'Welcome',
    logout: 'Log Out',
    overallProgress: 'Training Progress',
    moduleMastery: 'Module Competency Status',
    portalDescription: 'Government of Jharkhand statutory vocational training simulator and digital certification portal.',
    workerPortalTitle: 'Worker Vocational Portal',
    workerPortalDesc: 'Sign in with your colliery ID to access AR simulations and earn DGMS VTC passes.',
    adminPortalTitle: 'DGMS Compliance Portal',
    adminPortalDesc: 'Mine managers, safety officers, and DGMS inspectors audit portal.',
    passwordPlaceholder: 'Enter passkey',
    loginErrorMissing: 'Please enter both ID and password.',
    loginErrorWorker: 'Invalid worker ID or password. Use demo quick-fill.',
    loginErrorAdmin: 'Invalid inspector credentials.',
    quickFillPasswordNote: 'Demo Password: miner123',

    inspectorate: 'DGMS Inspectorate',
    stateRegistry: 'Jharkhand State Registry',
    totalWorkforce: 'Tracked Workforce',
    fullyCertified: 'DGMS Compliant',
    pendingTraining: 'Pending Refresher',
    auditReadiness: 'Statutory Compliance: 94.2%',
    workersTab: 'Colliery Workforce',
    reportsTab: 'Safety Audit Reports',
    verificationTab: 'QR Verification',
    searchPlaceholder: 'Search miner by name, ID, or seam pit...',
    allMines: 'All Mining Pits',
    allStatuses: 'All Statuses',
    exportCsv: 'Export Compliance CSV',
    workerNameCol: 'Worker & ID',
    collieryCol: 'Colliery Pit',
    categoryCol: 'Cadre',
    fireSafetyCol: 'Fire Protocol',
    gasSafetyCol: 'Gas & SCBA',
    overallScoreCol: 'Exam Score',
    lastTrainedCol: 'Last Certified',
    actionCol: 'Action',
    viewQrCredential: 'View Digital Pass',

    certOfCompetency: 'DGMS VOCATIONAL TRAINING CERTIFICATE',
    certSubtitle: 'DGMS Regulation 1961 Section 114 Compliant',
    holderNameLabel: 'Certified Worker Name',
    holderEmpIdLabel: 'Worker Colliery ID',
    collieryMineLabel: 'Mining Unit & Pit',
    competencyFieldLabel: 'Certified Vocational Protocol',
    issueDateLabel: 'Certification Date',
    expiryDateLabel: 'Valid Until',
    certifyingAuthorityLabel: 'Dy. DGMS / Controller of Mining Examinations',
    dgmsApprovedNote: 'Registered under Directorate General of Mines Safety (Govt. of Jharkhand).',
    tamperProofQr: 'Statutory Tamper-Proof QR Badge',
    scanToVerifyText: 'Scan with smartphone camera to verify authenticity on DGMS registry.',
    backToDashboardBtn: 'Return to Dashboard',
    qrVerifiedTitle: 'DGMS Vocational Credential Verified',
    qrVerifiedDesc: 'Record officially authenticated on Jharkhand Department of Mines registry.',
    verificationAuditPassed: 'DGMS Statutorily Validated',

    // New Audio & Regional Assistant
    listenAssistant: 'Listen / Voice Assistant',
    listenAssistantActive: 'Narrating Scenario & Safety Guidance...',
    voiceCommandHint: 'Speak "Option A", "Option B", or "Option C" to answer hands-free',
    voiceListening: 'Listening for voice command...',
    voiceAnswerRecognized: 'Voice Answer Recognized: ',

    // Glove-Friendly & Expandable Bottom Drawer
    expandDrawer: 'Expand Safety Drawer',
    collapseDrawer: 'Minimize Drawer',
    gloveFriendlyLabel: 'Glove-Friendly Touch Targets (Min 56px)',

    // Gas Monitoring & Environmental Thresholds (DGMS)
    gasMonitoringTitle: 'Underground Gas Telemetry (DGMS Stat. 114)',
    ch4ThresholdWarning: 'CH₄ > 0.75% — WORK STOPPAGE TRIGGERED (DGMS Mandatory Protocol)',
    o2DeficiencyWarning: 'O₂ < 19.0% — OXYGEN DEFICIENCY ALARM (Immediate SCBA Required)',
    coDeadlyThreshold: 'CO > 50 PPM — TOXIC CARBON MONOXIDE ALERT (Evacuate Upstream)',
    h2sToxicThreshold: 'H₂S > 10 PPM — LETHAL SOUR GAS DETECTED (Don Breathing Unit)',
    workStoppageAlert: 'WORK STOPPAGE MANDATED BY DGMS STATUTORY REGULATION',

    // Evacuation Guidance & Spatial Navigation
    evacuationGuidanceTitle: 'Spatial Evacuation Guidance',
    evacFreshAirBase: 'Fresh Air Base (Intake Heading 2 · 48m)',
    evacRefugeChamber: 'Hermetic Refuge Chamber (Crosscut 4 · 110m)',
    evacSelfRescuerStation: 'Self-Rescuer Station (FSR Cache · 24m)',
    followFloorArrows: 'Follow animated floor chevrons toward intake escapeway',

    // Underground PPE Protocol Checkpoint
    undergroundPpeFSR: 'Filter Self-Rescuer (FSR - Mandatory Underground)',
    undergroundPpeCapLampDetector: 'Cap Lamp with Built-in 4-Gas Detector',
    undergroundPpeSCBA: 'Self-Contained Breathing Apparatus (SCBA 30-min)',

    // Offline Engine & DGMS VTC Pass
    offlineEngineTitle: '100% Offline Underground Engine',
    offlineEngineStatus: 'Local SLAM Anchors Cached · Voice Engine Cached · Zero Cloud Needed',
    dgmsVtcPassTitle: 'DGMS Vocational Training Center (VTC) Digital Pass',
    downloadVtcBadge: 'Download DGMS VTC Digital Pass (QR Badge)',
    vtcCreditProof: 'VTC Credit Verified · Reg. 114 Approved',
  },

  // =========================================================================
  // HINDI (हिंदी)
  // =========================================================================
  hi: {
    appName: 'माइंडिंग माइंस',
    tagline: 'व्यावसायिक खदान सुरक्षा प्रशिक्षण एवं डीजीएमएस प्रमाणन',
    govtHeader: 'झारखंड सरकार',
    govtSubheader: 'खान सुरक्षा महानिदेशालय (DGMS) वैधानिक अनुपालन प्रणाली',
    selectLanguage: 'प्रशिक्षण भाषा चुनें',
    chooseLanguageDesc: 'ऑडियो मार्गदर्शन एवं निर्देशों हेतु अपनी क्षेत्रीय बोली चुनें',
    continueBtn: 'कार्यक्षेत्र में आगे बढ़ें',
    workerTitle: 'खनन कामगार प्रोफ़ाइल',
    workerName: 'राहुल कुमार',
    workerMine: 'पिट 4B शाफ्ट, बीसीसीएल धनबाद',
    progressTitle: 'वैधानिक सुरक्षा प्रगति',
    modulesCompleted: 'प्रमाणित मॉड्यूल',
    startTraining: 'एआर प्रशिक्षण शुरू करें',
    retakeTraining: 'एआर पुनः अभ्यास',
    certifiedBadge: 'DGMS प्रमाणित',
    notCompletedBadge: 'अनुपालन अनिवार्य',
    trainingProgress: 'कुल प्रशिक्षण प्रगति',
    myCertificates: 'डीजीएमएस वीटीसी डिजिटल पास',
    viewCertificate: 'डिजिटल पास देखें',
    offlineStatus: '100% ऑफ़लाइन तैयार (स्थानीय SLAM एंकर सहेजे गए)',
    arTrainingMode: 'स्थानिक एआर सिम्युलेटर',
    pointCameraInstruction: 'कोयला सीम, कन्वेयर या सुरंग की ओर पिछला कैमरा लक्षित करें',
    cameraLive: 'लाइव पिछला कैमरा',
    cameraSimulated: 'सिम्युलेटेड भूमिगत खदान',
    toggleCamera: 'कैमरा टॉगल करें',
    nextScenario: 'अगला खतरा परिदृश्य',
    finishSimulation: 'डीजीएमएस योग्यता परीक्षा दें',
    correctDecision: 'वैधानिक सुरक्षा प्रोटोकॉल का सटीक पालन!',
    incorrectDecision: 'सुरक्षा नियम उल्लंघन पाया गया!',
    tryAgain: 'पुनः प्रयास करें',
    startAssessment: 'डीजीएमएस प्रमाणन परीक्षा आरंभ करें',
    assessmentTitle: 'डीजीएमएस विनियम 114 योग्यता परीक्षा',
    questionOf: 'प्रश्न',
    submitAnswer: 'निर्णय सत्यापित करें',
    trainingComplete: 'व्यावसायिक मॉड्यूल सफलतापूर्वक उत्तीर्ण!',
    finalScore: 'आधिकारिक परीक्षा प्राप्तांक',
    statusCertified: 'डीजीएमएस वीटीसी पास स्वीकृत',
    statusFailed: 'पुनः परीक्षा आवश्यक (न्यूनतम 70%)',
    generateCertificate: 'डीजीएमएस डिजिटल पास प्राप्त करें',
    verifyCertificate: 'डिजिटल पास सत्यापित करें',
    validCertificate: 'वैधानिक रूप से मान्य साख',
    adminPortal: 'डीजीएमएस महानिरीक्षक पोर्टल',
    workerApp: 'कामगार एआर पोर्टल',
    fireModuleTitle: 'आग एवं विस्फोट आपातकालीन प्रतिक्रिया',
    fireModuleDesc: 'मीथेन भड़कना, कन्वेयर घर्षण आग, एबीसी ड्राई पाउडर, ताजी हवा इनटेक निकास',
    gasModuleTitle: 'गैस रिसाव एवं संकीर्ण सुरंग प्रोटोकॉल',
    gasModuleDesc: 'CH4, CO, H2S, O2 निगरानी, फिल्टर सेल्फ-रेस्क्यूअर (FSR), एससीबीए एवं शरण कक्ष',
    ppeSelectorTitle: 'भूमिगत अनिवार्य पीपीई प्रोटोकॉल चेकपॉइंट',
    ppeSelectorPrompt: 'संक्रमित क्षेत्र में जाने से पूर्व एफएसआर, गैस डिटेक्टर लैंप एवं एससीबीए जांचें',
    evacuationTitle: 'स्थानिक निकासी फर्श दिशा-निर्देश',
    evacuationPrompt: 'ताजी हवा बेस या शरण कक्ष की ओर जाने वाले एआर फर्श तीरों का अनुसरण करें',
    downloadPdf: 'आधिकारिक पास डाउनलोड करें',
    shareCert: 'पास साझा करें',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    arScreenTitle: 'स्थानिक एआर खदान सुरक्षा सिम्युलेटर',
    arScreenSubtitle: 'रीयल-टाइम SLAM ट्रैकिंग, गैस सीमा अलार्म और दस्ताना-अनुकूल बॉटम ड्रॉअर',
    switchCameraFacing: 'कैमरा बदलें',
    torchToggle: 'कैप लैंप टॉर्च',
    calibrateOrientation: 'जाइरोस्कोप कैलिब्रेट करें',
    freezeFrame: 'टेलीमेट्री फ्रीज करें',
    resumeFeed: 'लाइव फीड जारी रखें',
    snapshotTaken: 'खतरा स्नैपशॉट सहेजा गया',
    requestCameraPermission: 'SLAM हेतु कैमरा अनुमति दें',
    cameraPermissionDenied: 'कैमरा अनुमति अस्वीकृत। वर्चुअल खदान दृश्य सक्रिय।',
    cameraUnavailable: 'पिछला कैमरा उपलब्ध नहीं है।',
    selectModule: 'प्रशिक्षण मॉड्यूल चुनें',
    arSensorsActive: 'SLAM इंजन सक्रिय',
    lowLightWarning: 'कम रोशनी का पता चला। हेलमेट कैप लैंप चालू करें।',
    markerLocked: 'खतरा बिंदु लॉक हुआ',
    recenterHorizon: 'क्षितिज पुनः केंद्रित करें',

    orientationPortrait: 'पोर्ट्रेट मोड',
    orientationLandscape: 'लैंडस्केप मोड',
    toggleOrientation: 'स्क्रीन ओरिएंटेशन बदलें',
    cameraSplit75: 'एआर व्यूपोर्ट सक्रिय',
    quizSplit25: 'निर्णय ड्रॉअर',
    backCameraOnly: 'पिछला कैमरा (SLAM)',
    backCameraActive: 'पिछला कैमरा सक्रिय',

    scanningArea: 'क्षेत्र स्कैन चालू',
    rescanArea: 'सीम पुनः स्कैन करें',
    surfaceCoherence: 'SLAM स्थिरता: 98.4%',
    areaMapped: 'सीम प्रतिचित्रित',
    hazardsDetected: 'पहचाने गए खतरे',
    distance: 'दूरी',
    targetCrosshair: 'लक्ष्य क्रॉसहेयर',
    rangefinder: 'रेंजफाइंडर',
    spatialPlaneDetected: 'फर्श समतल एंकर हुआ',
    scanMode: 'सेंसर फिल्टर',
    hazardScan: 'गैस एवं खतरा',
    slamMesh: 'LiDAR मेश',
    ppeDetect: 'पीपीई जांच',

    quizTitle: 'खतरा निर्णय एवं कार्य प्रोटोकॉल',
    selectCorrectAction: 'वैधानिक सुरक्षा कार्रवाई चुनें:',
    actionRequired: 'आवश्यक कार्रवाई',
    verifyPpe: 'भूमिगत पीपीई किट सत्यापित करें',
    dashboard: 'डैशबोर्ड',
    cameraTips: 'कैमरा दिशा-निर्देश',
    hideTips: 'दिशा-निर्देश छिपाएं',

    workerLogin: 'कामगार लॉगिन',
    adminLogin: 'डीजीएमएस निरीक्षक लॉगिन',
    employeeId: 'खनन कामगार आईडी',
    password: 'पासवर्ड',
    signInWorker: 'व्यावसायिक पोर्टल में प्रवेश करें',
    signInAdmin: 'डीजीएमएस निरीक्षक पोर्टल में प्रवेश करें',
    officerId: 'अधिकारी बैज संख्या / ईमेल',
    quickFill: 'त्वरित भरें (डेमो)',
    welcome: 'स्वागत है',
    logout: 'लॉगआउट',
    overallProgress: 'प्रशिक्षण प्रगति',
    moduleMastery: 'मॉड्यूल निपुणता स्थिति',
    portalDescription: 'झारखंड सरकार की वैधानिक व्यावसायिक खदान सुरक्षा प्रशिक्षण एवं डिजिटल प्रमाणन प्रणाली।',
    workerPortalTitle: 'कामगार सुरक्षा पोर्टल',
    workerPortalDesc: 'एआर प्रशिक्षण प्राप्त करने और डीजीएमएस वीटीसी पास पाने हेतु कामगार आईडी से लॉगिन करें।',
    adminPortalTitle: 'डीजीएमएस अनुपालन पोर्टल',
    adminPortalDesc: 'खान प्रबंधक, सुरक्षा अधिकारी एवं डीजीएमएस निरीक्षकों हेतु ऑडिट कंसोल।',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    loginErrorMissing: 'कृपया आईडी और पासवर्ड दोनों दर्ज करें।',
    loginErrorWorker: 'अमान्य कामगार आईडी या पासवर्ड। डेमो त्वरित-भरें का उपयोग करें।',
    loginErrorAdmin: 'अमान्य निरीक्षक क्रेडेंशियल।',
    quickFillPasswordNote: 'डेमो पासवर्ड: miner123',

    inspectorate: 'डीजीएमएस निदेशालय',
    stateRegistry: 'झारखंड राज्य खनन पंजी',
    totalWorkforce: 'पंजीकृत कार्यबल',
    fullyCertified: 'डीजीएमएस अनुपालन पूर्ण',
    pendingTraining: 'प्रशिक्षण प्रतीक्षारत',
    auditReadiness: 'वैधानिक अनुपालन: 94.2%',
    workersTab: 'खदान कामगार सूची',
    reportsTab: 'सुरक्षा ऑडिट रिपोर्ट',
    verificationTab: 'क्यूआर सत्यापन',
    searchPlaceholder: 'नाम, आईडी या खदान पिट द्वारा खोजें...',
    allMines: 'सभी खदान ब्लॉक',
    allStatuses: 'सभी स्थितियां',
    exportCsv: 'अनुपालन CSV डाउनलोड करें',
    workerNameCol: 'कामगार एवं आईडी',
    collieryCol: 'खदान पिट',
    categoryCol: 'श्रेणी',
    fireSafetyCol: 'अग्नि सुरक्षा',
    gasSafetyCol: 'गैस एवं एससीबीए',
    overallScoreCol: 'परीक्षा अंक',
    lastTrainedCol: 'अंतिम प्रमाणन',
    actionCol: 'कार्रवाई',
    viewQrCredential: 'डिजिटल पास देखें',

    certOfCompetency: 'डीजीएमएस व्यावसायिक प्रशिक्षण प्रमाण पत्र',
    certSubtitle: 'खान सुरक्षा महानिदेशालय विनियम 1961 धारा 114 अनुपालन',
    holderNameLabel: 'प्रमाणित कामगार का नाम',
    holderEmpIdLabel: 'कामगार आईडी',
    collieryMineLabel: 'खनन ब्लॉक एवं पिट',
    competencyFieldLabel: 'प्रमाणित सुरक्षा प्रोटोकॉल',
    issueDateLabel: 'जारी करने की तिथि',
    expiryDateLabel: 'मान्यता समाप्त तिथि',
    certifyingAuthorityLabel: 'उप महानिदेशक / परीक्षा नियंत्रक (डीजीएमएस)',
    dgmsApprovedNote: 'खान सुरक्षा महानिदेशालय (झारखंड सरकार) के अधीन पंजीकृत एवं डिजिटल रूप से सत्यापित।',
    tamperProofQr: 'छेड़छाड़-मुक्त वैधानिक क्यूआर कोड',
    scanToVerifyText: 'डीजीएमएस पंजी पर प्रामाणिकता जांचने हेतु किसी भी फोन से क्यूआर स्कैन करें।',
    backToDashboardBtn: 'डैशबोर्ड पर वापस लौटें',
    qrVerifiedTitle: 'डीजीएमएस व्यावसायिक साख सत्यापित',
    qrVerifiedDesc: 'खान एवं भूतत्व विभाग, झारखंड सरकार के केंद्रीय रिकॉर्ड से प्रमाणित।',
    verificationAuditPassed: 'डीजीएमएस वैधानिक ऑडिट: उत्तीर्ण एवं सक्रिय',

    listenAssistant: 'सुनें / आवाज सहायक',
    listenAssistantActive: 'सुरक्षा परिदृश्य एवं प्रश्नों का ऑडियो वाचन चालू...',
    voiceCommandHint: 'हाथ मुक्त उत्तर देने हेतु बोलें: "विकल्प A", "विकल्प B" या "विकल्प C"',
    voiceListening: 'आपकी आवाज सुनी जा रही है...',
    voiceAnswerRecognized: 'आवाज द्वारा पहचाना गया उत्तर: ',

    expandDrawer: 'निर्णय ड्रॉअर खोलें',
    collapseDrawer: 'ड्रॉअर छोटा करें',
    gloveFriendlyLabel: 'दस्ताना-अनुकूल बड़े टच कार्ड (न्यूनतम 56px)',

    gasMonitoringTitle: 'भूमिगत गैस टेलीमेट्री (डीजीएमएस धारा 114)',
    ch4ThresholdWarning: 'CH₄ > 0.75% — कार्य रोक आदेश जारी (डीजीएमएस अनिवार्य नियम)',
    o2DeficiencyWarning: 'O₂ < 19.0% — ऑक्सीजन की गंभीर कमी अलार्म (तत्काल एससीबीए पहनें)',
    coDeadlyThreshold: 'CO > 50 PPM — घातक कार्बन मोनोऑक्साइड चेतावनी (तुरंत इनटेक की ओर जाएं)',
    h2sToxicThreshold: 'H₂S > 10 PPM — जहरीली हाइड्रोजन सल्फाइड चेतावनी (श्वसन यंत्र अनिवार्य)',
    workStoppageAlert: 'डीजीएमएस वैधानिक नियम के तहत कार्य तत्काल रोकना अनिवार्य',

    evacuationGuidanceTitle: 'स्थानिक एआर निकासी फर्श मार्गदर्शन',
    evacFreshAirBase: 'ताजी हवा बेस (इनटेक हेडिंग 2 · 48 मीटर)',
    evacRefugeChamber: 'वायुरोधी शरण कक्ष (रिफ्यूज चैंबर 4 · 110 मीटर)',
    evacSelfRescuerStation: 'सेल्फ-रेस्क्यूअर स्टेशन (FSR भंडार · 24 मीटर)',
    followFloorArrows: 'फर्श पर चमकते एआर तीरों के साथ ताजी हवा की ओर बढ़ें',

    undergroundPpeFSR: 'फिल्टर सेल्फ-रेस्क्यूअर (FSR - भूमिगत अनिवार्य)',
    undergroundPpeCapLampDetector: '4-गैस डिटेक्टर युक्त सुरक्षा कैप लैंप',
    undergroundPpeSCBA: 'सेल्फ-कंटेंड ब्रीदिंग एपरेटस (SCBA 30-मिनट)',

    offlineEngineTitle: '100% ऑफ़लाइन भूमिगत इंजन',
    offlineEngineStatus: 'स्थानीय SLAM एंकर सहेजे गए · आवाज पैक कैश्ड · इंटरनेट की कोई जरूरत नहीं',
    dgmsVtcPassTitle: 'डीजीएमएस व्यावसायिक प्रशिक्षण केंद्र (VTC) डिजिटल पास',
    downloadVtcBadge: 'डीजीएमएस वीटीसी डिजिटल पास डाउनलोड करें (क्यूआर बैज)',
    vtcCreditProof: 'वीटीसी क्रेडिट सत्यापित · विनियम 114 स्वीकृत',
  },

  // =========================================================================
  // KHORTHA (खोरठा - झारखंड कोयला क्षेत्र)
  // =========================================================================
  khr: {
    appName: 'माइंडिंग माइंस',
    tagline: 'खदान सुरक्षा सीख आउर डीजीएमएस डिजिटल पास',
    govtHeader: 'झारखंड सरकार',
    govtSubheader: 'खान सुरक्षा महानिदेशालय (DGMS) नियम 114 अनुपालन',
    selectLanguage: 'भाखा चुना',
    chooseLanguageDesc: 'सुने खातिर आउर समझे खातिर आपन खोरठा भाखा चुना',
    continueBtn: 'खदान में आगे बढ़ा',
    workerTitle: 'कोयला कामगार प्रोफ़ाइल',
    workerName: 'राहुल कुमार',
    workerMine: 'पिट 4B शाफ्ट, बीसीसीएल धनबाद',
    progressTitle: 'सुरक्षा प्रगति',
    modulesCompleted: 'पास भेल मॉड्यूल',
    startTraining: 'AR सिखाई शुरू करा',
    retakeTraining: 'दोबारा अभ्यास करा',
    certifiedBadge: 'DGMS पास',
    notCompletedBadge: 'ट्रेनिंग बाकी हे',
    trainingProgress: 'कुल ट्रेनिंग प्रगति',
    myCertificates: 'डीजीएमएस VTC डिजिटल पास',
    viewCertificate: 'डिजिटल पास देखा',
    offlineStatus: '100% बिना नेट के चले (स्थानीय SLAM सहेजल हे)',
    arTrainingMode: 'AR कैमरा सिम्युलेटर',
    pointCameraInstruction: 'कोयला सीम, कन्वेयर चाहे सुरुंग दने पिछला कैमरा करा',
    cameraLive: 'लाइव पिछला कैमरा',
    cameraSimulated: 'सिम्युलेटेड खदान दृश्य',
    toggleCamera: 'कैमरा बदलो',
    nextScenario: 'आगू खतरा देखा',
    finishSimulation: 'डीजीएमएस परीक्षा देवा',
    correctDecision: 'एकदम सही सुरक्षा नियम मनला!',
    incorrectDecision: 'गलत काम! सुरक्षा नियम टूट गेल!',
    tryAgain: 'दोबारा कोसिस करा',
    startAssessment: 'DGMS परीक्षा शुरू करा',
    assessmentTitle: 'डीजीएमएस नियम 114 परीक्षा',
    questionOf: 'सवाल',
    submitAnswer: 'जवाब जमा करा',
    trainingComplete: 'बधाई! पास भेल!',
    finalScore: 'परीक्षा अंक',
    statusCertified: 'डीजीएमएस पास मिल गेल',
    statusFailed: 'फेल भेल, फेर से परीक्षा देवा (70% चाही)',
    generateCertificate: 'डिजिटल पास बनावा',
    verifyCertificate: 'पास के जांच करा',
    validCertificate: 'सरकारी सही पास',
    adminPortal: 'DGMS अफसर पोर्टल',
    workerApp: 'कामगार AR पोर्टल',
    fireModuleTitle: 'आग आउर विस्फोट बचाव',
    fireModuleDesc: 'मीथेन भड़कना, कन्वेयर बेल्ट आग, एबीसी पाऊडर, सफा हवा निकास',
    gasModuleTitle: 'जहरीला गैस आउर सुरुंग बचाव',
    gasModuleDesc: 'CH4, CO, H2S, O2 जांच, FSR, एससीबीए आउर सरन कोठरी (रिफ्यूज चैंबर)',
    ppeSelectorTitle: 'खदान में जरूरी PPE जांच चौकी',
    ppeSelectorPrompt: 'गैस वाला इलाका जाए से पहिले FSR, गैस डिटेक्टर लैंप आउर SCBA जांचा',
    evacuationTitle: 'जमीन पर तीर देख के भागा',
    evacuationPrompt: 'सफा हवा बेस चाहे सरन कोठरी दने जाहि तीर बतावे उहे दने चला',
    downloadPdf: 'पास डाउनलोड करा',
    shareCert: 'पास शेयर करा',
    close: 'बंद करा',
    cancel: 'काटा',
    arScreenTitle: 'AR खदान सुरक्षा सिम्युलेटर',
    arScreenSubtitle: 'रीयल-टाइम SLAM ट्रैकिंग, गैस खतरा अलार्म आउर बड़ा दस्ताना बटन',
    switchCameraFacing: 'कैमरा पलटा',
    torchToggle: 'टोपी बत्ती (टॉर्च)',
    calibrateOrientation: 'जाइरो ठीक करा',
    freezeFrame: 'फोटो रोका',
    resumeFeed: 'कैमरा चालू करा',
    snapshotTaken: 'खतरा फोटो खिचा गेल',
    requestCameraPermission: 'कैमरा हुकूम देवा',
    cameraPermissionDenied: 'कैमरा बन्द हे, वर्चुअल खदान देखावल जाइत हे।',
    cameraUnavailable: 'पिछला कैमरा नय चललो।',
    selectModule: 'सिखाई मॉड्यूल चुना',
    arSensorsActive: 'SLAM सेंसर चालू हे',
    lowLightWarning: 'अन्हार हे, माथा के कैप लैंप जलावा।',
    markerLocked: 'खतरा लॉक भेल',
    recenterHorizon: 'कैमरा सीधा करा',

    orientationPortrait: 'खड़ा स्क्रीन',
    orientationLandscape: 'पट स्क्रीन',
    toggleOrientation: 'स्क्रीन पलटा',
    cameraSplit75: 'AR कैमरा चालू',
    quizSplit25: 'सवाल ड्रॉअर',
    backCameraOnly: 'पिछला कैमरा (SLAM)',
    backCameraActive: 'पिछला कैमरा चालू हे',

    scanningArea: 'स्कैन चालू हे',
    rescanArea: 'फेर से स्कैन करा',
    surfaceCoherence: 'SLAM स्थिरता: 98.4%',
    areaMapped: 'नक्शा बनल',
    hazardsDetected: 'खतरा मिलल',
    distance: 'दूरी',
    targetCrosshair: 'निशाना',
    rangefinder: 'दूरी मापक',
    spatialPlaneDetected: 'जमीन पकड़ल',
    scanMode: 'सेंसर फिल्टर',
    hazardScan: 'गैस आउर खतरा',
    slamMesh: 'LiDAR जाल',
    ppeDetect: 'सामान जांच',

    quizTitle: 'खतरा निर्णय आउर काम',
    selectCorrectAction: 'सही सुरक्षा काम चुना:',
    actionRequired: 'ई काम करा',
    verifyPpe: 'खदान PPE सामान जांचा',
    dashboard: 'डैशबोर्ड',
    cameraTips: 'कैमरा सलाह',
    hideTips: 'सलाह नुकावा',

    workerLogin: 'कामगार लॉगिन',
    adminLogin: 'DGMS अफसर लॉगिन',
    employeeId: 'कामगार आईडी',
    password: 'पासवर्ड',
    signInWorker: 'कामगार पोर्टल में ढुका',
    signInAdmin: 'अफसर पोर्टल में ढुका',
    officerId: 'अफसर आईडी / ईमेल',
    quickFill: 'झटपट भरा (डेमो)',
    welcome: 'जोहार / स्वागत हे',
    logout: 'बाहर निकसा',
    overallProgress: 'सिखाई के हाल',
    moduleMastery: 'मॉड्यूल में जानकारी',
    portalDescription: 'झारखंड सरकार के खदान सुरक्षा आउर डिजिटल पास पोर्टल।',
    workerPortalTitle: 'कामगार सुरक्षा पोर्टल',
    workerPortalDesc: 'आपन आईडी देके घुसा आउर सरकारी VTC पास पावा।',
    adminPortalTitle: 'DGMS अफसर पोर्टल',
    adminPortalDesc: 'खदान सुरक्षा अफसर आउर मैनेजर खातिर।',
    passwordPlaceholder: 'पासवर्ड लिखा',
    loginErrorMissing: 'आईडी आउर पासवर्ड दूनो लिखा।',
    loginErrorWorker: 'गलत आईडी चाहे पासवर्ड। डेमो वाला चुना।',
    loginErrorAdmin: 'गलत अफसर पासवर्ड।',
    quickFillPasswordNote: 'डेमो पासवर्ड: miner123',

    inspectorate: 'DGMS इंस्पेक्टोरेट',
    stateRegistry: 'झारखंड खदान खाता',
    totalWorkforce: 'कुल मजदूर',
    fullyCertified: 'पास भेल मजदूर',
    pendingTraining: 'ट्रेनिंग बाकी',
    auditReadiness: 'सरकारी जांच तैयार: 94.2%',
    workersTab: 'कामगार लिस्ट',
    reportsTab: 'सुरक्षा रिपोर्ट',
    verificationTab: 'QR जांच',
    searchPlaceholder: 'नाम, आईडी चाहे खदान खोजा...',
    allMines: 'सब खदान ब्लॉक',
    allStatuses: 'सब हाल',
    exportCsv: 'CSV फाइल डाऊनलोड',
    workerNameCol: 'नाम आउर आईडी',
    collieryCol: 'खदान पिट',
    categoryCol: 'वर्ग',
    fireSafetyCol: 'आग सुरक्षा',
    gasSafetyCol: 'गैस आउर SCBA',
    overallScoreCol: 'नंबर',
    lastTrainedCol: 'तारीख',
    actionCol: 'काम',
    viewQrCredential: 'पास देखा',

    certOfCompetency: 'DGMS खदान सुरक्षा पास',
    certSubtitle: 'DGMS नियम 1961 धारा 114 अनुपालन',
    holderNameLabel: 'मजदूर के नाम',
    holderEmpIdLabel: 'मजदूर आईडी',
    collieryMineLabel: 'खदान इलाका',
    competencyFieldLabel: 'पास भेल विषय',
    issueDateLabel: 'मिले के तारीख',
    expiryDateLabel: 'चले के तारीख',
    certifyingAuthorityLabel: 'DGMS परीक्षा नियंत्रक',
    dgmsApprovedNote: 'ई पास झारखंड सरकार DGMS से सरकारी रूप से जारी भेल हे।',
    tamperProofQr: 'सरकारी QR कोड',
    scanToVerifyText: 'फोन से स्कैन कर के सरकारी पास के जांच करा।',
    backToDashboardBtn: 'डैशबोर्ड घुरा',
    qrVerifiedTitle: 'DGMS पास सही साबित भेल',
    qrVerifiedDesc: 'झारखंड सरकार के खाता से सही मिलल।',
    verificationAuditPassed: 'सरकारी जांच: पास आउर चालू',

    listenAssistant: 'सुनऽ / आवाज सहायक',
    listenAssistantActive: 'आवाज से सवाल आउर नियम पढ़ल जाइत हे...',
    voiceCommandHint: 'बोली से जवाब देवा: बोलऽ "विकल्प A", "विकल्प B" चाहे "विकल्प C"',
    voiceListening: 'तोहर आवाज सुनल जाइत हे...',
    voiceAnswerRecognized: 'पहचानल जवाब: ',

    expandDrawer: 'सवाल दराज खोला',
    collapseDrawer: 'दराज छोटा करा',
    gloveFriendlyLabel: 'दस्ताना खातिर बड़ा बटन (कम से कम 56px)',

    gasMonitoringTitle: 'खदान गैस मीटर (DGMS धारा 114)',
    ch4ThresholdWarning: 'CH₄ > 0.75% — काम रोको हुकुम! (DGMS नियम से काम बन्द)',
    o2DeficiencyWarning: 'O₂ < 19.0% — हवा कम भेल अलार्म! (तुरंत SCBA लगावा)',
    coDeadlyThreshold: 'CO > 50 PPM — जानलेवा गैस अलार्म! (उपर दने भागा)',
    h2sToxicThreshold: 'H₂S > 10 PPM — जहरीला गैस अलार्म! (सांस यंत्र पहिना)',
    workStoppageAlert: 'DGMS नियम के तहत तुरंत काम रोके के हुकुम',

    evacuationGuidanceTitle: 'जमीन पर तीर देख के निकसा',
    evacFreshAirBase: 'सफा हवा बेस (इनटेक हेडिंग 2 · 48 मीटर)',
    evacRefugeChamber: 'सरन कोठरी रिफ्यूज चैंबर (क्रॉसकट 4 · 110 मीटर)',
    evacSelfRescuerStation: 'सेल्फ-रेस्क्यूअर स्टेशन (FSR अलमारी · 24 मीटर)',
    followFloorArrows: 'जमीन पर चमकता तीर के पीछे-पीछे सफा हवा दने चला',

    undergroundPpeFSR: 'फिल्टर सेल्फ-रेस्क्यूअर (FSR - खदान में अनिवार्य)',
    undergroundPpeCapLampDetector: '4-गैस डिटेक्टर वाला कैप लैंप',
    undergroundPpeSCBA: 'सेल्फ-कंटेंड ब्रीदिंग एपरेटस (SCBA 30-मिनट)',

    offlineEngineTitle: '100% बिना नेट के चले',
    offlineEngineStatus: 'स्थानीय SLAM एंकर सहेजल हे · बोली इंजन कैश्ड हे · नेट नय चाही',
    dgmsVtcPassTitle: 'DGMS VTC डिजिटल पास',
    downloadVtcBadge: 'DGMS VTC डिजिटल पास डाउनलोड करा (QR बैज)',
    vtcCreditProof: 'VTC क्रेडिट पक्का भेल · नियम 114 पास',
  },

  // =========================================================================
  // NAGPURI (नागपुरी / सादरी - छोटानागपुर क्षेत्र)
  // =========================================================================
  nag: {
    appName: 'माइंडिंग माइंस',
    tagline: 'खदान सुरक्षा सिखाई आउर डीजीएमएस डिजिटल पास',
    govtHeader: 'झारखंड सरकार',
    govtSubheader: 'खान सुरक्षा महानिदेशालय (DGMS) नियम 114 अनुपालन',
    selectLanguage: 'भाषा चुना',
    chooseLanguageDesc: 'सुने ले आउर बुझे ले नागपुरी भाषा चुना',
    continueBtn: 'काम में आगे बढ़ा',
    workerTitle: 'कोयला खदान कामगार',
    workerName: 'राहुल कुमार',
    workerMine: 'पिट 4B शाफ्ट, बीसीसीएल धनबाद',
    progressTitle: 'सुरक्षा सिखाई के हाल',
    modulesCompleted: 'पास भेल भाग',
    startTraining: 'AR सिखाई शुरू करा',
    retakeTraining: 'दोबारा अभ्यास करा',
    certifiedBadge: 'DGMS पास',
    notCompletedBadge: 'सिखाई बाकी आहे',
    trainingProgress: 'कुल सिखाई प्रगति',
    myCertificates: 'DGMS VTC डिजिटल पास',
    viewCertificate: 'डिजिटल पास देखू',
    offlineStatus: '100% बिना इंटरनेट चालू (SLAM सहेजल आहे)',
    arTrainingMode: 'AR कैमरा सिम्युलेटर',
    pointCameraInstruction: 'कोयला सीम चाहे सुरुंग दने पिछला कैमरा करा',
    cameraLive: 'लाइव पिछला कैमरा',
    cameraSimulated: 'सिम्युलेटेड खदान',
    toggleCamera: 'कैमरा बदलो',
    nextScenario: 'आगू खतरा देखू',
    finishSimulation: 'DGMS परीक्षा देऊ',
    correctDecision: 'बिल्कुल सही सुरक्षा नियम मनली!',
    incorrectDecision: 'गलती भेल! सुरक्षा नियम टूट गेल!',
    tryAgain: 'दोबारा कोसिस करू',
    startAssessment: 'DGMS परीक्षा शुरू करा',
    assessmentTitle: 'DGMS नियम 114 परीक्षा',
    questionOf: 'सवाल',
    submitAnswer: 'जवाब जमा करू',
    trainingComplete: 'बधाई! पास भेल!',
    finalScore: 'परीक्षा अंक',
    statusCertified: 'DGMS पास मिल गेल',
    statusFailed: 'फेर से परीक्षा देऊ (70% चाही)',
    generateCertificate: 'डिजिटल पास बनाऊ',
    verifyCertificate: 'पास के जांच करू',
    validCertificate: 'सरकारी सही पास',
    adminPortal: 'DGMS अफसर पोर्टल',
    workerApp: 'कामगार AR पोर्टल',
    fireModuleTitle: 'आग आउर विस्फोट बचाव',
    fireModuleDesc: 'मीथेन भड़कना, कन्वेयर आग, एबीसी पाऊडर, सफा हवा निकास',
    gasModuleTitle: 'जहरीला गैस आउर सुरुंग बचाव',
    gasModuleDesc: 'CH4, CO, H2S, O2 जांच, FSR, एससीबीए आउर बचाव कोठरी',
    ppeSelectorTitle: 'खदान में जरूरी PPE जांच चौकी',
    ppeSelectorPrompt: 'गैस वाला जगह जाए से पहिले FSR, गैस डिटेक्टर लैंप आउर SCBA जांचू',
    evacuationTitle: 'जमीन पर तीर देख के भागा',
    evacuationPrompt: 'ताजा हवा बेस चाहे बचाव कोठरी दने जाहि तीर बतावे उहे दने जाऊ',
    downloadPdf: 'पास डाउनलोड करू',
    shareCert: 'पास शेयर करू',
    close: 'बंद करू',
    cancel: 'रद्द करू',
    arScreenTitle: 'AR खदान सुरक्षा सिम्युलेटर',
    arScreenSubtitle: 'रीयल-टाइम SLAM ट्रैकिंग, गैस खतरा अलार्म आउर बड़ा दस्ताना बटन',
    switchCameraFacing: 'कैमरा पलटा',
    torchToggle: 'कैप लैंप टॉर्च',
    calibrateOrientation: 'जाइरो ठीक करू',
    freezeFrame: 'फोटो रोका',
    resumeFeed: 'कैमरा चालू करू',
    snapshotTaken: 'खतरा फोटो खिचा गेल',
    requestCameraPermission: 'कैमरा अनुमति देऊ',
    cameraPermissionDenied: 'कैमरा बन्द आहे, वर्चुअल खदान देखावल जाई।',
    cameraUnavailable: 'पिछला कैमरा नय चललक।',
    selectModule: 'सिखाई भाग चुना',
    arSensorsActive: 'SLAM सेंसर चालू आहे',
    lowLightWarning: 'अन्हार आहे, माथा के कैप लैंप जलावा।',
    markerLocked: 'खतरा लॉक भेल',
    recenterHorizon: 'कैमरा सीधा करू',

    orientationPortrait: 'खड़ा स्क्रीन',
    orientationLandscape: 'पट स्क्रीन',
    toggleOrientation: 'स्क्रीन पलटा',
    cameraSplit75: 'AR कैमरा चालू',
    quizSplit25: 'सवाल ड्रॉअर',
    backCameraOnly: 'पिछला कैमरा (SLAM)',
    backCameraActive: 'पिछला कैमरा चालू आहे',

    scanningArea: 'स्कैन चालू आहे',
    rescanArea: 'फेर से स्कैन करू',
    surfaceCoherence: 'SLAM स्थिरता: 98.4%',
    areaMapped: 'नक्शा बनल',
    hazardsDetected: 'खतरा मिलल',
    distance: 'दूरी',
    targetCrosshair: 'निशाना',
    rangefinder: 'दूरी मापक',
    spatialPlaneDetected: 'जमीन पकड़ल',
    scanMode: 'सेंसर फिल्टर',
    hazardScan: 'गैस आउर खतरा',
    slamMesh: 'LiDAR जाल',
    ppeDetect: 'सामान जांच',

    quizTitle: 'खतरा निर्णय आउर काम',
    selectCorrectAction: 'सही सुरक्षा काम चुना:',
    actionRequired: 'ई काम करू',
    verifyPpe: 'खदान PPE सामान जांचू',
    dashboard: 'डैशबोर्ड',
    cameraTips: 'कैमरा सलाह',
    hideTips: 'सलाह नुकाऊ',

    workerLogin: 'कामगार लॉगिन',
    adminLogin: 'DGMS अफसर लॉगिन',
    employeeId: 'कामगार आईडी',
    password: 'पासवर्ड',
    signInWorker: 'कामगार पोर्टल में ढुका',
    signInAdmin: 'अफसर पोर्टल में ढुका',
    officerId: 'अफसर आईडी / ईमेल',
    quickFill: 'झटपट भरा (डेमो)',
    welcome: 'जोहार / स्वागत आहे',
    logout: 'बाहर निकसा',
    overallProgress: 'सिखाई के हाल',
    moduleMastery: 'मॉड्यूल में जानकारी',
    portalDescription: 'झारखंड सरकार के खदान सुरक्षा आउर डिजिटल पास पोर्टल।',
    workerPortalTitle: 'कामगार सुरक्षा पोर्टल',
    workerPortalDesc: 'आपन आईडी देके घुसा आउर सरकारी VTC पास पावा।',
    adminPortalTitle: 'DGMS अफसर पोर्टल',
    adminPortalDesc: 'खदान सुरक्षा अफसर आउर मैनेजर मन ले।',
    passwordPlaceholder: 'पासवर्ड लिखा',
    loginErrorMissing: 'आईडी आउर पासवर्ड दूनो लिखा।',
    loginErrorWorker: 'गलत आईडी चाहे पासवर्ड। डेमो चुना।',
    loginErrorAdmin: 'गलत अफसर पासवर्ड।',
    quickFillPasswordNote: 'डेमो पासवर्ड: miner123',

    inspectorate: 'DGMS इंस्पेक्टोरेट',
    stateRegistry: 'झारखंड खदान खाता',
    totalWorkforce: 'कुल मजदूर',
    fullyCertified: 'पास भेल मजदूर',
    pendingTraining: 'सिखाई बाकी',
    auditReadiness: 'सरकारी जांच तैयार: 94.2%',
    workersTab: 'कामगार लिस्ट',
    reportsTab: 'सुरक्षा रिपोर्ट',
    verificationTab: 'QR जांच',
    searchPlaceholder: 'नाम, आईडी चाहे खदान खोजा...',
    allMines: 'सब खदान ब्लॉक',
    allStatuses: 'सब हाल',
    exportCsv: 'CSV फाइल डाऊनलोड',
    workerNameCol: 'नाम आउर आईडी',
    collieryCol: 'खदान पिट',
    categoryCol: 'श्रेणी',
    fireSafetyCol: 'आग सुरक्षा',
    gasSafetyCol: 'गैस आउर SCBA',
    overallScoreCol: 'नंबर',
    lastTrainedCol: 'तारीख',
    actionCol: 'काम',
    viewQrCredential: 'पास देखू',

    certOfCompetency: 'DGMS खदान सुरक्षा पास',
    certSubtitle: 'DGMS नियम 1961 धारा 114 अनुपालन',
    holderNameLabel: 'मजदूर के नाम',
    holderEmpIdLabel: 'मजदूर आईडी',
    collieryMineLabel: 'खदान इलाका',
    competencyFieldLabel: 'पास भेल विषय',
    issueDateLabel: 'मिले के तारीख',
    expiryDateLabel: 'चले के तारीख',
    certifyingAuthorityLabel: 'DGMS परीक्षा नियंत्रक',
    dgmsApprovedNote: 'ई पास झारखंड सरकार DGMS से सरकारी रूप से जारी भेल आहे।',
    tamperProofQr: 'सरकारी QR कोड',
    scanToVerifyText: 'फोन से स्कैन कर के सरकारी पास के जांच करा।',
    backToDashboardBtn: 'डैशबोर्ड घुरा',
    qrVerifiedTitle: 'DGMS पास सही साबित भेल',
    qrVerifiedDesc: 'झारखंड सरकार के खाता से सही मिलल।',
    verificationAuditPassed: 'सरकारी जांच: पास आउर चालू',

    listenAssistant: 'सुनू / आवाज सहायक',
    listenAssistantActive: 'आवाज से सवाल आउर नियम पढ़ल जाइत आहे...',
    voiceCommandHint: 'बोली से जवाब देऊ: बोलू "विकल्प A", "विकल्प B" चाहे "विकल्प C"',
    voiceListening: 'रउरे मनक आवाज सुनल जाइत आहे...',
    voiceAnswerRecognized: 'पहचानल जवाब: ',

    expandDrawer: 'सवाल दराज खोला',
    collapseDrawer: 'दराज छोटा करू',
    gloveFriendlyLabel: 'दस्ताना खातिर बड़ा बटन (कम से कम 56px)',

    gasMonitoringTitle: 'खदान गैस मीटर (DGMS धारा 114)',
    ch4ThresholdWarning: 'CH₄ > 0.75% — काम रोके के हुकुम! (DGMS नियम से काम बन्द)',
    o2DeficiencyWarning: 'O₂ < 19.0% — हवा कम भेल अलार्म! (तुरंत SCBA लगाऊ)',
    coDeadlyThreshold: 'CO > 50 PPM — जानलेवा गैस अलार्म! (उपर दने भागा)',
    h2sToxicThreshold: 'H₂S > 10 PPM — जहरीला गैस अलार्म! (सांस यंत्र पहिना)',
    workStoppageAlert: 'DGMS नियम के तहत तुरंत काम रोके के हुकुम जारी भेल',

    evacuationGuidanceTitle: 'जमीन पर तीर देख के निकसा',
    evacFreshAirBase: 'ताजा हवा बेस (इनटेक हेडिंग 2 · 48 मीटर)',
    evacRefugeChamber: 'बचाव कोठरी रिफ्यूज चैंबर (क्रॉसकट 4 · 110 मीटर)',
    evacSelfRescuerStation: 'सेल्फ-रेस्क्यूअर स्टेशन (FSR अलमारी · 24 मीटर)',
    followFloorArrows: 'जमीन पर चमकता तीर के पीछे-पीछे ताजा हवा दने जाऊ',

    undergroundPpeFSR: 'फिल्टर सेल्फ-रेस्क्यूअर (FSR - खदान में अनिवार्य)',
    undergroundPpeCapLampDetector: '4-गैस डिटेक्टर वाला कैप लैंप',
    undergroundPpeSCBA: 'सेल्फ-कंटेंड ब्रीदिंग एपरेटस (SCBA 30-मिनट)',

    offlineEngineTitle: '100% बिना इंटरनेट चालू',
    offlineEngineStatus: 'स्थानीय SLAM एंकर सहेजल आहे · बोली इंजन कैश्ड आहे · नेट नय चाही',
    dgmsVtcPassTitle: 'DGMS VTC डिजिटल पास',
    downloadVtcBadge: 'DGMS VTC डिजिटल पास डाउनलोड करू (QR बैज)',
    vtcCreditProof: 'VTC क्रेडिट पक्का भेल · नियम 114 पास',
  },

  // =========================================================================
  // SANTALI (ᱥᱟᱱᱛᱟᱲᱤ - ᱚᱞ ᱪᱤᱠᱤ)
  // =========================================================================
  sat: {
    appName: 'ᱢᱟᱭᱤᱱᱰᱤᱝ ᱢᱟᱭᱤᱱᱥ',
    tagline: 'ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱥᱮᱪᱮᱫ ᱟᱨ DGMS ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    govtHeader: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ',
    govtSubheader: 'ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱢᱟᱨᱟᱝ ᱰᱟᱭᱨᱮᱠᱴᱚᱨᱮᱴ (DGMS) ᱱᱤᱭᱚᱢ 114',
    selectLanguage: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    chooseLanguageDesc: 'ᱟᱸᱡᱚᱢ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    continueBtn: 'ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱨᱮ ᱞᱟᱦᱟᱜ ᱢᱮ',
    workerTitle: 'ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ',
    workerName: 'ᱨᱟᱦᱩᱞ ᱠᱩᱢᱟᱨ',
    workerMine: 'ᱯᱤᱴ ᱔B ᱥᱟᱯᱷᱴ, BCCL ᱫᱷᱟᱱᱵᱟᱫᱽ',
    progressTitle: 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱞᱟᱦᱟᱱᱛᱤ',
    modulesCompleted: 'ᱯᱟᱥ ᱟᱠᱟᱱ ᱦᱟᱹᱴᱤᱧ',
    startTraining: 'AR ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ ᱢᱮ',
    retakeTraining: 'ᱫᱚᱦᱲᱟ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
    certifiedBadge: 'DGMS ᱯᱟᱥ',
    notCompletedBadge: 'ᱥᱮᱪᱮᱫ ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜ-ᱟ',
    trainingProgress: 'ᱡᱚᱛᱚ ᱥᱮᱪᱮᱫ ᱞᱟᱦᱟᱱᱛᱤ',
    myCertificates: 'DGMS VTC ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ',
    viewCertificate: 'ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ ᱧᱮᱞ ᱢᱮ',
    offlineStatus: '100% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱟᱯᱲᱟᱣ (SLAM ᱥᱟᱸᱪᱟᱣ ᱟᱠᱟᱱᱟ)',
    arTrainingMode: 'AR ᱠᱮᱢᱮᱨᱟ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ',
    pointCameraInstruction: 'ᱠᱩᱭᱞᱟᱹ ᱠᱟᱸᱛ ᱥᱮ ᱥᱩᱨᱩᱝ ᱥᱮᱫ ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ ᱥᱟᱢᱟᱝ ᱢᱮ',
    cameraLive: 'ᱞᱟᱭᱤᱵᱷ ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ',
    cameraSimulated: 'ᱥᱤᱢᱩᱞᱮᱴ ᱠᱷᱟᱫᱟᱱ',
    toggleCamera: 'ᱠᱮᱢᱮᱨᱟ ᱵᱚᱫᱚᱞ ᱢᱮ',
    nextScenario: 'ᱫᱚᱥᱟᱨ ᱵᱤᱯᱚᱫᱽ ᱧᱮᱞ ᱢᱮ',
    finishSimulation: 'DGMS ᱵᱤᱱᱤᱰ ᱮᱢ ᱢᱮ',
    correctDecision: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱥᱩᱨᱚᱠᱷᱭᱟ ᱱᱤᱭᱚᱢ ᱢᱟᱱᱟᱣ ᱮᱱᱟ!',
    incorrectDecision: 'ᱵᱟᱹᱲᱤᱡ ᱠᱟᱹᱢᱤ! ᱱᱤᱭᱚᱢ ᱨᱟᱹᱯᱩᱫ ᱮᱱᱟ!',
    tryAgain: 'ᱫᱚᱦᱲᱟ ᱠᱩᱨᱩᱢᱩᱴᱩᱭ ᱢᱮ',
    startAssessment: 'DGMS ᱵᱤᱱᱤᱰ ᱮᱦᱚᱵ ᱢᱮ',
    assessmentTitle: 'DGMS ᱱᱤᱭᱚᱢ 114 ᱵᱤᱱᱤᱰ',
    questionOf: 'ᱠᱩᱠᱞᱤ',
    submitAnswer: 'ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ',
    trainingComplete: 'ᱥᱟᱨᱦᱟᱣ! ᱯᱟᱥ ᱮᱱᱟᱢ!',
    finalScore: 'ᱵᱤᱱᱤᱰ ᱱᱚᱢᱵᱚᱨ',
    statusCertified: 'DGMS ᱯᱟᱥ ᱧᱟᱢ ᱮᱱᱟ',
    statusFailed: 'ᱯᱷᱮᱞ ᱮᱱᱟ, ᱫᱚᱦᱲᱟ ᱮᱢ ᱢᱮ (70% ᱞᱟᱹᱠᱛᱤ)',
    generateCertificate: 'ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ ᱵᱮᱱᱟᱣ ᱢᱮ',
    verifyCertificate: 'ᱯᱟᱥ ᱯᱚᱨᱚᱠ ᱢᱮ',
    validCertificate: 'ᱥᱚᱨᱠᱟᱨᱤ ᱥᱟᱹᱨᱤ ᱯᱟᱥ',
    adminPortal: 'DGMS ᱚᱯᱷᱤᱥᱟᱨ ᱯᱳᱨᱴᱟᱞ',
    workerApp: 'ᱠᱟᱹᱢᱤᱭᱟᱹ AR ᱯᱳᱨᱴᱟᱞ',
    fireModuleTitle: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱳᱴ ᱵᱟᱧᱪᱟᱣ',
    fireModuleDesc: 'ᱢᱤᱛᱷᱮᱱ ᱥᱮᱸᱜᱮᱞ, ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱥᱮᱸᱜᱮᱞ, ABC ᱯᱟᱣᱰᱟᱨ, ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱚᱰᱚᱠ ᱦᱚᱨ',
    gasModuleTitle: 'ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱥᱩᱨᱩᱝ ᱵᱟᱧᱪᱟᱣ',
    gasModuleDesc: 'CH4, CO, H2S, O2 ᱯᱚᱨᱚᱠ, FSR, SCBA ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱴᱷᱟ',
    ppeSelectorTitle: 'ᱠᱷᱟᱫᱟᱱ PPE ᱯᱚᱨᱚᱠ ᱪᱚᱣᱠᱤ',
    ppeSelectorPrompt: 'ᱵᱤᱥ ᱜᱮᱥ ᱴᱚᱴᱷᱟ ᱪᱟᱞᱟᱜ ᱢᱟᱬᱟᱝ FSR, ᱜᱮᱥ ᱞᱮᱢᱯ ᱟᱨ SCBA ᱧᱮᱞ ᱢᱮ',
    evacuationTitle: 'ᱚᱛ ᱨᱮᱱᱟᱜ ᱛᱤᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱫᱟᱹᱲ ᱢᱮ',
    evacuationPrompt: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱛᱟᱞᱢᱟ ᱥᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱴᱷᱟ ᱥᱮᱫ ᱛᱤᱨ ᱪᱤᱱᱦᱟᱹ ᱯᱟᱸᱡᱟᱭ ᱢᱮ',
    downloadPdf: 'ᱯᱟᱥ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ',
    shareCert: 'ᱯᱟᱥ ᱥᱮᱭᱟᱨ ᱢᱮ',
    close: 'ᱵᱚᱸᱫᱽ ᱢᱮ',
    cancel: 'ᱵᱟᱹᱜᱤ ᱢᱮ',
    arScreenTitle: 'AR ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ',
    arScreenSubtitle: 'SLAM ᱴᱨᱮᱠᱤᱝ, ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱟᱞᱟᱨᱢ ᱟᱨ ᱢᱟᱨᱟᱝ ᱵᱚᱴᱚᱢ ᱰᱨᱚᱣᱟᱨ',
    switchCameraFacing: 'ᱠᱮᱢᱮᱨᱟ ᱵᱚᱫᱚᱞ ᱢᱮ',
    torchToggle: 'ᱠᱮᱯ ᱞᱮᱢᱯ ᱴᱚᱨᱪ',
    calibrateOrientation: 'ᱡᱟᱭᱨᱳ ᱴᱷᱤᱠ ᱢᱮ',
    freezeFrame: 'ᱪᱤᱛᱟᱹᱨ ᱛᱷᱟᱠᱟᱣ ᱢᱮ',
    resumeFeed: 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ ᱢᱮ',
    snapshotTaken: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱛᱟᱹᱨ ᱥᱟᱸᱪᱟᱣ ᱮᱱᱟ',
    requestCameraPermission: 'ᱠᱮᱢᱮᱨᱟ ᱦᱩᱠᱩᱢ ᱮᱢ ᱢᱮ',
    cameraPermissionDenied: 'ᱠᱮᱢᱮᱨᱟ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ, ᱱᱚᱠᱚᱞ ᱠᱷᱟᱫᱟᱱ ᱧᱮᱞᱚᱜ-ᱟ᱾',
    cameraUnavailable: 'ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾',
    selectModule: 'ᱥᱮᱪᱮᱫ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    arSensorsActive: 'SLAM ᱥᱮᱱᱥᱚᱨ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',
    lowLightWarning: 'ᱧᱩᱛ ᱜᱮᱭᱟ, ᱢᱟᱛᱷᱟ ᱨᱮᱱᱟᱜ ᱠᱮᱯ ᱞᱮᱢᱯ ᱡᱩᱞ ᱢᱮ᱾',
    markerLocked: 'ᱵᱤᱯᱚᱫᱽ ᱞᱚᱠ ᱮᱱᱟ',
    recenterHorizon: 'ᱠᱮᱢᱮᱨᱟ ᱥᱚᱡᱷᱮ ᱢᱮ',

    orientationPortrait: 'ᱯᱚᱨᱴᱨᱮᱴ ᱢᱳᱰ',
    orientationLandscape: 'ᱞᱮᱱᱰᱥᱠᱮᱯ ᱢᱳᱰ',
    toggleOrientation: 'ᱥᱠᱨᱤᱱ ᱵᱚᱫᱚᱞ ᱢᱮ',
    cameraSplit75: 'AR ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ',
    quizSplit25: 'ᱠᱩᱠᱞᱤ ᱰᱨᱚᱣᱟᱨ',
    backCameraOnly: 'ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ (SLAM)',
    backCameraActive: 'ᱛᱟᱭᱚᱢ ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',

    scanningArea: 'ᱥᱠᱮᱱ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',
    rescanArea: 'ᱫᱚᱦᱲᱟ ᱥᱠᱮᱱ ᱢᱮ',
    surfaceCoherence: 'SLAM ᱛᱷᱤᱨ: 98.4%',
    areaMapped: 'ᱱᱚᱠᱥᱟ ᱵᱮᱱᱟᱣ ᱮᱱᱟ',
    hazardsDetected: 'ᱵᱤᱯᱚᱫᱽ ᱧᱟᱢ ᱮᱱᱟ',
    distance: 'ᱥᱟᱺᱜᱤᱧ',
    targetCrosshair: 'ᱱᱤᱥᱟᱱᱟ',
    rangefinder: 'ᱥᱟᱺᱜᱤᱧ ᱡᱚᱠᱷᱟ',
    spatialPlaneDetected: 'ᱚᱛ ᱥᱟᱵ ᱮᱱᱟ',
    scanMode: 'ᱥᱮᱱᱥᱚᱨ ᱯᱷᱤᱞᱴᱟᱨ',
    hazardScan: 'ᱜᱮᱥ ᱟᱨ ᱵᱤᱯᱚᱫᱽ',
    slamMesh: 'LiDAR ᱡᱟᱞ',
    ppeDetect: 'ᱥᱟᱢᱟᱱ ᱯᱚᱨᱚᱠ',

    quizTitle: 'ᱵᱤᱯᱚᱫᱽ ᱜᱚᱴᱟ ᱟᱨ ᱠᱟᱹᱢᱤ',
    selectCorrectAction: 'ᱥᱟᱹᱨᱤ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱠᱟᱹᱢᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:',
    actionRequired: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱹᱢᱤ',
    verifyPpe: 'PPE ᱥᱟᱢᱟᱱ ᱯᱚᱨᱚᱠ ᱢᱮ',
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    cameraTips: 'ᱠᱮᱢᱮᱨᱟ ᱫᱤᱥᱟᱹ',
    hideTips: 'ᱫᱤᱥᱟᱹ ᱩᱠᱩᱭ ᱢᱮ',

    workerLogin: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱚᱜᱤᱱ',
    adminLogin: 'DGMS ᱚᱯᱷᱤᱥᱟᱨ ᱞᱚᱜᱤᱱ',
    employeeId: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ',
    password: 'ᱯᱟᱥᱣᱟᱨᱰ',
    signInWorker: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
    signInAdmin: 'ᱚᱯᱷᱤᱥᱟᱨ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ',
    officerId: 'ᱚᱯᱷᱤᱥᱟᱨ ᱟᱭᱰᱤ / ᱤᱢᱮᱞ',
    quickFill: 'ᱞᱚᱜᱚᱱ ᱵᱟᱪᱷᱟᱣ (ᱰᱮᱢᱳ)',
    welcome: 'ᱡᱚᱦᱟᱨ',
    logout: 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
    overallProgress: 'ᱥᱮᱪᱮᱫ ᱦᱟᱞᱚᱛ',
    moduleMastery: 'ᱦᱟᱹᱴᱤᱧ ᱜᱮᱭᱟᱱ',
    portalDescription: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨᱟᱜ ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱟᱨ ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ ᱯᱳᱨᱴᱟᱞ᱾',
    workerPortalTitle: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱳᱨᱴᱟᱞ',
    workerPortalDesc: 'ᱟᱢᱟᱜ ᱟᱭᱰᱤ ᱛᱮ ᱞᱚᱜᱤᱱ ᱠᱟᱛᱮ ᱥᱚᱨᱠᱟᱨᱤ VTC ᱯᱟᱥ ᱧᱟᱢ ᱢᱮ᱾',
    adminPortalTitle: 'DGMS ᱚᱯᱷᱤᱥᱟᱨ ᱯᱳᱨᱴᱟᱞ',
    adminPortalDesc: 'ᱠᱷᱟᱫᱟᱱ ᱢᱮᱱᱮᱡᱚᱨ ᱟᱨ ᱤᱱᱥᱯᱮᱠᱴᱚᱨ ᱠᱚ ᱞᱟᱹᱜᱤᱫ᱾',
    passwordPlaceholder: 'ᱯᱟᱥᱣᱟᱨᱰ ᱮᱢ ᱢᱮ',
    loginErrorMissing: 'ᱟᱭᱰᱤ ᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ ᱵᱟᱱᱟᱨ ᱮᱢ ᱢᱮ᱾',
    loginErrorWorker: 'ᱵᱟᱹᱲᱤᱡ ᱟᱭᱰᱤ/ᱯᱟᱥᱣᱟᱨᱰ᱾ ᱰᱮᱢᱳ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾',
    loginErrorAdmin: 'ᱵᱟᱹᱲᱤᱡ ᱚᱯᱷᱤᱥᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ᱾',
    quickFillPasswordNote: 'ᱰᱮᱢᱳ ᱯᱟᱥᱣᱟᱨᱰ: miner123',

    inspectorate: 'DGMS ᱤᱱᱥᱯᱮᱠᱴᱚᱨᱮᱴ',
    stateRegistry: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱠᱷᱟᱫᱟᱱ ᱨᱮᱡᱤᱥᱴᱨᱤ',
    totalWorkforce: 'ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    fullyCertified: 'ᱯᱟᱥ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ',
    pendingTraining: 'ᱥᱮᱪᱮᱫ ᱵᱟᱹᱠᱤ',
    auditReadiness: 'ᱥᱚᱨᱠᱟᱨᱤ ᱚᱰᱤᱴ ᱥᱟᱯᱲᱟᱣ: 94.2%',
    workersTab: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱛᱟᱹᱞᱠᱟᱹ',
    reportsTab: 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱨᱤᱯᱳᱨᱴ',
    verificationTab: 'QR ᱯᱚᱨᱚᱠ',
    searchPlaceholder: 'ᱧᱩᱛᱩᱢ, ᱟᱭᱰᱤ ᱥᱮ ᱠᱷᱟᱫᱟᱱ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    allMines: 'ᱡᱚᱛᱚ ᱠᱷᱟᱫᱟᱱ ᱵᱞᱚᱠ',
    allStatuses: 'ᱡᱚᱛᱚ ᱦᱟᱞᱚᱛ',
    exportCsv: 'CSV ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ',
    workerNameCol: 'ᱧᱩᱛᱩᱢ ᱟᱨ ᱟᱭᱰᱤ',
    collieryCol: 'ᱠᱷᱟᱫᱟᱱ ᱯᱤᱴ',
    categoryCol: 'ᱛᱷᱚᱠ',
    fireSafetyCol: 'ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    gasSafetyCol: 'ᱜᱮᱥ ᱟᱨ SCBA',
    overallScoreCol: 'ᱱᱚᱢᱵᱚᱨ',
    lastTrainedCol: 'ᱢᱟᱹᱦᱤᱛ',
    actionCol: 'ᱠᱟᱹᱢᱤ',
    viewQrCredential: 'ᱯᱟᱥ ᱧᱮᱞ ᱢᱮ',

    certOfCompetency: 'DGMS ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱯᱟᱥ',
    certSubtitle: 'DGMS ᱱᱤᱭᱚᱢ 1961 ᱦᱟᱹᱴᱤᱧ 114 ᱞᱮᱠᱟᱛᱮ',
    holderNameLabel: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ',
    holderEmpIdLabel: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ',
    collieryMineLabel: 'ᱠᱷᱟᱫᱟᱱ ᱴᱚᱴᱷᱟ',
    competencyFieldLabel: 'ᱯᱟᱥ ᱟᱠᱟᱱ ᱥᱟᱛᱟᱢ',
    issueDateLabel: 'ᱧᱟᱢ ᱢᱟᱹᱦᱤᱛ',
    expiryDateLabel: 'ᱢᱩᱪᱟᱹᱫ ᱢᱟᱹᱦᱤᱛ',
    certifyingAuthorityLabel: 'DGMS ᱵᱤᱱᱤᱰ ᱠᱚᱱᱴᱨᱚᱞᱟᱨ',
    dgmsApprovedNote: 'ᱱᱚᱶᱟ ᱯᱟᱥ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ DGMS ᱯᱟᱦᱴᱟ ᱠᱷᱚᱱ ᱮᱢ ᱟᱠᱟᱱᱟ᱾',
    tamperProofQr: 'ᱥᱚᱨᱠᱟᱨᱤ QR ᱠᱳᱰ',
    scanToVerifyText: 'ᱯᱷᱳᱱ ᱛᱮ ᱥᱠᱮᱱ ᱠᱟᱛᱮ ᱥᱟᱹᱨᱤ ᱯᱟᱥ ᱯᱚᱨᱚᱠ ᱢᱮ᱾',
    backToDashboardBtn: 'ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ',
    qrVerifiedTitle: 'DGMS ᱯᱟᱥ ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ',
    qrVerifiedDesc: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨᱟᱜ ᱠᱷᱟᱛᱟ ᱠᱷᱚᱱ ᱥᱟᱹᱵᱤᱛ ᱮᱱᱟ᱾',
    verificationAuditPassed: 'ᱥᱚᱨᱠᱟᱨᱤ ᱚᱰᱤᱴ: ᱯᱟᱥ ᱟᱨ ᱪᱟᱹᱞᱩ',

    listenAssistant: 'ᱟᱸᱡᱚᱢ / ᱨᱚᱲ ᱜᱚᱲᱚᱭᱤᱡ',
    listenAssistantActive: 'ᱠᱩᱠᱞᱤ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ ᱨᱚᱲ ᱛᱮ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ...',
    voiceCommandHint: 'ᱨᱚᱲ ᱠᱟᱛᱮ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ: "Option A", "Option B" ᱥᱮ "Option C"',
    voiceListening: 'ᱟᱢᱟᱜ ᱨᱚᱲ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ...',
    voiceAnswerRecognized: 'ᱴᱷᱤᱠᱟᱹ ᱟᱠᱟᱱ ᱛᱮᱞᱟ: ',

    expandDrawer: 'ᱠᱩᱠᱞᱤ ᱰᱨᱚᱣᱟᱨ ᱡᱷᱤᱡ ᱢᱮ',
    collapseDrawer: 'ᱰᱨᱚᱣᱟᱨ ᱦᱩᱰᱤᱧ ᱢᱮ',
    gloveFriendlyLabel: 'ᱢᱳᱡᱟ ᱵᱟᱵᱚᱛ ᱢᱟᱨᱟᱝ ᱵᱚᱴᱚᱱ (ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ 56px)',

    gasMonitoringTitle: 'ᱠᱷᱟᱫᱟᱱ ᱜᱮᱥ ᱢᱤᱴᱟᱨ (DGMS ᱦᱟᱹᱴᱤᱧ 114)',
    ch4ThresholdWarning: 'CH₄ > 0.75% — ᱠᱟᱹᱢᱤ ᱛᱷᱟᱠᱟᱣ ᱦᱩᱠᱩᱢ! (DGMS ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ)',
    o2DeficiencyWarning: 'O₂ < 19.0% — ᱦᱚᱭ ᱠᱚᱢ ᱮᱱᱟ ᱟᱞᱟᱨᱢ! (ᱞᱚᱜᱚᱱ SCBA ᱦᱚᱨᱚᱜ ᱢᱮ)',
    coDeadlyThreshold: 'CO > 50 PPM — ᱵᱤᱥ ᱜᱮᱥ ᱟᱞᱟᱨᱢ! (ᱪᱮᱛᱟᱱ ᱥᱮᱫ ᱫᱟᱹᱲ ᱢᱮ)',
    h2sToxicThreshold: 'H₂S > 10 PPM — ᱵᱤᱥ ᱜᱮᱥ ᱧᱟᱢ ᱮᱱᱟ! (ᱥᱟᱦᱮᱫ ᱡᱚᱱᱛᱨᱚ ᱦᱚᱨᱚᱜ ᱢᱮ)',
    workStoppageAlert: 'DGMS ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱱᱤᱛ ᱜᱮ ᱠᱟᱹᱢᱤ ᱵᱚᱸᱫᱽ ᱨᱮᱱᱟᱜ ᱦᱩᱠᱩᱢ',

    evacuationGuidanceTitle: 'ᱚᱛ ᱨᱮᱱᱟᱜ ᱛᱤᱨ ᱯᱟᱸᱡᱟ ᱠᱟᱛᱮ ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
    evacFreshAirBase: 'ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱛᱟᱞᱢᱟ (ᱤᱱᱴᱮᱠ ᱦᱮᱰᱤᱝ 2 · 48 ᱢᱤᱴᱟᱨ)',
    evacRefugeChamber: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱴᱷᱟ ᱨᱤᱯᱷᱤᱭᱩᱡᱽ ᱪᱮᱢᱵᱟᱨ (ᱠᱨᱳᱥᱠᱟᱴ 4 · 110 ᱢᱤᱴᱟᱨ)',
    evacSelfRescuerStation: 'ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ ᱴᱷᱟᱶ (FSR ᱥᱟᱯᱟᱵ · 24 ᱢᱤᱴᱟᱨ)',
    followFloorArrows: 'ᱚᱛ ᱨᱮ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱛᱤᱨ ᱯᱟᱸᱡᱟ ᱠᱟᱛᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ',

    undergroundPpeFSR: 'ᱯᱷᱤᱞᱴᱟᱨ ᱥᱮᱞᱯᱷ-ᱨᱮᱥᱠᱤᱣᱟᱨ (FSR - ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ)',
    undergroundPpeCapLampDetector: '᱔-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱥᱟᱶ ᱠᱮᱯ ᱞᱮᱢᱯ',
    undergroundPpeSCBA: 'ᱥᱮᱞᱯᱷ-ᱠᱚᱱᱴᱮᱱᱰ ᱵᱨᱤᱫᱷᱤᱝ ᱮᱯᱟᱨᱮᱴᱟᱥ (SCBA 30-ᱴᱤᱯᱤᱲ)',

    offlineEngineTitle: '100% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱤᱱᱡᱤᱱ',
    offlineEngineStatus: 'SLAM ᱥᱟᱸᱪᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ · ᱨᱚᱲ ᱤᱱᱡᱤᱱ ᱠᱮᱥ ᱢᱮᱱᱟᱜ-ᱟ · ᱱᱮᱴ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤ',
    dgmsVtcPassTitle: 'DGMS VTC ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ',
    downloadVtcBadge: 'DGMS VTC ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱥ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ (QR ᱵᱮᱡᱽ)',
    vtcCreditProof: 'VTC ᱠᱨᱮᱰᱤᱴ ᱥᱟᱹᱵᱤᱛ ᱮᱱᱟ · ᱱᱤᱭᱚᱢ 114 ᱯᱟᱥ',
  },
};
