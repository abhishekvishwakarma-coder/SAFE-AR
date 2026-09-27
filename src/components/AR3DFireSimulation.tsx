import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Language } from '../types';
import { sfx, regionalVoice } from '../utils/audio';
import {
  Flame,
  ShieldAlert,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Crosshair,
  Sparkles,
  ArrowRight,
  Eye,
  Bell,
  Compass,
  Check,
  Package,
} from 'lucide-react';

interface AR3DFireSimulationProps {
  language: Language;
  onDrillComplete?: (score: number) => void;
  className?: string;
  isCompactMode?: boolean;
}

// P.A.S.S. Protocol Steps
type PassStep = 'PULL' | 'AIM' | 'SQUEEZE' | 'SWEEP' | 'EXTINGUISHED';
type InspectionTarget = 'overview' | 'extinguisher' | 'fire_base' | 'blanket_sand' | 'egress_alarm' | 'spray_agent';

export const AR3DFireSimulation: React.FC<AR3DFireSimulationProps> = ({
  language,
  onDrillComplete,
  className = '',
  isCompactMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Drill Step & Focused 3D Equipment Target
  const [currentStep, setCurrentStep] = useState<PassStep>('PULL');
  const [inspectionTarget, setInspectionTarget] = useState<InspectionTarget>('overview');

  // Interactive 3D Orbit Drag Tracking
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [orbitRotY, setOrbitRotY] = useState<number>(0);
  const [orbitRotX, setOrbitRotX] = useState<number>(0);

  // Drill Dynamic State
  const [isPinPulled, setIsPinPulled] = useState<boolean>(false);
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [fireHealth, setFireHealth] = useState<number>(100); // 100% down to 0%
  const [powderLevel, setPowderLevel] = useState<number>(100); // 100% down to 0%
  const [aimX, setAimX] = useState<number>(0); // -1.5 to 1.5 lateral aim
  const [aimY, setAimY] = useState<number>(-0.4); // vertical aim (-1.0 to 1.0)
  const [sweepProgress, setSweepProgress] = useState<number>(0); // 0 to 100%
  const [isAimingAtBase, setIsAimingAtBase] = useState<boolean>(true);
  const [drillScore, setDrillScore] = useState<number>(98);
  const [drillTimeSeconds, setDrillTimeSeconds] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showSuccessCard, setShowSuccessCard] = useState<boolean>(false);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // 3D Objects refs
  const tunnelGroupRef = useRef<THREE.Group | null>(null);
  const fireGroupRef = useRef<THREE.Group | null>(null);
  const flameParticlesRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const fireLightRef = useRef<THREE.PointLight | null>(null);

  const extinguisherGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshRef = useRef<THREE.Mesh | null>(null);
  const sprayParticlesRef = useRef<THREE.Points | null>(null);
  const laserBeamRef = useRef<THREE.Line | null>(null);
  const targetReticleRef = useRef<THREE.Mesh | null>(null);

  const fireStationGroupRef = useRef<THREE.Group | null>(null);
  const alarmStationGroupRef = useRef<THREE.Group | null>(null);
  const alarmStrobeLightRef = useRef<THREE.PointLight | null>(null);

  // State mirror refs for requestAnimationFrame
  const isSprayingRef = useRef(false);
  const isPinPulledRef = useRef(false);
  const fireHealthRef = useRef(100);
  const powderLevelRef = useRef(100);
  const aimXRef = useRef(0);
  const aimYRef = useRef(-0.4);
  const sweepProgressRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const inspectionTargetRef = useRef<InspectionTarget>('overview');
  const orbitRotYRef = useRef(0);
  const orbitRotXRef = useRef(0);
  const leftHitRef = useRef(false);
  const rightHitRef = useRef(false);
  const centerHitRef = useRef(false);

  isSprayingRef.current = isSpraying;
  isPinPulledRef.current = isPinPulled;
  fireHealthRef.current = fireHealth;
  powderLevelRef.current = powderLevel;
  aimXRef.current = aimX;
  aimYRef.current = aimY;
  sweepProgressRef.current = sweepProgress;
  inspectionTargetRef.current = inspectionTarget;
  orbitRotYRef.current = orbitRotY;
  orbitRotXRef.current = orbitRotX;

  // Localized texts
  const t = {
    stepPull: {
      en: '1·PULL',
      hi: '१·पिन',
      khr: '१·पिन',
      nag: '१·पिन',
      sat: '᱑·ᱯᱤᱱ',
    }[language] || '1·PULL',

    stepAim: {
      en: '2·AIM',
      hi: '२·निशाना',
      khr: '२·निशाना',
      nag: '२·निशाना',
      sat: '᱒·ᱥᱟᱢᱟᱝ',
    }[language] || '2·AIM',

    stepSqueeze: {
      en: '3·SQUEEZE',
      hi: '३·दबाएं',
      khr: '३·दबावा',
      nag: '३·दबावा',
      sat: '᱓·ᱞᱤᱱ',
    }[language] || '3·SQUEEZE',

    stepSweep: {
      en: '4·SWEEP',
      hi: '४·घुमाएं',
      khr: '४·घुमावा',
      nag: '४·घुमावा',
      sat: '᱔·ᱟᱹᱪᱩᱨ',
    }[language] || '4·SWEEP',

    stepSafe: {
      en: '5·SAFE',
      hi: '५·सुरक्षित',
      khr: '५·सुरक्षित',
      nag: '५·सुरक्षित',
      sat: '᱕·ᱨᱩᱠᱷᱤᱭᱟᱹ',
    }[language] || '5·SAFE',

    pullInstruction: {
      en: 'PULL the yellow safety pin on the 3D extinguisher to release the squeeze handle.',
      hi: 'ऑपरेटिंग हैंडल को अनलॉक करने के लिए पीले सेफ्टी पिन को खींचें।',
      khr: 'लीवर खोले खातिर पियरका सेफ्टी पिन दबाई के टाना।',
      nag: 'लीवर अनलॉक करेक ले पियरका सेफ्टी पिन के खींचा।',
      sat: 'ᱞᱤᱵᱷᱟᱨ ᱡᱷᱤᱡ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱥᱟᱝ ᱥᱮᱯᱷᱴᱤ ᱯᱤᱱ ᱚᱨ ᱢᱮ᱾',
    }[language] || 'Pull the safety pin to unlock.',

    aimInstruction: {
      en: 'AIM the discharge nozzle at the burning coal embers (the base, not the smoke).',
      hi: 'नोजल को सीधे कोयले के अंगारे / आग के आधार पर साधें।',
      khr: 'नोजल के सिधइया कोयला के जड़ पर साधा।',
      nag: 'नोजल के सीधा आग के बेस पर ताका।',
      sat: 'ᱱᱚᱡᱚᱞ ᱫᱚ ᱥᱤᱫᱷᱟᱹ ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱜ ᱵᱩᱰᱟᱹ ᱨᱮ ᱥᱟᱢᱟᱝ ᱢᱮ᱾',
    }[language] || 'Aim at the base of fire.',

    squeezeInstruction: {
      en: 'SQUEEZE the discharge lever to release high-pressure ABC dry chemical powder.',
      hi: 'उच्च दबाव वाले ड्राई केमिकल पाउडर के छिड़काव हेतु लीवर दबाएं।',
      khr: 'ड्राई केमिकल पाउडर फेंके खातिर लीवर दबावा।',
      nag: 'पाउडर फेंके ले लीवर के दबावा।',
      sat: 'ᱯᱟᱣᱰᱚᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱞᱤᱵᱷᱟᱨ ᱞᱤᱱ ᱢᱮ᱾',
    }[language] || 'Press to discharge powder.',

    sweepInstruction: {
      en: 'SWEEP side-to-side across the entire coal base until flames are smothered.',
      hi: 'कोयले के अंगारों पर नोजल को दाएं-बाएं घुमाएं जब तक आग पूरी तरह न बुझे।',
      khr: 'सभे जलल कोयला पर नोजल दाएं-बाएं घुमावा।',
      nag: 'गोटे जलत कोयला पर नोजल घुमावा।',
      sat: 'ᱡᱚᱛᱚ ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱠᱩᱭᱞᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱮ ᱱᱚᱡᱚᱞ ᱟᱹᱪᱩᱨ ᱢᱮ᱾',
    }[language] || 'Sweep side to side across the base.',

    drillSuccessTitle: {
      en: 'FIRE EXTINGUISHED! DRILL PASSED',
      hi: 'आग बुझाई गई! मॉक ड्रिल सफल',
      khr: 'आग बुझ गेलइ! मॉक ड्रिल पास',
      nag: 'आग निझ गेलक! मॉक ड्रिल पास',
      sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ! ᱰᱨᱤᱞ ᱯᱟᱥ',
    }[language] || 'FIRE EXTINGUISHED! DRILL PASSED',

    holdToSpray: {
      en: 'HOLD TO DISCHARGE',
      hi: 'पाउडर छिड़कें (दबाए रखें)',
      khr: 'पाउडर छिड़का (दबाई के राखा)',
      nag: 'स्प्रे करा (दबा के राखा)',
      sat: 'ᱪᱷᱤᱴᱠᱟᱹᱣ ᱢᱮ (ᱞᱤᱱ ᱫᱚᱦᱚᱭ ᱢᱮ)',
    }[language] || 'HOLD TO DISCHARGE',

    pullPinBtn: {
      en: 'PULL SAFETY PIN',
      hi: 'सेफ्टी पिन खींचें',
      khr: 'सेफ्टी पिन टाना',
      nag: 'सेफ्टी पिन खींचा',
      sat: 'ᱥᱮᱯᱷᱴᱤ ᱯᱤᱱ ᱚᱨ ᱢᱮ',
    }[language] || 'PULL SAFETY PIN',

    resetDrill: {
      en: 'PRACTICE AGAIN',
      hi: 'पुनः अभ्यास करें',
      khr: 'दोबारा अभ्यास करा',
      nag: 'फेरि से करा',
      sat: 'ᱟᱨᱦᱚᱸ ᱚᱵᱷᱭᱟᱥ ᱢᱮ',
    }[language] || 'PRACTICE AGAIN',

    fireIntensity: {
      en: 'Fire',
      hi: 'लपट',
      khr: 'लपट',
      nag: 'लपट',
      sat: 'ᱥᱮᱸᱜᱮᱞ',
    }[language] || 'Fire',

    extinguisherAgent: {
      en: 'ABC Powder',
      hi: 'ड्राई पाउडर',
      khr: 'पाउडर',
      nag: 'पाउडर',
      sat: 'ᱯᱟᱣᱰᱚᱨ',
    }[language] || 'ABC Powder',

    baseLocked: {
      en: 'TARGET LOCKED: BASE',
      hi: 'निशाना सटीक: जड़',
      khr: 'सटीक निशाना',
      nag: 'सटीक निशाना',
      sat: 'ᱥᱟᱹᱨᱤ ᱥᱟᱢᱟᱝ: ᱵᱩᱰᱟᱹ',
    }[language] || 'TARGET LOCKED: BASE',

    aimLowerWarning: {
      en: 'AIM LOWER AT COAL',
      hi: 'अंगारे पर नीचे निशाना लगाएं',
      khr: 'नीचे साधा',
      nag: 'नीचे ताका',
      sat: 'ᱞᱟᱛᱟᱨ ᱥᱟᱢᱟᱝ ᱢᱮ',
    }[language] || 'AIM LOWER AT BASE',

    // 3D Inspection titles
    inspectOverview: {
      en: 'Tunnel 3D',
      hi: 'टनल दृश्य',
      khr: 'टनल 3D',
      nag: 'टनल 3D',
      sat: 'ᱴᱟᱱᱮᱞ 3D',
    }[language] || 'Tunnel 3D',

    inspectExtinguisher: {
      en: 'Extinguisher',
      hi: 'अग्निशामक',
      khr: 'अग्निशामक',
      nag: 'सिलेंडर',
      sat: 'ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ',
    }[language] || 'Extinguisher',

    inspectFireBase: {
      en: 'Fire Base',
      hi: 'आग की जड़',
      khr: 'आग जड़',
      nag: 'आग बेस',
      sat: 'ᱥᱮᱸᱜᱮᱞ ᱵᱩᱰᱟᱹ',
    }[language] || 'Fire Base',

    inspectBlanketSand: {
      en: 'Blanket & Sand',
      hi: 'कंबल व रेत',
      khr: 'कंबल-रेत',
      nag: 'कंबल-बालू',
      sat: 'ᱠᱚᱢᱵᱚᱞ ᱟᱨ ᱵᱟᱹᱞᱤ',
    }[language] || 'Blanket & Sand',

    inspectEgressAlarm: {
      en: 'Egress & Alarm',
      hi: 'निकास व अलार्म',
      khr: 'बचाव अलार्म',
      nag: 'एस्केप अलार्म',
      sat: 'ᱚᱰᱚᱠ ᱟᱨ ᱜᱷᱟᱹᱱᱴᱤ',
    }[language] || 'Egress & Alarm',

    inspectSprayAgent: {
      en: 'Powder Cloud',
      hi: 'पाउडर क्लाउड',
      khr: 'पाउडर बादल',
      nag: 'पाउडर क्लाउड',
      sat: 'ᱯᱟᱣᱰᱚᱨ ᱨᱤᱢᱤᱞ',
    }[language] || 'Powder Cloud',
  };

  // Announce instructions with Regional TTS Voice
  const announceCurrentStep = useCallback(
    (step: PassStep) => {
      let speechText = '';
      if (step === 'PULL') speechText = `${t.stepPull}. ${t.pullInstruction}`;
      else if (step === 'AIM') speechText = `${t.stepAim}. ${t.aimInstruction}`;
      else if (step === 'SQUEEZE') speechText = `${t.stepSqueeze}. ${t.squeezeInstruction}`;
      else if (step === 'SWEEP') speechText = `${t.stepSweep}. ${t.sweepInstruction}`;
      else if (step === 'EXTINGUISHED') speechText = `${t.drillSuccessTitle}! Excellent DGMS compliance.`;

      setIsSpeaking(true);
      regionalVoice.speak(speechText, language, () => {
        setIsSpeaking(false);
      });
    },
    [language, t]
  );

  // Announce 3D inspection targets
  const announceInspection = useCallback(
    (target: InspectionTarget) => {
      let speech = '';
      if (target === 'extinguisher') {
        speech = language === 'hi'
          ? 'डीजीएमएस प्रमाणित ६ किलो एबीसी ड्राई केमिकल पाउडर अग्निशामक। ऑपरेटिंग प्रेशर १४ बार।'
          : 'DGMS Certified 6kg ABC Dry Chemical Powder Extinguisher. Operating pressure 14 bar.';
      } else if (target === 'fire_base') {
        speech = language === 'hi'
          ? 'कोयला सीम अग्नि जड़। अंगारे पर सीधा छिड़काव अनिवार्य है।'
          : 'Deep burning coal seam fire base. Direct suppression at the fuel root is required.';
      } else if (target === 'blanket_sand') {
        speech = language === 'hi'
          ? 'वैधानिक खदान अग्निशमन स्टैंड: अग्निरोधी कंबल एवं सूखी रेत की बाल्टी।'
          : 'Statutory Colliery Fire Station: Fire blanket container and dry fire sand bucket.';
      } else if (target === 'egress_alarm') {
        speech = language === 'hi'
          ? 'आपातकालीन मैनुअल कॉल पॉइंट एवं फ्लैशिंग स्ट्रॉब। सुरक्षित निकास मार्ग।'
          : 'Emergency manual fire pull station and flashing beacon. Safe egress route identified.';
      } else if (target === 'spray_agent') {
        speech = language === 'hi'
          ? 'मोनोअमोनियम फॉस्फेट ड्राई केमिकल पाउडर आग की ऑक्सीजन को बाधित करता है।'
          : 'Monoammonium Phosphate ABC powder blankets coal and suffocates oxygen.';
      }

      if (speech) {
        setIsSpeaking(true);
        regionalVoice.speak(speech, language, () => {
          setIsSpeaking(false);
        });
      }
    },
    [language]
  );

  // Initialize Three.js Scene, 3D Tunnel, Fire, and Extinguisher
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.7);
    cameraRef.current = camera;

    // 2. WebGL Renderer with Alpha for AR overlay
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Dynamic flickering fire light
    const fireLight = new THREE.PointLight(0xff6600, 3.6, 10, 1.8);
    fireLight.position.set(0, -0.15, 0);
    scene.add(fireLight);
    fireLightRef.current = fireLight;

    // Emergency beacon strobe light
    const alarmStrobeLight = new THREE.PointLight(0xef4444, 0.0, 8, 2.0);
    alarmStrobeLight.position.set(-1.6, 0.8, -0.5);
    scene.add(alarmStrobeLight);
    alarmStrobeLightRef.current = alarmStrobeLight;

    // -------------------------------------------------------------
    // 4. BUILD 3D UNDERGROUND COAL MINE TUNNEL & CONFINED SPACE
    // -------------------------------------------------------------
    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);
    tunnelGroupRef.current = tunnelGroup;

    // 4a. Heavy Steel Arch Support Ribs (CatmullRom Arches)
    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.35,
    });

    for (let i = 0; i < 6; i++) {
      const zPos = 0.8 - i * 1.05;
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, -1.0, zPos),
        new THREE.Vector3(-1.55, 0.9, zPos),
        new THREE.Vector3(0, 1.45, zPos),
        new THREE.Vector3(1.55, 0.9, zPos),
        new THREE.Vector3(1.8, -1.0, zPos),
      ]);
      const archGeo = new THREE.TubeGeometry(archCurve, 24, 0.048, 8, false);
      const archMesh = new THREE.Mesh(archGeo, archMaterial);
      tunnelGroup.add(archMesh);
    }

    // 4b. Tunnel Coal Strata Ribs & Roof (Rough rock shell)
    const rockGeo = new THREE.CylinderGeometry(1.9, 1.9, 6.5, 20, 1, true, 0, Math.PI);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      roughness: 0.96,
      metalness: 0.12,
      side: THREE.BackSide,
    });
    const rockShell = new THREE.Mesh(rockGeo, rockMat);
    rockShell.rotation.z = Math.PI / 2;
    rockShell.rotation.y = Math.PI / 2;
    rockShell.position.set(0, 0.2, -1.8);
    tunnelGroup.add(rockShell);

    // 4c. Tunnel Floor & Ballast Bed
    const floorGeo = new THREE.PlaneGeometry(3.8, 6.5);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.92 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -1.0, -1.8);
    tunnelGroup.add(floorMesh);

    // 4d. Steel Haulage Rails & Wooden Sleepers
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const leftRailGeo = new THREE.BoxGeometry(0.04, 0.05, 6.0);
    const leftRail = new THREE.Mesh(leftRailGeo, railMat);
    leftRail.position.set(-0.45, -0.96, -1.8);
    tunnelGroup.add(leftRail);

    const rightRail = new THREE.Mesh(leftRailGeo, railMat);
    rightRail.position.set(0.45, -0.96, -1.8);
    tunnelGroup.add(rightRail);

    // Sleepers (Cross ties)
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    for (let s = 0; s < 12; s++) {
      const sleeperGeo = new THREE.BoxGeometry(1.2, 0.04, 0.12);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(0, -0.98, 0.8 - s * 0.5);
      tunnelGroup.add(sleeper);
    }

    // -------------------------------------------------------------
    // 5. BUILD 3D STATUTORY FIRE STATION (Blanket & Sand Bucket)
    // -------------------------------------------------------------
    const fireStationGroup = new THREE.Group();
    fireStationGroup.position.set(-1.45, -0.2, 0.1);
    scene.add(fireStationGroup);
    fireStationGroupRef.current = fireStationGroup;

    // Statutory Wall Plate (DGMS Fire Station Stand)
    const plateGeo = new THREE.BoxGeometry(0.05, 0.8, 0.5);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.4, roughness: 0.3 });
    const wallPlate = new THREE.Mesh(plateGeo, plateMat);
    fireStationGroup.add(wallPlate);

    // Red Fire Sand Bucket (Cylinder with conical taper)
    const bucketGeo = new THREE.CylinderGeometry(0.14, 0.09, 0.26, 16);
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.3, roughness: 0.35 });
    const sandBucket = new THREE.Mesh(bucketGeo, bucketMat);
    sandBucket.position.set(0.18, -0.18, -0.12);
    fireStationGroup.add(sandBucket);

    // Fire Sand Content (Yellowish beige)
    const sandGeo = new THREE.CircleGeometry(0.13, 16);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 });
    const sand = new THREE.Mesh(sandGeo, sandMat);
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0.18, -0.06, -0.12);
    fireStationGroup.add(sand);

    // Fire Blanket Box (Red wall container with quick release handles)
    const blanketBoxGeo = new THREE.BoxGeometry(0.1, 0.34, 0.18);
    const blanketBox = new THREE.Mesh(blanketBoxGeo, bucketMat);
    blanketBox.position.set(0.12, 0.18, 0.12);
    fireStationGroup.add(blanketBox);

    // Quick release pull tabs
    const pullTabGeo = new THREE.BoxGeometry(0.02, 0.08, 0.04);
    const pullTabMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pullTab = new THREE.Mesh(pullTabGeo, pullTabMat);
    pullTab.position.set(0.18, 0.04, 0.12);
    fireStationGroup.add(pullTab);

    // -------------------------------------------------------------
    // 6. BUILD 3D EMERGENCY EGRESS & FIRE ALARM CALL POINT
    // -------------------------------------------------------------
    const alarmGroup = new THREE.Group();
    alarmGroup.position.set(-1.6, 0.65, -0.6);
    scene.add(alarmGroup);
    alarmStationGroupRef.current = alarmGroup;

    // DGMS Manual Call Point Box (Red housing with white glass window)
    const mcpBoxGeo = new THREE.BoxGeometry(0.08, 0.18, 0.18);
    const mcpBoxMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.3 });
    const mcpBox = new THREE.Mesh(mcpBoxGeo, mcpBoxMat);
    alarmGroup.add(mcpBox);

    const mcpGlassGeo = new THREE.BoxGeometry(0.02, 0.08, 0.08);
    const mcpGlassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1 });
    const mcpGlass = new THREE.Mesh(mcpGlassGeo, mcpGlassMat);
    mcpGlass.position.set(0.045, 0, 0);
    alarmGroup.add(mcpGlass);

    // Flashing Strobe Beacon (Clear cylinder with red core)
    const strobeHousingGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    const strobeHousingMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const strobeMesh = new THREE.Mesh(strobeHousingGeo, strobeHousingMat);
    strobeMesh.position.set(0, 0.18, 0);
    alarmGroup.add(strobeMesh);

    // Photoluminescent Egress Exit Arrow Marker
    const egressGeo = new THREE.BoxGeometry(0.04, 0.16, 0.35);
    const egressMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });
    const egressSign = new THREE.Mesh(egressGeo, egressMat);
    egressSign.position.set(0.04, -0.22, 0);
    alarmGroup.add(egressSign);

    // -------------------------------------------------------------
    // 7. BUILD 3D COAL SEAM FIRE & EMBER BASE
    // -------------------------------------------------------------
    const fireGroup = new THREE.Group();
    fireGroup.position.set(0, -0.42, -0.4);
    scene.add(fireGroup);
    fireGroupRef.current = fireGroup;

    // 7a. Burning Coal Mound Base (Charred rock geometries)
    const coalGeo = new THREE.DodecahedronGeometry(0.55, 1);
    const coalMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
      metalness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
    });
    const mainCoal = new THREE.Mesh(coalGeo, coalMat);
    mainCoal.scale.set(1.4, 0.45, 1.2);
    mainCoal.position.set(0, -0.15, 0);
    fireGroup.add(mainCoal);

    // Glowing ember chunks around the perimeter
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const r = 0.45 + Math.random() * 0.25;
      const subGeo = new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.08, 0);
      const subMat = new THREE.MeshStandardMaterial({
        color: 0x0c0a09,
        roughness: 0.95,
        emissive: 0xef4444,
        emissiveIntensity: 0.7,
      });
      const chunk = new THREE.Mesh(subGeo, subMat);
      chunk.position.set(Math.cos(angle) * r, -0.22, Math.sin(angle) * r);
      chunk.rotation.set(Math.random(), Math.random(), Math.random());
      fireGroup.add(chunk);
    }

    // 7b. 3D Flame Particles (Multi-tiered particle system)
    const flameCount = 220;
    const flameGeo = new THREE.BufferGeometry();
    const flamePos = new Float32Array(flameCount * 3);
    const flameColors = new Float32Array(flameCount * 3);
    const flameSizes = new Float32Array(flameCount);
    const flameVel = new Float32Array(flameCount * 3);

    const cWhite = new THREE.Color(0xfffaed);
    const cYellow = new THREE.Color(0xfacc15);
    const cOrange = new THREE.Color(0xf97316);
    const cRed = new THREE.Color(0xdc2626);

    for (let i = 0; i < flameCount; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.35;
      flamePos[idx] = Math.cos(angle) * radius;
      flamePos[idx + 1] = Math.random() * 0.7 - 0.1;
      flamePos[idx + 2] = Math.sin(angle) * radius;

      flameVel[idx] = (Math.random() - 0.5) * 0.008;
      flameVel[idx + 1] = 0.015 + Math.random() * 0.025; // rising velocity
      flameVel[idx + 2] = (Math.random() - 0.5) * 0.008;

      flameSizes[i] = 28 + Math.random() * 32;

      // Color based on height
      const hNorm = Math.min(1, Math.max(0, flamePos[idx + 1] / 0.7));
      const col = new THREE.Color();
      if (hNorm < 0.25) col.lerpColors(cWhite, cYellow, hNorm / 0.25);
      else if (hNorm < 0.7) col.lerpColors(cYellow, cOrange, (hNorm - 0.25) / 0.45);
      else col.lerpColors(cOrange, cRed, (hNorm - 0.7) / 0.3);

      flameColors[idx] = col.r;
      flameColors[idx + 1] = col.g;
      flameColors[idx + 2] = col.b;
    }

    flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
    flameGeo.setAttribute('color', new THREE.BufferAttribute(flameColors, 3));
    flameGeo.setAttribute('size', new THREE.BufferAttribute(flameSizes, 1));
    (flameGeo as any).velocities = flameVel;

    // Procedural soft circle sprite for flame
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 200, 50, 0.8)');
        grad.addColorStop(0.7, 'rgba(255, 80, 0, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const flameTexture = createParticleTexture();
    const flameMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      map: flameTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const flameParticles = new THREE.Points(flameGeo, flameMat);
    fireGroup.add(flameParticles);
    flameParticlesRef.current = flameParticles;

    // 7c. Rising Billowing Smoke Particles
    const smokeCount = 70;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    const smokeVel = new Float32Array(smokeCount * 3);

    for (let i = 0; i < smokeCount; i++) {
      const idx = i * 3;
      smokePos[idx] = (Math.random() - 0.5) * 0.4;
      smokePos[idx + 1] = 0.5 + Math.random() * 1.2;
      smokePos[idx + 2] = (Math.random() - 0.5) * 0.4;

      smokeVel[idx] = (Math.random() - 0.5) * 0.006;
      smokeVel[idx + 1] = 0.012 + Math.random() * 0.018;
      smokeVel[idx + 2] = (Math.random() - 0.5) * 0.006;
    }

    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    (smokeGeo as any).velocities = smokeVel;

    const smokeMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x334155,
      transparent: true,
      opacity: 0.45,
      map: flameTexture,
      depthWrite: false,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    fireGroup.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // 7d. Steam Particles (Billows when extinguishing)
    const steamCount = 100;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    const steamVel = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      const idx = i * 3;
      steamPos[idx] = (Math.random() - 0.5) * 0.5;
      steamPos[idx + 1] = -0.1 + Math.random() * 0.4;
      steamPos[idx + 2] = (Math.random() - 0.5) * 0.5;

      steamVel[idx] = (Math.random() - 0.5) * 0.015;
      steamVel[idx + 1] = 0.02 + Math.random() * 0.03;
      steamVel[idx + 2] = (Math.random() - 0.5) * 0.015;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    (steamGeo as any).velocities = steamVel;

    const steamMat = new THREE.PointsMaterial({
      size: 0.38,
      color: 0xf1f5f9,
      transparent: true,
      opacity: 0.0,
      map: flameTexture,
      depthWrite: false,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    fireGroup.add(steamParticles);
    steamParticlesRef.current = steamParticles;

    // -------------------------------------------------------------
    // 8. BUILD 3D INDUSTRIAL FIRE EXTINGUISHER
    // -------------------------------------------------------------
    const extinguisherGroup = new THREE.Group();
    extinguisherGroup.position.set(0.85, -0.62, 1.6);
    extinguisherGroup.rotation.set(0.12, -0.32, -0.06);
    scene.add(extinguisherGroup);
    extinguisherGroupRef.current = extinguisherGroup;

    // 8a. Red Steel Canister Body
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.72, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd32f2f,
      metalness: 0.45,
      roughness: 0.25,
    });
    const canister = new THREE.Mesh(bodyGeo, bodyMat);
    extinguisherGroup.add(canister);

    // Canister top dome
    const domeGeo = new THREE.SphereGeometry(0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, bodyMat);
    dome.position.set(0, 0.36, 0);
    extinguisherGroup.add(dome);

    // Canister bottom rim skirt
    const skirtGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.06, 32);
    const skirtMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
    });
    const skirt = new THREE.Mesh(skirtGeo, skirtMat);
    skirt.position.set(0, -0.36, 0);
    extinguisherGroup.add(skirt);

    // 8b. DGMS Yellow Safety Inspection Collar & Instruction Label
    const collarGeo = new THREE.CylinderGeometry(0.183, 0.183, 0.12, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      metalness: 0.2,
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 0.22, 0);
    extinguisherGroup.add(collar);

    // Silkscreen Label on face
    const labelGeo = new THREE.CylinderGeometry(0.182, 0.182, 0.32, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const labelMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(0, -0.06, 0);
    extinguisherGroup.add(label);

    // 8c. Valve & Operating Handle Assembly
    const valveGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.12, 16);
    const valveMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const valve = new THREE.Mesh(valveGeo, valveMat);
    valve.position.set(0, 0.54, 0);
    extinguisherGroup.add(valve);

    // Carrying handle (lower fixed)
    const handleGeo = new THREE.BoxGeometry(0.03, 0.025, 0.22);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const fixedHandle = new THREE.Mesh(handleGeo, handleMat);
    fixedHandle.position.set(0, 0.55, 0.1);
    fixedHandle.rotation.x = -0.15;
    extinguisherGroup.add(fixedHandle);

    // Operating lever (upper squeeze lever)
    const leverGeo = new THREE.BoxGeometry(0.03, 0.02, 0.24);
    const lever = new THREE.Mesh(leverGeo, handleMat);
    lever.position.set(0, 0.62, 0.1);
    lever.rotation.x = 0.15;
    extinguisherGroup.add(lever);

    // 8d. Brass Safety Pull-Pin with Yellow Tamper Tag
    const pinGeo = new THREE.TorusGeometry(0.045, 0.008, 12, 24);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.2,
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(0.06, 0.58, 0.06);
    pinMesh.rotation.y = Math.PI / 2;
    extinguisherGroup.add(pinMesh);
    pinMeshRef.current = pinMesh;

    // Pin Yellow Pull Tag
    const tagGeo = new THREE.BoxGeometry(0.015, 0.08, 0.04);
    const tagMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.position.set(0, -0.05, 0);
    pinMesh.add(tag);

    // 8e. Pressure Gauge
    const gaugeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
    const gaugeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    const gauge = new THREE.Mesh(gaugeGeo, gaugeMat);
    gauge.position.set(-0.06, 0.56, 0.02);
    gauge.rotation.z = Math.PI / 2;
    extinguisherGroup.add(gauge);

    const gaugeFaceGeo = new THREE.CircleGeometry(0.026, 16);
    const gaugeFaceMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const gaugeFace = new THREE.Mesh(gaugeFaceGeo, gaugeFaceMat);
    gaugeFace.position.set(-0.071, 0.56, 0.02);
    gaugeFace.rotation.y = -Math.PI / 2;
    extinguisherGroup.add(gaugeFace);

    // 8f. Flexible Discharge Hose & Nozzle Horn
    const hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.52, -0.05),
      new THREE.Vector3(-0.12, 0.38, -0.12),
      new THREE.Vector3(-0.25, 0.15, -0.18),
      new THREE.Vector3(-0.45, 0.28, -0.32),
      new THREE.Vector3(-0.62, 0.42, -0.55),
    ]);
    const hoseGeo = new THREE.TubeGeometry(hoseCurve, 20, 0.022, 12, false);
    const hoseMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.7, metalness: 0.2 });
    const hose = new THREE.Mesh(hoseGeo, hoseMat);
    extinguisherGroup.add(hose);

    // Nozzle / Horn
    const hornGeo = new THREE.ConeGeometry(0.045, 0.14, 16, 1, true);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.5, roughness: 0.4 });
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.position.set(-0.62, 0.42, -0.55);
    horn.rotation.set(Math.PI / 2, 0, Math.PI / 4);
    extinguisherGroup.add(horn);

    // 8g. High-Pressure Dry Powder Spray Particle System
    const sprayCount = 350;
    const sprayGeo = new THREE.BufferGeometry();
    const sprayPos = new Float32Array(sprayCount * 3);
    const sprayVel = new Float32Array(sprayCount * 3);
    const sprayLife = new Float32Array(sprayCount);

    for (let i = 0; i < sprayCount; i++) {
      const idx = i * 3;
      sprayPos[idx] = -0.62;
      sprayPos[idx + 1] = 0.42;
      sprayPos[idx + 2] = -0.55;

      sprayVel[idx] = 0;
      sprayVel[idx + 1] = 0;
      sprayVel[idx + 2] = 0;
      sprayLife[i] = 0;
    }

    sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
    (sprayGeo as any).velocities = sprayVel;
    (sprayGeo as any).lifetimes = sprayLife;

    const sprayMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      map: flameTexture,
      depthWrite: false,
    });
    const sprayParticles = new THREE.Points(sprayGeo, sprayMat);
    extinguisherGroup.add(sprayParticles);
    sprayParticlesRef.current = sprayParticles;

    // 8h. Laser Aim Guide & Reticle
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.62, 0.42, -0.55),
      new THREE.Vector3(-0.9, 0.2, -2.5),
    ]);
    const laserBeam = new THREE.Line(laserGeo, laserMat);
    extinguisherGroup.add(laserBeam);
    laserBeamRef.current = laserBeam;

    // 8i. Target Reticle on Fire Base
    const reticleGeo = new THREE.RingGeometry(0.32, 0.36, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const targetReticle = new THREE.Mesh(reticleGeo, reticleMat);
    targetReticle.rotation.x = -Math.PI / 2;
    targetReticle.position.set(0, -0.38, -0.4);
    scene.add(targetReticle);
    targetReticleRef.current = targetReticle;

    // -------------------------------------------------------------
    // 9. ANIMATION / SIMULATION RENDER LOOP
    // -------------------------------------------------------------
    let frameCount = 0;

    const animate = (timestamp: number) => {
      animIdRef.current = requestAnimationFrame(animate);
      frameCount++;

      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // 9a. Smooth Camera Orbit & Target Interpolation
      const targetMode = inspectionTargetRef.current;
      const rotY = orbitRotYRef.current;
      const rotX = orbitRotXRef.current;

      let targetCamX = Math.sin(rotY) * 3.7;
      let targetCamY = 0.35 + rotX * 1.4;
      let targetCamZ = Math.cos(rotY) * 3.7;
      let targetLookAt = new THREE.Vector3(0, -0.15, -0.3);

      if (targetMode === 'extinguisher') {
        targetCamX = 0.85 + Math.sin(rotY) * 1.5;
        targetCamY = -0.3 + rotX * 0.8;
        targetCamZ = 1.6 + Math.cos(rotY) * 1.5;
        targetLookAt = new THREE.Vector3(0.85, -0.45, 1.6);
      } else if (targetMode === 'fire_base') {
        targetCamX = Math.sin(rotY) * 2.2;
        targetCamY = -0.1 + rotX * 0.9;
        targetCamZ = -0.4 + Math.cos(rotY) * 2.2;
        targetLookAt = new THREE.Vector3(0, -0.4, -0.4);
      } else if (targetMode === 'blanket_sand') {
        targetCamX = -1.45 + Math.sin(rotY) * 1.8;
        targetCamY = 0.0 + rotX * 0.8;
        targetCamZ = 0.1 + Math.cos(rotY) * 1.8;
        targetLookAt = new THREE.Vector3(-1.45, -0.1, 0.1);
      } else if (targetMode === 'egress_alarm') {
        targetCamX = -1.6 + Math.sin(rotY) * 1.8;
        targetCamY = 0.65 + rotX * 0.8;
        targetCamZ = -0.6 + Math.cos(rotY) * 1.8;
        targetLookAt = new THREE.Vector3(-1.6, 0.55, -0.6);
      } else if (targetMode === 'spray_agent') {
        targetCamX = 0.3 + Math.sin(rotY) * 2.6;
        targetCamY = 0.1 + rotX * 1.0;
        targetCamZ = 0.6 + Math.cos(rotY) * 2.6;
        targetLookAt = new THREE.Vector3(-0.1, -0.3, -0.4);
      }

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.06);
      camera.lookAt(targetLookAt);

      // 9b. Alarm Strobe Beacon Flash
      if (alarmStrobeLightRef.current) {
        alarmStrobeLightRef.current.intensity = Math.sin(frameCount * 0.3) > 0.4 ? 2.5 : 0.1;
      }

      // 9c. Dynamic Fire Flame Particles Animation
      if (flameParticlesRef.current && fireLightRef.current) {
        const positions = flameParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const vels = (flameParticlesRef.current.geometry as any).velocities as Float32Array;
        const currentHealth = fireHealthRef.current / 100;

        // Scale fire geometry based on health
        fireGroup.scale.set(currentHealth, currentHealth, currentHealth);

        for (let i = 0; i < flameCount; i++) {
          const idx = i * 3;
          positions[idx] += vels[idx];
          positions[idx + 1] += vels[idx + 1] * currentHealth;
          positions[idx + 2] += vels[idx + 2];

          // Turbulence
          positions[idx] += Math.sin(frameCount * 0.08 + i) * 0.003;

          // Reset particle when reached top or out of bounds
          if (positions[idx + 1] > 0.85 * currentHealth || Math.random() < 0.015) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.35 * currentHealth;
            positions[idx] = Math.cos(angle) * radius;
            positions[idx + 1] = -0.15;
            positions[idx + 2] = Math.sin(angle) * radius;
          }
        }
        flameParticlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Dynamic light flicker
        if (currentHealth > 0.05) {
          const flicker = 3.0 + Math.sin(frameCount * 0.2) * 0.4 + Math.cos(frameCount * 0.31) * 0.5;
          fireLightRef.current.intensity = flicker * currentHealth;
        } else {
          fireLightRef.current.intensity = 0.1;
        }
      }

      // 9d. Smoke Particles Animation
      if (smokeParticlesRef.current) {
        const sPos = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const sVel = (smokeParticlesRef.current.geometry as any).velocities as Float32Array;
        const currentHealth = fireHealthRef.current / 100;

        for (let i = 0; i < smokeCount; i++) {
          const idx = i * 3;
          sPos[idx] += sVel[idx];
          sPos[idx + 1] += sVel[idx + 1];
          sPos[idx + 2] += sVel[idx + 2];

          if (sPos[idx + 1] > 1.9 || Math.random() < 0.008) {
            sPos[idx] = (Math.random() - 0.5) * 0.35 * currentHealth;
            sPos[idx + 1] = 0.4;
            sPos[idx + 2] = (Math.random() - 0.5) * 0.35 * currentHealth;
          }
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // 9e. Steam Particles (visible during active spray)
      if (steamParticlesRef.current) {
        const stPos = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const stVel = (steamParticlesRef.current.geometry as any).velocities as Float32Array;
        const mat = steamParticlesRef.current.material as THREE.PointsMaterial;

        if (isSprayingRef.current) {
          mat.opacity = Math.min(0.65, mat.opacity + delta * 2);
          for (let i = 0; i < steamCount; i++) {
            const idx = i * 3;
            stPos[idx] += stVel[idx];
            stPos[idx + 1] += stVel[idx + 1];
            stPos[idx + 2] += stVel[idx + 2];

            if (stPos[idx + 1] > 0.6 || Math.random() < 0.03) {
              stPos[idx] = (Math.random() - 0.5) * 0.4;
              stPos[idx + 1] = -0.15;
              stPos[idx + 2] = (Math.random() - 0.5) * 0.4;
            }
          }
          steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        } else {
          mat.opacity = Math.max(0, mat.opacity - delta * 1.5);
        }
      }

      // 9f. Update Aim & Extinguisher Rotation
      if (extinguisherGroupRef.current) {
        const curAimX = aimXRef.current;
        const curAimY = aimYRef.current;

        // Rotate the extinguisher nozzle towards aim
        extinguisherGroupRef.current.rotation.y = -0.32 + curAimX * 0.25;
        extinguisherGroupRef.current.rotation.x = 0.12 - curAimY * 0.15;

        // Update Laser Beam to target
        if (laserBeamRef.current) {
          const lPos = laserBeamRef.current.geometry.attributes.position.array as Float32Array;
          lPos[3] = -0.62 + (curAimX - 0.9) * 1.2;
          lPos[4] = 0.42 + (curAimY - 0.2) * 1.2;
          lPos[5] = -2.5;
          laserBeamRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Update Target Reticle Position
        if (targetReticleRef.current) {
          targetReticleRef.current.position.x = curAimX * 0.8;
          targetReticleRef.current.position.y = -0.38 + curAimY * 0.3;
        }
      }

      // 9g. Chemical Powder Spray Jet Simulation
      if (sprayParticlesRef.current && isSprayingRef.current && isPinPulledRef.current) {
        const spMat = sprayParticlesRef.current.material as THREE.PointsMaterial;
        spMat.opacity = 0.85;

        const pPos = sprayParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const pVel = (sprayParticlesRef.current.geometry as any).velocities as Float32Array;
        const pLife = (sprayParticlesRef.current.geometry as any).lifetimes as Float32Array;

        for (let i = 0; i < sprayCount; i++) {
          const idx = i * 3;
          pLife[i] += delta;

          pPos[idx] += pVel[idx];
          pPos[idx + 1] += pVel[idx + 1];
          pPos[idx + 2] += pVel[idx + 2];

          // Re-spawn from nozzle tip
          if (pLife[i] > 0.45 || pPos[idx + 2] < -2.4) {
            pPos[idx] = -0.62;
            pPos[idx + 1] = 0.42;
            pPos[idx + 2] = -0.55;

            pLife[i] = 0;
            // High velocity blast towards aim vector
            const spread = (Math.random() - 0.5) * 0.04;
            pVel[idx] = (aimXRef.current * 0.6 - 0.3) * 0.08 + spread;
            pVel[idx + 1] = (aimYRef.current * 0.5 - 0.3) * 0.08 + spread;
            pVel[idx + 2] = -0.12 - Math.random() * 0.06;
          }
        }
        sprayParticlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Check if sweeping left / right / center
        const x = aimXRef.current;
        if (x < -0.4) leftHitRef.current = true;
        else if (x > 0.4) rightHitRef.current = true;
        else centerHitRef.current = true;

        const hitsCount = (leftHitRef.current ? 33 : 0) + (rightHitRef.current ? 33 : 0) + (centerHitRef.current ? 34 : 0);
        setSweepProgress(hitsCount);

        // Deplete Fire Health when aiming at base
        const isBase = aimYRef.current <= -0.15;
        setIsAimingAtBase(isBase);

        if (isBase) {
          const dHealth = delta * 24;
          setFireHealth((prev) => {
            const next = Math.max(0, prev - dHealth);
            fireHealthRef.current = next;
            return next;
          });
        }

        // Deplete powder
        setPowderLevel((prev) => {
          const next = Math.max(0, prev - delta * 9);
          powderLevelRef.current = next;
          return next;
        });
      } else if (sprayParticlesRef.current) {
        const spMat = sprayParticlesRef.current.material as THREE.PointsMaterial;
        spMat.opacity = Math.max(0, spMat.opacity - delta * 3);
      }

      renderer.render(scene, camera);
    };

    animIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      sfx.stopSpray();
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      renderer.dispose();
      flameGeo.dispose();
      flameMat.dispose();
      smokeGeo.dispose();
      smokeMat.dispose();
      steamGeo.dispose();
      steamMat.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Drill Timer
  useEffect(() => {
    if (currentStep === 'EXTINGUISHED') return;
    const interval = setInterval(() => {
      setDrillTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Check completion
  useEffect(() => {
    if (fireHealth <= 0 && currentStep !== 'EXTINGUISHED') {
      setCurrentStep('EXTINGUISHED');
      setShowSuccessCard(true);
      sfx.playSuccess();
      announceCurrentStep('EXTINGUISHED');
      onDrillComplete?.(98);
    }
  }, [fireHealth, currentStep, announceCurrentStep, onDrillComplete]);

  // Pointer drag listeners for 360-degree interactive 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);

    // Raycast check: did user click directly on 3D Safety Pin?
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mousePosRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
    if (pinMeshRef.current && !isPinPulled) {
      const hits = raycasterRef.current.intersectObject(pinMeshRef.current, true);
      if (hits.length > 0) {
        handlePullPin();
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOrbitRotY((prev) => Math.max(-1.5, Math.min(1.5, prev + e.movementX * 0.015)));
    setOrbitRotX((prev) => Math.max(-0.6, Math.min(0.6, prev - e.movementY * 0.015)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Step 1: Pull Pin Action
  const handlePullPin = () => {
    if (isPinPulled) return;
    sfx.playPinPull();
    setIsPinPulled(true);

    // Animate pin extraction
    if (pinMeshRef.current) {
      pinMeshRef.current.position.x += 0.25;
      pinMeshRef.current.visible = false;
    }

    setCurrentStep('AIM');
    announceCurrentStep('AIM');
  };

  // Step 3 & 4: Spray Action
  const handleStartSpray = () => {
    if (!isPinPulled) {
      sfx.playWarning();
      return;
    }
    sfx.startSpray();
    setIsSpraying(true);
    if (currentStep === 'AIM') {
      setCurrentStep('SQUEEZE');
      announceCurrentStep('SQUEEZE');
    }
  };

  const handleStopSpray = () => {
    sfx.stopSpray();
    setIsSpraying(false);
    if (currentStep === 'SQUEEZE' && sweepProgress > 30) {
      setCurrentStep('SWEEP');
    }
  };

  // Reset Drill
  const handleResetDrill = () => {
    sfx.stopSpray();
    sfx.playTargetLock();
    setCurrentStep('PULL');
    setIsPinPulled(false);
    setIsSpraying(false);
    setFireHealth(100);
    setPowderLevel(100);
    setAimX(0);
    setAimY(-0.4);
    setSweepProgress(0);
    setDrillTimeSeconds(0);
    setShowSuccessCard(false);
    setInspectionTarget('overview');
    setOrbitRotX(0);
    setOrbitRotY(0);
    leftHitRef.current = false;
    rightHitRef.current = false;
    centerHitRef.current = false;

    if (pinMeshRef.current) {
      pinMeshRef.current.visible = true;
      pinMeshRef.current.position.set(0.06, 0.58, 0.06);
    }

    announceCurrentStep('PULL');
  };

  // Initial step announcement
  useEffect(() => {
    const timer = setTimeout(() => {
      announceCurrentStep('PULL');
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {/* 1. THREE.JS 3D WEBGL VIEWPORT WITH 360° ORBIT DRAG */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* 
        ================================================================
        2. CLEAN, MINIMAL AR HUD (Gives full space to the 3D AR screen)
        ================================================================
      */}
      <div className="absolute top-2 left-2 right-2 z-20 pointer-events-none flex flex-col gap-1.5">
        {/* Sleek Step Progression Bar: P · A · S · S · Safe */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-md pointer-events-auto">
          {/* P - Pull */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'PULL'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                : isPinPulled
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            {isPinPulled ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            <span className="truncate">P·{language === 'hi' ? 'पिन' : 'PULL'}</span>
          </div>

          {/* A - Aim */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'AIM'
                ? 'bg-blue-500 text-white ring-2 ring-blue-400/50'
                : currentStep === 'SQUEEZE' || currentStep === 'SWEEP' || currentStep === 'EXTINGUISHED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span className="truncate">A·{language === 'hi' ? 'निशाना' : 'AIM'}</span>
          </div>

          {/* S - Squeeze */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'SQUEEZE' || (isSpraying && currentStep !== 'EXTINGUISHED')
                ? 'bg-rose-500 text-white ring-2 ring-rose-400/50 animate-pulse'
                : currentStep === 'SWEEP' || currentStep === 'EXTINGUISHED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="truncate">S·{language === 'hi' ? 'दबाएं' : 'SQUEEZE'}</span>
          </div>

          {/* S - Sweep */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'SWEEP' && !showSuccessCard
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50'
                : currentStep === 'EXTINGUISHED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="truncate">S·{language === 'hi' ? 'घुमाएं' : 'SWEEP'}</span>
          </div>

          {/* Safe Cleared */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'EXTINGUISHED'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <Check className="w-3 h-3" />
            <span className="truncate">5·{language === 'hi' ? 'सुरक्षित' : 'SAFE'}</span>
          </div>

          {/* Voice Narration Button */}
          <button
            type="button"
            onClick={() => announceCurrentStep(currentStep)}
            className="p-1.5 rounded-lg bg-blue-950 border border-blue-700 text-blue-300 hover:text-white cursor-pointer transition-colors shadow-2xs"
            title="Spoken Safety Instruction"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-emerald-400 animate-pulse' : ''}`} />
          </button>
        </div>

        {/* 3D Equipment Quick Inspection Selector Pill (Clean, visible, transparent) */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md pointer-events-auto">
          <button
            type="button"
            id="ar-fire-inspect-overview-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('overview');
              announceInspection('overview');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors ${
              inspectionTarget === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            {t.inspectOverview}
          </button>

          <button
            type="button"
            id="ar-fire-inspect-extinguisher-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('extinguisher');
              announceInspection('extinguisher');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'extinguisher'
                ? 'bg-rose-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>{t.inspectExtinguisher}</span>
          </button>

          <button
            type="button"
            id="ar-fire-inspect-firebase-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('fire_base');
              announceInspection('fire_base');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'fire_base'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Flame className="w-2.5 h-2.5" />
            <span>{t.inspectFireBase}</span>
          </button>

          <button
            type="button"
            id="ar-fire-inspect-blanket-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('blanket_sand');
              announceInspection('blanket_sand');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'blanket_sand'
                ? 'bg-red-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Package className="w-2.5 h-2.5" />
            <span>{t.inspectBlanketSand}</span>
          </button>

          <button
            type="button"
            id="ar-fire-inspect-egress-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('egress_alarm');
              announceInspection('egress_alarm');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'egress_alarm'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Bell className="w-2.5 h-2.5" />
            <span>{t.inspectEgressAlarm}</span>
          </button>

          <button
            type="button"
            id="ar-fire-inspect-spray-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('spray_agent');
              announceInspection('spray_agent');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'spray_agent'
                ? 'bg-sky-500 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>{t.inspectSprayAgent}</span>
          </button>
        </div>
      </div>

      {/* Floating Compact Telemetry Badge (Top-Left - Sleek & non-blocking) */}
      <div className="absolute top-20 left-2 z-20 pointer-events-none flex flex-col gap-1 max-w-[155px]">
        {/* Flame Health mini-meter */}
        <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[10px] font-mono text-slate-200 shadow-md">
          <div className="flex items-center justify-between text-rose-300 font-bold mb-0.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>{t.fireIntensity}</span>
            </span>
            <span>{Math.round(fireHealth)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                fireHealth > 50 ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-amber-500'
              }`}
              style={{ width: `${fireHealth}%` }}
            />
          </div>
        </div>

        {/* Powder Level mini-meter */}
        <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[10px] font-mono text-slate-200 shadow-md">
          <div className="flex items-center justify-between text-blue-300 font-bold mb-0.5">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-blue-400" />
              <span>{t.extinguisherAgent}</span>
            </span>
            <span>{Math.round(powderLevel)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${powderLevel > 30 ? 'bg-blue-500' : 'bg-rose-500 animate-pulse'}`}
              style={{ width: `${powderLevel}%` }}
            />
          </div>
        </div>

        {/* Aim indicator dot */}
        <div className="px-2 py-0.5 rounded-md bg-slate-950/75 border border-slate-800/80 backdrop-blur-md text-[9px] font-mono flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isAimingAtBase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className={isAimingAtBase ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
            {isAimingAtBase ? t.baseLocked : t.aimLowerWarning}
          </span>
        </div>
      </div>

      {/* Floating 3D Target Identification Banner (Clean & Non-blocking in top-right) */}
      {inspectionTarget !== 'overview' && (
        <div className="absolute top-20 right-2 z-20 pointer-events-auto max-w-[210px] p-2 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-xl backdrop-blur-md text-[10px] text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
            <span className="font-bold text-white flex items-center gap-1 truncate">
              <Eye className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">
                {inspectionTarget === 'extinguisher'
                  ? t.inspectExtinguisher
                  : inspectionTarget === 'fire_base'
                  ? t.inspectFireBase
                  : inspectionTarget === 'blanket_sand'
                  ? t.inspectBlanketSand
                  : inspectionTarget === 'egress_alarm'
                  ? t.inspectEgressAlarm
                  : t.inspectSprayAgent}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setInspectionTarget('overview')}
              className="text-slate-400 hover:text-white px-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {inspectionTarget === 'extinguisher' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'डीजीएमएस 6 किग्रा एबीसी ड्राई पाउडर: गेज सुई हरे क्षेत्र में (14 बार)। सेफ्टी पिन खींचकर लीवर दबाएं।'
                : 'DGMS 6kg ABC dry powder: Gauge needle in green zone (14 bar). Pull pin to release operating lever.'}
            </p>
          )}

          {inspectionTarget === 'fire_base' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'जलती हुई कोयला सीम जड़: नोजल को धुएं पर नहीं, बल्कि नीचे अंगारों पर रखें।'
                : 'Deep burning coal seam: Direct discharge nozzle at embers on floor, not the rising smoke.'}
            </p>
          )}

          {inspectionTarget === 'blanket_sand' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'खदान फायर स्टैंड: सूखी रेत की बाल्टी तेल आग बुझाने एवं फाइबरग्लास कंबल दम घोंटने हेतु।'
                : 'Colliery fire stand: Dry sand bucket for class B spill fires and quick-release smothering blanket.'}
            </p>
          )}

          {inspectionTarget === 'egress_alarm' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'मैनुअल अलार्म कॉल पॉइंट: ग्लास तोड़ें, फ्लैशिंग बीकन सक्रिय करें व निकास तीर का अनुसरण करें।'
                : 'Manual pull station: Sound statutory mine evacuation alarm and follow green egress marker.'}
            </p>
          )}

          {inspectionTarget === 'spray_agent' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'मोनोअमोनियम फॉस्फेट पाउडर गर्म कोयले पर पिघलकर ऑक्सीजन अवरुद्ध करने वाली परत बनाता है।'
                : 'Monoammonium phosphate powder forms a vitrified crust over coal embers cutting off air.'}
            </p>
          )}
        </div>
      )}

      {/* 
        ================================================================
        3. BOTTOM GLOVE-FRIENDLY ACTION CONTROLS (Compact & Non-intrusive)
        ================================================================
      */}
      <div className="absolute bottom-2 left-2 right-2 z-30 pointer-events-auto flex flex-col gap-1.5">
        {/* Aim Sweep Range Slider (Only active when pin pulled) */}
        {isPinPulled && currentStep !== 'EXTINGUISHED' && (
          <div className="p-1.5 px-3 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-300 shrink-0 font-mono">
              {language === 'hi' ? 'स्वीप (SWEEP):' : 'AIM NOZZLE:'}
            </span>
            <input
              type="range"
              min="-1.2"
              max="1.2"
              step="0.05"
              value={aimX}
              onChange={(e) => setAimX(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              title="Sweep Extinguisher Left/Right"
            />
            <div className="flex items-center gap-1 shrink-0 font-mono text-[9px] text-emerald-400">
              <span>{sweepProgress}% {language === 'hi' ? 'कवर' : 'SWEPT'}</span>
            </div>
          </div>
        )}

        {/* Step 1: Pull Safety Pin Button */}
        {!isPinPulled ? (
          <button
            type="button"
            id="ar-pull-pin-btn"
            onClick={handlePullPin}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 border-amber-300 cursor-pointer animate-bounce"
          >
            <Unlock className="w-4 h-4 text-slate-950" />
            <span>{t.pullPinBtn} (PULL PIN)</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* Step 3: Hold to Spray */}
            <button
              type="button"
              id="ar-discharge-spray-btn"
              onPointerDown={handleStartSpray}
              onPointerUp={handleStopSpray}
              onPointerLeave={handleStopSpray}
              className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 transition-all cursor-pointer ${
                isSpraying
                  ? 'bg-rose-600 text-white border-rose-300 scale-98 ring-4 ring-rose-500/50 shadow-rose-900/50'
                  : 'bg-rose-500 hover:bg-rose-400 text-white border-rose-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.holdToSpray}</span>
            </button>

            {/* Reset Drill Button */}
            <button
              type="button"
              id="ar-reset-drill-btn"
              onClick={handleResetDrill}
              className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.resetDrill}</span>
            </button>
          </div>
        )}
      </div>

      {/* 
        ================================================================
        4. DRILL SUCCESS / DGMS FIRE SAFETY ACCREDITATION MODAL CARD
        ================================================================
      */}
      {showSuccessCard && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/80 shadow-2xl text-slate-100 flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  DGMS VOCATIONAL TRAINING CENTER (VTC)
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {t.drillSuccessTitle}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-b border-slate-800 py-3">
              {language === 'hi'
                ? 'उत्कृष्ट प्रदर्शन! आपने PASS तकनीक (पुल, ऐम, स्क्वीज, स्वीप) का पूर्ण अनुपालन करते हुए कोयले की आग को सुरक्षित रूप से बुझाया।'
                : language === 'sat'
                ? 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱟᱢ PASS ᱛᱚᱦᱚᱨ ᱯᱩᱨᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱠᱮᱫᱟᱢ᱾'
                : 'Outstanding performance! You completed the complete P.A.S.S. protocol (Pull, Aim, Squeeze, Sweep) and extinguished the coal mine fire under 15 seconds.'}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Score</div>
                <div className="text-lg font-black text-emerald-400">98%</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Time</div>
                <div className="text-lg font-black text-blue-400">{drillTimeSeconds}s</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Grade</div>
                <div className="text-lg font-black text-amber-400">Class A</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                id="ar-success-repeat-btn"
                onClick={handleResetDrill}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetDrill}</span>
              </button>

              <button
                type="button"
                id="ar-success-close-btn"
                onClick={() => setShowSuccessCard(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <span>{language === 'hi' ? 'अभ्यास जारी रखें' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
