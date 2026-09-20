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
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'SAFEAR Jharkhand',
    tagline: 'Smart AR Safety Training & Certification',
    govtHeader: 'GOVERNMENT OF JHARKHAND',
    govtSubheader: 'Department of Mines, Geology & Vocational Safety',
    selectLanguage: 'Choose Training Language',
    chooseLanguageDesc: 'Select your preferred native language for voice-assisted AR safety simulation.',
    continueBtn: 'Continue to Training',
    workerTitle: 'Certified Miner Profile',
    workerName: 'Rahul Kumar',
    workerMine: 'Dhanbad Underground Colliery Block-4',
    progressTitle: 'Vocational Compliance Progress',
    modulesCompleted: '1 of 2 modules completed',
    startTraining: 'START TRAINING',
    retakeTraining: 'PRACTICE AGAIN',
    certifiedBadge: 'CERTIFIED',
    notCompletedBadge: 'NOT COMPLETED',
    trainingProgress: 'Training Analytics & Readiness',
    myCertificates: 'My Digital Credentials',
    viewCertificate: 'View Official Certificate',
    offlineStatus: 'Offline Training Ready (Cached)',
    arTrainingMode: 'AR TRAINING SIMULATOR',
    pointCameraInstruction: 'Point your phone toward the training area or machinery',
    cameraLive: 'Device Camera (Live AR)',
    cameraSimulated: 'Industrial Chamber (Simulated)',
    toggleCamera: 'Switch Video Feed',
    nextScenario: 'Proceed to Next Hazard Scenario',
    finishSimulation: 'Proceed to Competency Assessment',
    correctDecision: 'Correct Decision! Response Protocol Verified.',
    incorrectDecision: 'Hazardous Action Detected. Review standard DGMS safety protocol.',
    tryAgain: 'Review & Try Again',
    startAssessment: 'Start Official Safety Assessment',
    assessmentTitle: 'Post-Simulation Competency Evaluation',
    questionOf: 'Question',
    submitAnswer: 'Confirm Protocol Decision',
    trainingComplete: 'TRAINING & ASSESSMENT COMPLETE',
    finalScore: 'Official Verification Score',
    statusCertified: 'STATUS: OFFICIALLY CERTIFIED',
    statusFailed: 'STATUS: RE-ASSESSMENT REQUIRED',
    generateCertificate: 'GENERATE DIGITAL CERTIFICATE',
    verifyCertificate: 'Verify QR Authenticity',
    validCertificate: 'GENUINE VERIFIED CERTIFICATE',
    adminPortal: 'Admin Portal',
    workerApp: 'Worker App',
    fireModuleTitle: 'Fire & Explosion Response',
    fireModuleDesc: 'Methane ignition containment, coal dust suppression, ABC extinguishers & safe evacuation.',
    gasModuleTitle: 'Gas Leak & Confined Space',
    gasModuleDesc: 'Toxic CO/H2S detection, SCBA / PPE donning, buddy protocol & confined pit access.',
    ppeSelectorTitle: 'Interactive PPE Gear Donning',
    ppeSelectorPrompt: 'Select all Mandatory Safety Equipment required for confined toxic zone entry.',
    evacuationTitle: 'Tactical Mine Evacuation Protocol',
    evacuationPrompt: 'Trace the safest path bypassing active blast zone and heat corridor.',
    downloadPdf: 'Download Official PDF',
    shareCert: 'Share / Print Record',
    close: 'Close',
  },
  hi: {
    appName: 'SAFEAR झारखंड',
    tagline: 'स्मार्ट एआर सुरक्षा प्रशिक्षण एवं प्रमाणन',
    govtHeader: 'झारखंड सरकार',
    govtSubheader: 'खान, भूतत्व एवं व्यावसायिक सुरक्षा विभाग',
    selectLanguage: 'प्रशिक्षण की भाषा चुनें',
    chooseLanguageDesc: 'एआर सुरक्षा सिमुलेशन के लिए अपनी पसंदीदा भाषा का चयन करें।',
    continueBtn: 'प्रशिक्षण शुरू करें',
    workerTitle: 'प्रमाणित खनिक प्रोफाइल',
    workerName: 'राहुल कुमार',
    workerMine: 'धनबाद भूमिगत कोयला खदान ब्लॉक-४',
    progressTitle: 'सुरक्षा अनुपालन प्रगति',
    modulesCompleted: '२ में से १ मॉड्यूल पूरा हुआ',
    startTraining: 'प्रशिक्षण शुरू करें',
    retakeTraining: 'पुनः अभ्यास करें',
    certifiedBadge: 'प्रमाणित',
    notCompletedBadge: 'अपूर्ण',
    trainingProgress: 'प्रशिक्षण विश्लेषण एवं तत्परता',
    myCertificates: 'मेरे डिजिटल प्रमाणपत्र',
    viewCertificate: 'आधिकारिक प्रमाणपत्र देखें',
    offlineStatus: 'ऑफ़लाइन प्रशिक्षण उपलब्ध (कैश्ड)',
    arTrainingMode: 'एआर प्रशिक्षण सिमुलेटर',
    pointCameraInstruction: 'अपने फोन को कार्यस्थल या मशीनरी की ओर रखें',
    cameraLive: 'डिवाइस कैमरा (लाइव एआर)',
    cameraSimulated: 'खदान सिमुलेशन (वर्चुअल)',
    toggleCamera: 'कैमरा मोड बदलें',
    nextScenario: 'अगले संकट परिदृश्य पर जाएं',
    finishSimulation: 'दक्षता मूल्यांकन पर आगे बढ़ें',
    correctDecision: 'सटीक निर्णय! सुरक्षा प्रोटोकॉल सत्यापित।',
    incorrectDecision: 'असुरक्षित कदम! कृपया मानक सुरक्षा नियमों की समीक्षा करें।',
    tryAgain: 'पुनः विचार करें',
    startAssessment: 'आधिकारिक सुरक्षा परीक्षा शुरू करें',
    assessmentTitle: 'सिमुलेशन उपरांत योग्यता परीक्षा',
    questionOf: 'प्रश्न',
    submitAnswer: 'उत्तर सुरक्षित करें',
    trainingComplete: 'प्रशिक्षण एवं परीक्षा संपन्न',
    finalScore: 'आधिकारिक मूल्यांकन अंक',
    statusCertified: 'स्थिति: विधिवत प्रमाणित (CERTIFIED)',
    statusFailed: 'स्थिति: पुनः परीक्षा अपेक्षित',
    generateCertificate: 'डिजिटल प्रमाणपत्र प्राप्त करें',
    verifyCertificate: 'क्यूआर प्रामाणिकता जांचें',
    validCertificate: 'सत्यापित एवं वैध प्रमाणपत्र',
    adminPortal: 'प्रशासक पोर्टल',
    workerApp: 'श्रमिक ऐप',
    fireModuleTitle: 'आग एवं विस्फोट नियंत्रण',
    fireModuleDesc: 'मीथेन प्रज्वलन रोकथाम, कोयला धूल दमन, एबीसी अग्निशामक एवं सुरक्षित निकास मार्ग।',
    gasModuleTitle: 'गैस रिसाव एवं संकीर्ण स्थान',
    gasModuleDesc: 'जहरीली गैस जांच, व्यक्तिगत सुरक्षा उपकरण (PPE), बडी प्रणाली और आपातकालीन निकासी।',
    ppeSelectorTitle: 'सुरक्षा उपकरण (PPE) चयन',
    ppeSelectorPrompt: 'खतरनाक क्षेत्र में प्रवेश हेतु अनिवार्य सुरक्षा उपकरण चुनें।',
    evacuationTitle: 'सुरक्षित निकास मार्ग निर्धारण',
    evacuationPrompt: 'खतरे के क्षेत्र और आग से बचते हुए निकटतम सुरक्षित आपातकालीन द्वार चुनें।',
    downloadPdf: 'प्रमाणपत्र डाउनलोड करें',
    shareCert: 'साझा करें / प्रिंट करें',
    close: 'बंद करें',
  },
  sat: {
    appName: 'SAFEAR ᱡᱷᱟᱨᱠᱷᱚᱸᱰ',
    tagline: 'ᱥᱢᱟᱨᱴ AR ᱥᱩᱨᱚᱠᱷᱭᱟ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    govtHeader: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ',
    govtSubheader: 'ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱵᱤᱵᱷᱟᱜᱽ',
    selectLanguage: 'ᱥᱮᱪᱮᱫ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ',
    chooseLanguageDesc: 'AR ᱥᱩᱨᱚᱠᱷᱭᱟ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱱᱛᱟᱲᱤ ᱥᱮ ᱮᱴᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
    continueBtn: 'ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ ᱢᱮ',
    workerTitle: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱩᱯᱨᱩᱢ',
    workerName: 'ᱨᱟᱦᱩᱞ ᱠᱩᱢᱟᱨ (Rahul Kumar)',
    workerMine: 'ᱫᱷᱟᱱᱵᱟᱫᱽ ᱠᱩᱭᱞᱟᱹ ᱠᱷᱟᱫᱟᱱ ᱵᱞᱚᱠ-᱔',
    progressTitle: 'ᱥᱮᱪᱮᱫ ᱞᱟᱦᱟᱱᱛᱤ',
    modulesCompleted: '᱒ ᱨᱮ ᱑ ᱦᱟᱹᱴᱤᱧ ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱱᱟ',
    startTraining: 'ᱥᱮᱪᱮᱫ ᱮᱦᱚᱵ',
    retakeTraining: 'ᱟᱨᱦᱚᱸ ᱥᱮᱪᱮᱫᱚᱜ',
    certifiedBadge: 'ᱯᱟᱥ ᱟᱠᱟᱱ',
    notCompletedBadge: 'ᱵᱟᱝ ᱯᱩᱨᱟᱹᱣ',
    trainingProgress: 'ᱥᱮᱪᱮᱫ ᱦᱟᱞᱚᱛ',
    myCertificates: 'ᱤᱧᱟᱜ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    viewCertificate: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ',
    offlineStatus: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱮᱪᱮᱫ ᱥᱟᱯᱲᱟᱣ ᱢᱮᱱᱟᱜ-ᱟ',
    arTrainingMode: 'AR ᱥᱮᱪᱮᱫ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ',
    pointCameraInstruction: 'ᱯᱷᱳᱱ ᱠᱮᱢᱮᱨᱟ ᱠᱷᱟᱫᱟᱱ ᱡᱟᱭᱜᱟ ᱥᱮᱫ ᱟᱹᱪᱩᱨ ᱢᱮ',
    cameraLive: 'ᱯᱷᱳᱱ ᱠᱮᱢᱮᱨᱟ (Live AR)',
    cameraSimulated: 'ᱠᱷᱟᱫᱟᱱ ᱪᱤᱛᱟᱹᱨ (Virtual)',
    toggleCamera: 'ᱠᱮᱢᱮᱨᱟ ᱵᱚᱫᱚᱞ',
    nextScenario: 'ᱫᱚᱥᱟᱨ ᱵᱤᱯᱚᱫᱽ ᱧᱮᱞ ᱢᱮ',
    finishSimulation: 'ᱯᱚᱨᱤᱠᱷᱭᱟ ᱮᱦᱚᱵ ᱢᱮ',
    correctDecision: 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱥᱩᱨᱚᱠᱷᱭᱟ ᱱᱤᱭᱚᱢ ᱢᱟᱱᱟᱣ ᱮᱱᱟ᱾',
    incorrectDecision: 'ᱵᱤᱯᱚᱫᱽ ᱜᱚᱴᱟ! ᱥᱩᱨᱚᱠᱷᱭᱟ ᱱᱤᱭᱚᱢ ᱟᱨ ᱢᱤᱫᱫᱷᱟᱣ ᱧᱮᱞ ᱢᱮ᱾',
    tryAgain: 'ᱟᱨᱦᱚᱸ ᱪᱮᱥᱴᱟᱭ ᱢᱮ',
    startAssessment: 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱵᱤᱱᱤᱰ ᱮᱦᱚᱵ ᱢᱮ',
    assessmentTitle: 'ᱥᱩᱨᱚᱠᱷᱭᱟ ᱫᱟᱲᱮ ᱯᱚᱨᱤᱠᱷᱭᱟ',
    questionOf: 'ᱠᱩᱠᱞᱤ',
    submitAnswer: 'ᱩᱛᱛᱚᱨ ᱥᱟᱹᱵᱤᱛ ᱢᱮ',
    trainingComplete: 'ᱥᱮᱪᱮᱫ ᱟᱨ ᱵᱤᱱᱤᱰ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ',
    finalScore: 'ᱚᱨᱡᱚ ᱱᱚᱢᱵᱚᱨ (Score)',
    statusCertified: 'ᱦᱟᱞᱚᱛ: ᱥᱟᱨᱴᱤᱯᱷᱟᱭᱰ (CERTIFIED)',
    statusFailed: 'ᱦᱟᱞᱚᱛ: ᱟᱨᱦᱚᱸ ᱵᱤᱱᱤᱰ ᱦᱟᱛᱟᱣ ᱢᱮ',
    generateCertificate: 'ᱰᱤᱡᱤᱴᱟᱞ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱮᱱᱟᱣ ᱢᱮ',
    verifyCertificate: 'QR ᱯᱚᱨᱤᱠᱷᱭᱟ ᱢᱮ',
    validCertificate: 'ᱴᱷᱤᱠ ᱟᱨ ᱥᱟᱹᱨᱤ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ',
    adminPortal: 'ᱮᱰᱢᱤᱱ ᱯᱳᱨᱴᱟᱞ',
    workerApp: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱮᱯ',
    fireModuleTitle: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱳᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    fireModuleDesc: 'ᱢᱤᱛᱷᱮᱱ ᱥᱮᱸᱜᱮᱞ ᱵᱚᱸᱫᱽ, ᱠᱩᱭᱞᱟᱹ ᱫᱷᱩᱲᱤ ᱦᱟᱹᱯᱤᱫ, ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱨ ᱚᱰᱚᱠ ᱦᱚᱨ᱾',
    gasModuleTitle: 'ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱦᱩᱰᱤᱧ ᱡᱟᱭᱜᱟ',
    gasModuleDesc: 'ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ, PPE ᱦᱚᱨᱚᱜ, ᱜᱟᱛᱮ ᱥᱟᱶᱛᱮ ᱠᱟᱹᱢᱤ (Buddy System) ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱚᱨ᱾',
    ppeSelectorTitle: 'PPE ᱥᱩᱨᱚᱠᱷᱭᱟ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ',
    ppeSelectorPrompt: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
    evacuationTitle: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱦᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ',
    evacuationPrompt: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ ᱵᱟᱹᱜᱤ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱩᱣᱟᱹᱨ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ᱾',
    downloadPdf: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱰᱟᱣᱩᱱᱞᱳᱰ',
    shareCert: 'ᱦᱟᱹᱴᱤᱧ / ᱯᱨᱤᱱᱴ',
    close: 'ᱵᱚᱸᱫᱽ',
  },
};
