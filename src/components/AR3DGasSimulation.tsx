import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Language } from '../types';
import { sfx, regionalVoice } from '../utils/audio';
import {
  Skull,
  ShieldCheck,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Wind,
  Activity,
  ArrowRight,
  Eye,
  Layers,
  Radio,
  DoorOpen,
  Sparkles,
  Compass,
  Check,
} from 'lucide-react';

interface AR3DGasSimulationProps {
  language: Language;
  onDrillComplete?: (score: number) => void;
  className?: string;
}

type GasStep = 'SAMPLE' | 'DON_SCBA' | 'EGRESS' | 'VENTILATE' | 'CLEARED';
type InspectionTarget = 'overview' | 'detector' | 'vent_duct' | 'egress' | 'scba' | 'gas_layers';

export const AR3DGasSimulation: React.FC<AR3DGasSimulationProps> = ({
  language,
  onDrillComplete,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Drill Step & Focused 3D Equipment Target
  const [currentStep, setCurrentStep] = useState<GasStep>('SAMPLE');
  const [inspectionTarget, setInspectionTarget] = useState<InspectionTarget>('overview');
  const [selectedGasLayer, setSelectedGasLayer] = useState<'all' | 'ch4' | 'co' | 'h2s'>('all');

  // Interactive 3D Orbit Drag Tracking
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [orbitRotY, setOrbitRotY] = useState<number>(0);
  const [orbitRotX, setOrbitRotX] = useState<number>(0);

  // Drill State
  const [sampleHeight, setSampleHeight] = useState<'roof' | 'floor' | 'mid'>('roof');
  const [hasSampledRoof, setHasSampledRoof] = useState<boolean>(false);
  const [hasSampledFloor, setHasSampledFloor] = useState<boolean>(false);
  const [isSCBADonned, setIsSCBADonned] = useState<boolean>(false);
  const [hasIdentifiedEgress, setHasIdentifiedEgress] = useState<boolean>(false);
  const [isBlowerActive, setIsBlowerActive] = useState<boolean>(false);
  const [gasCloudDensity, setGasCloudDensity] = useState<number>(100); // 100% to 0%
  const [ventilationProgress, setVentilationProgress] = useState<number>(0); // 0 to 100%
  const [showClearanceCard, setShowClearanceCard] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Real-time Gas Readings
  const [gasReadings, setGasReadings] = useState({
    ch4: 1.45, // % vol (DGMS danger limit > 0.75%)
    o2: 17.2, // % vol (Deficient < 19.5%)
    co: 62, // ppm (Dangerous > 50 ppm)
    h2s: 12, // ppm (Toxic > 10 ppm)
  });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // 3D Objects
  const roofGasPointsRef = useRef<THREE.Points | null>(null);
  const midGasPointsRef = useRef<THREE.Points | null>(null);
  const floorGasPointsRef = useRef<THREE.Points | null>(null);

  const gasDetectorGroupRef = useRef<THREE.Group | null>(null);
  const detectorScreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorScreenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const samplingProbeRef = useRef<THREE.Mesh | null>(null);
  const probeWandGroupRef = useRef<THREE.Group | null>(null);

  const scbaGroupRef = useRef<THREE.Group | null>(null);
  const blowerGroupRef = useRef<THREE.Group | null>(null);
  const ventDuctMeshRef = useRef<THREE.Mesh | null>(null);
  const blowerFanBladesRef = useRef<THREE.Mesh | null>(null);
  const windStreamParticlesRef = useRef<THREE.Points | null>(null);
  const alarmLightRef = useRef<THREE.PointLight | null>(null);
  const egressBeaconLightRef = useRef<THREE.PointLight | null>(null);
  const egressMarkerGroupRef = useRef<THREE.Group | null>(null);

  // Mirror refs for continuous animation loop
  const isBlowerActiveRef = useRef(false);
  const gasCloudDensityRef = useRef(100);
  const lastTimeRef = useRef(performance.now());
  const sampleHeightRef = useRef<'roof' | 'floor' | 'mid'>('roof');
  const inspectionTargetRef = useRef<InspectionTarget>('overview');
  const orbitRotYRef = useRef(0);
  const orbitRotXRef = useRef(0);
  const selectedGasLayerRef = useRef<'all' | 'ch4' | 'co' | 'h2s'>('all');
  const gasReadingsRef = useRef(gasReadings);

  isBlowerActiveRef.current = isBlowerActive;
  gasCloudDensityRef.current = gasCloudDensity;
  sampleHeightRef.current = sampleHeight;
  inspectionTargetRef.current = inspectionTarget;
  orbitRotYRef.current = orbitRotY;
  orbitRotXRef.current = orbitRotX;
  selectedGasLayerRef.current = selectedGasLayer;
  gasReadingsRef.current = gasReadings;

  // Localized text translations
  const t = {
    stepSample: {
      en: '1. TEST GAS LEVELS',
      hi: '१. गैस जांचें',
      khr: '१. गैस नापा',
      nag: '१. गैस जांच करा',
      sat: '᱑. ᱜᱮᱥ ᱯᱚᱨᱠᱷᱟᱣ ᱢᱮ',
    }[language] || '1. TEST GAS LEVELS',

    stepSCBA: {
      en: '2. DON SCBA GEAR',
      hi: '२. SCBA मास्क पहनें',
      khr: '२. SCBA मास्क पहिना',
      nag: '२. SCBA मास्क पहिना',
      sat: '᱒. SCBA ᱦᱚᱨᱚᱜ ᱢᱮ',
    }[language] || '2. DON SCBA GEAR',

    stepEgress: {
      en: '3. IDENTIFY EGRESS ROUTE',
      hi: '३. आपातकालीन निकास पहचानें',
      khr: '३. बचाव रास्ता देखा',
      nag: '३. एस्केप रास्ता देखा',
      sat: '᱓. ᱵᱟᱧᱪᱟᱣ ᱰᱟᱦᱟᱨ ᱧᱮᱞ ᱢᱮ',
    }[language] || '3. IDENTIFY EGRESS ROUTE',

    stepVent: {
      en: '4. PURGE DUCT & BLOWER',
      hi: '४. वेंटिलेशन डक्ट चालू करें',
      khr: '४. डक्ट से गैस उड़ावा',
      nag: '४. डक्ट से गैस साफा करा',
      sat: '᱔. ᱰᱟᱠᱴ ᱛᱮ ᱦᱚᱭ ᱚᱰᱚᱠ ᱢᱮ',
    }[language] || '4. PURGE WITH DUCT',

    stepSafe: {
      en: '5. SAFE FOR ENTRY',
      hi: '५. सुरक्षित प्रवेश',
      khr: '५. सुरक्षित भीतर जा',
      nag: '५. सेफ एंट्री',
      sat: '᱕. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ',
    }[language] || '5. SAFE FOR ENTRY',

    clearanceGranted: {
      en: 'CONFINED SPACE CLEARED - SAFE FOR ENTRY',
      hi: 'संकीर्ण स्थान सुरक्षित - प्रवेश स्वीकृत',
      khr: 'हवा साफ - भीतर जाय सकइ छी',
      nag: 'हवा सेफ - अंदर जाएक मंजूरी',
      sat: 'ᱦᱚᱭ ᱨᱩᱠᱷᱤᱭᱟᱹ - ᱵᱚᱞᱚᱱ ᱪᱷᱟᱹᱲ',
    }[language] || 'CONFINED SPACE CLEARED',

    gasDetectorTitle: {
      en: '3D Gas Detector',
      hi: '3D गैस डिटेक्टर',
      khr: '3D गैस मशीन',
      nag: '3D गैस डिटेक्टर',
      sat: '3D ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ',
    }[language] || '3D Gas Detector',

    ventDuctTitle: {
      en: '3D Ventilation Duct',
      hi: '3D वेंटिलेशन डक्ट',
      khr: '3D हवा डक्ट',
      nag: '3D वेंटिलेशन डक्ट',
      sat: '3D ᱵᱞᱳᱣᱟᱨ ᱰᱟᱠᱴ',
    }[language] || '3D Ventilation Duct',

    egressTitle: {
      en: 'Emergency Egress Marker',
      hi: 'आपातकालीन निकास संकेतक',
      khr: 'निकास रास्ता मार्कर',
      nag: 'एस्केप मार्कर',
      sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱪᱤᱱᱦᱟᱹ',
    }[language] || 'Emergency Egress Marker',

    scbaTitle: {
      en: '3D SCBA Breathing Gear',
      hi: '3D एससीबीए किट',
      khr: '3D ऑक्सीजन किट',
      nag: '3D एससीबीए किट',
      sat: '3D SCBA ᱥᱟᱢᱟᱱ',
    }[language] || '3D SCBA Gear',

    gasLayersTitle: {
      en: '3D Gas Clouds',
      hi: '3D जहरीली गैस बादल',
      khr: '3D गैस बादल',
      nag: '3D गैस बादल',
      sat: '3D ᱜᱮᱥ ᱵᱟᱫᱚᱞ',
    }[language] || '3D Gas Clouds',
  };

  // Announce step with TTS voice
  const announceStep = useCallback(
    (step: GasStep) => {
      let text = '';
      if (step === 'SAMPLE') {
        text = `${t.stepSample}. In confined space, use 3D gas detector to sample roof methane and floor sump hydrogen sulfide.`;
      } else if (step === 'DON_SCBA') {
        text = `${t.stepSCBA}. Toxic methane exceeds zero point seven five percent. Don positive pressure SCBA immediately.`;
      } else if (step === 'EGRESS') {
        text = `${t.stepEgress}. Identify illuminated green emergency egress markers and continuous lifeline before advancing.`;
      } else if (step === 'VENTILATE') {
        text = `${t.stepVent}. Start flameproof auxiliary blower and flexible spiral ventilation duct to purge toxic gases.`;
      } else if (step === 'CLEARED') {
        text = `${t.clearanceGranted}! Oxygen is twenty point nine percent and toxic gases are neutralized.`;
      }

      setIsSpeaking(true);
      regionalVoice.speak(text, language, () => setIsSpeaking(false));
    },
    [language, t]
  );

  const announceInspection = useCallback(
    (target: InspectionTarget) => {
      let text = '';
      if (target === 'detector') {
        text = 'Inspecting 3D DGMS Multi-Gas Detector. Shows live CH4, O2, CO, and H2S with telescopic aspirator probe.';
      } else if (target === 'vent_duct') {
        text = 'Inspecting 3D Spiral Ventilation Duct. Heavy-duty reinforced ducting suspended from tunnel arches to deliver fresh air.';
      } else if (target === 'egress') {
        text = 'Inspecting 3D Emergency Egress Markers. Photoluminescent green exit sign and continuous directional lifeline rope.';
      } else if (target === 'scba') {
        text = 'Inspecting 3D SCBA Apparatus. 300 Bar composite cylinder with positive pressure full facepiece.';
      } else if (target === 'gas_layers') {
        text = 'Inspecting 3D Stratified Gas Clouds: CH4 rises to roof, neutral CO at breathing level, and heavy H2S pools in floor sump.';
      } else {
        text = 'Viewing full 3D confined space training environment.';
      }
      setIsSpeaking(true);
      regionalVoice.speak(text, language, () => setIsSpeaking(false));
    },
    [language]
  );

  // Helper to draw the digital LCD screen of the 3D Gas Detector
  const updateDetectorScreen = (ch4: number, o2: number, co: number, h2s: number) => {
    const canvas = detectorScreenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark emerald backlit LCD screen
    ctx.fillStyle = '#022c22';
    ctx.fillRect(0, 0, 256, 192);

    // Screen border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 184);

    // Header: DGMS MULTI-GAS
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('DGMS-4GAS · DETECTOR', 14, 24);

    // Grid divider
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 32);
    ctx.lineTo(246, 32);
    ctx.moveTo(128, 32);
    ctx.lineTo(128, 180);
    ctx.moveTo(10, 108);
    ctx.lineTo(246, 108);
    ctx.stroke();

    // 1. CH4
    ctx.fillStyle = ch4 > 0.75 ? '#ef4444' : '#6ee7b7';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('CH4 (ROOF)', 14, 50);
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${ch4.toFixed(2)}%`, 14, 82);

    // 2. O2
    ctx.fillStyle = o2 < 19.5 ? '#f59e0b' : '#6ee7b7';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('O2 (AIR)', 136, 50);
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${o2.toFixed(1)}%`, 136, 82);

    // 3. CO
    ctx.fillStyle = co > 50 ? '#ef4444' : '#6ee7b7';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('CO (MID)', 14, 126);
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${Math.round(co)} PPM`, 14, 156);

    // 4. H2S
    ctx.fillStyle = h2s > 10 ? '#ef4444' : '#6ee7b7';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('H2S (SUMP)', 136, 126);
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${Math.round(h2s)} PPM`, 136, 156);

    if (detectorScreenTextureRef.current) {
      detectorScreenTextureRef.current.needsUpdate = true;
    }
  };

  // Initialize Three.js Scene with 3D Confined Space, 3D Gas Detector, Ventilation Ducts & Emergency Egress Markers
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // -------------------------------------------------------------
    // LIGHTING: Atmospheric Underground Confined Space
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.65);
    scene.add(ambientLight);

    // Cap lamp directional spotlight from worker head
    const capLampLight = new THREE.SpotLight(0xfffbeb, 3.6, 14, Math.PI / 4, 0.4);
    capLampLight.position.set(0, 0.9, 3.2);
    capLampLight.target.position.set(0, 0, -1.0);
    scene.add(capLampLight);
    scene.add(capLampLight.target);

    // Flashing Red Hazard Alarm Strobe
    const alarmLight = new THREE.PointLight(0xef4444, 2.5, 8);
    alarmLight.position.set(0.65, 0.65, 1.2);
    scene.add(alarmLight);
    alarmLightRef.current = alarmLight;

    // Glowing Green Emergency Egress Beacon Light
    const egressBeaconLight = new THREE.PointLight(0x10b981, 2.8, 6);
    egressBeaconLight.position.set(1.4, 0.5, -0.6);
    scene.add(egressBeaconLight);
    egressBeaconLightRef.current = egressBeaconLight;

    // -------------------------------------------------------------
    // 1. CONFINED SPACE TUNNEL ENVIRONMENT (Steel arches, rock, floor sump)
    // -------------------------------------------------------------
    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    // Steel Standing Arches (DGMS Three-Piece Arch Support)
    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.35,
    });

    for (let i = 0; i < 5; i++) {
      const zPos = 0.2 - i * 1.1;
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.75, -1.0, zPos),
        new THREE.Vector3(-1.5, 0.9, zPos),
        new THREE.Vector3(0, 1.45, zPos),
        new THREE.Vector3(1.5, 0.9, zPos),
        new THREE.Vector3(1.75, -1.0, zPos),
      ]);
      const archGeo = new THREE.TubeGeometry(archCurve, 24, 0.05, 8, false);
      const archMesh = new THREE.Mesh(archGeo, archMaterial);
      tunnelGroup.add(archMesh);
    }

    // Tunnel Coal Strata Ribs & Roof (Rough rock shell)
    const rockGeo = new THREE.CylinderGeometry(1.85, 1.85, 6, 20, 1, true, 0, Math.PI);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.95,
      metalness: 0.15,
      side: THREE.BackSide,
    });
    const rockShell = new THREE.Mesh(rockGeo, rockMat);
    rockShell.rotation.z = Math.PI / 2;
    rockShell.rotation.y = Math.PI / 2;
    rockShell.position.set(0, 0.2, -1.5);
    tunnelGroup.add(rockShell);

    // Tunnel Floor & Track Sump Trench
    const tunnelFloorGeo = new THREE.PlaneGeometry(3.5, 6.0);
    const tunnelFloorMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
    const floorMesh = new THREE.Mesh(tunnelFloorGeo, tunnelFloorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -1.0, -1.5);
    tunnelGroup.add(floorMesh);

    // Sump Drainage Trench (where heavy H2S pools)
    const sumpGeo = new THREE.BoxGeometry(0.8, 0.16, 4.5);
    const sumpMat = new THREE.MeshStandardMaterial({
      color: 0x022c22,
      roughness: 0.8,
      metalness: 0.3,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
    });
    const sumpMesh = new THREE.Mesh(sumpGeo, sumpMat);
    sumpMesh.position.set(0, -0.96, -1.5);
    tunnelGroup.add(sumpMesh);

    // -------------------------------------------------------------
    // 2. ESSENTIAL 3D VENTILATION DUCT & FLAMEPROOF AUXILIARY BLOWER
    // -------------------------------------------------------------
    const blowerGroup = new THREE.Group();
    blowerGroup.position.set(-1.28, -0.65, 0.5);
    scene.add(blowerGroup);
    blowerGroupRef.current = blowerGroup;

    // 2a. Flameproof (Ex d) Blower Motor Housing (Yellow Cylinder)
    const blowerHousingGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 24);
    const blowerHousingMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.45,
      roughness: 0.3,
    });
    const blowerHousing = new THREE.Mesh(blowerHousingGeo, blowerHousingMat);
    blowerHousing.rotation.z = Math.PI / 2;
    blowerGroup.add(blowerHousing);

    // Wire safety intake grille
    const grilleGeo = new THREE.CircleGeometry(0.23, 16);
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, wireframe: true });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.set(0.185, 0, 0);
    grille.rotation.y = Math.PI / 2;
    blowerGroup.add(grille);

    // Fan Blades
    const bladeGeo = new THREE.BoxGeometry(0.02, 0.42, 0.055);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const blades = new THREE.Mesh(bladeGeo, bladeMat);
    blades.position.set(0.18, 0, 0);
    blades.rotation.y = Math.PI / 2;
    blowerGroup.add(blades);
    blowerFanBladesRef.current = blades;

    // 2b. ESSENTIAL 3D FLEXIBLE SPIRAL VENTILATION DUCTING
    // Continuous heavy-duty ducting curving from the blower along the tunnel arch/rib deep into the heading
    const ductCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.28, -0.65, 0.5), // From blower
      new THREE.Vector3(-1.35, -0.2, 0.0),
      new THREE.Vector3(-1.42, 0.45, -0.8), // Along tunnel arch
      new THREE.Vector3(-1.38, 0.85, -1.8),
      new THREE.Vector3(-1.0, 0.95, -2.8), // Discharging toward face
    ]);

    const ductGeo = new THREE.TubeGeometry(ductCurve, 40, 0.16, 16, false);
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Mining yellow ventilation canvas
      roughness: 0.5,
      metalness: 0.25,
      bumpScale: 0.08,
    });
    const ductMesh = new THREE.Mesh(ductGeo, ductMat);
    scene.add(ductMesh);
    ventDuctMeshRef.current = ductMesh;

    // Spiral Reinforcing Steel Rings along the ventilation duct
    for (let r = 0; r < 24; r++) {
      const tVal = r / 24;
      const pt = ductCurve.getPoint(tVal);
      const ringGeo = new THREE.TorusGeometry(0.165, 0.012, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pt);
      ringMesh.rotation.y = Math.PI / 2;
      scene.add(ringMesh);
    }

    // Suspension Hangers securing duct to tunnel steel arches
    for (let h = 0; h < 4; h++) {
      const hCurvePt = ductCurve.getPoint(0.25 + h * 0.2);
      const hangerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 6);
      const hangerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      const hanger = new THREE.Mesh(hangerGeo, hangerMat);
      hanger.position.set(hCurvePt.x, hCurvePt.y + 0.18, hCurvePt.z);
      scene.add(hanger);
    }

    // Duct Exhaust Air Nozzle Discharge Collar
    const nozzlePt = ductCurve.getPoint(1.0);
    const nozzleGeo = new THREE.CylinderGeometry(0.165, 0.175, 0.1, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.copy(nozzlePt);
    nozzle.rotation.x = Math.PI / 2;
    scene.add(nozzle);

    // Wind / Air Stream Purge Particles (discharged from ventilation duct)
    const windCount = 200;
    const windGeo = new THREE.BufferGeometry();
    const windPos = new Float32Array(windCount * 3);
    const windVel = new Float32Array(windCount * 3);
    for (let i = 0; i < windCount; i++) {
      const idx = i * 3;
      windPos[idx] = nozzlePt.x + (Math.random() - 0.5) * 0.3;
      windPos[idx + 1] = nozzlePt.y + (Math.random() - 0.5) * 0.3;
      windPos[idx + 2] = nozzlePt.z + Math.random() * 0.4;
      windVel[idx] = 0.04 + Math.random() * 0.06;
      windVel[idx + 1] = -0.015 - Math.random() * 0.02;
      windVel[idx + 2] = 0.06 + Math.random() * 0.08;
    }
    windGeo.setAttribute('position', new THREE.BufferAttribute(windPos, 3));
    (windGeo as any).velocities = windVel;
    const windMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const windParticles = new THREE.Points(windGeo, windMat);
    scene.add(windParticles);
    windStreamParticlesRef.current = windParticles;

    // -------------------------------------------------------------
    // 3. 3D EMERGENCY EGRESS MARKERS & LIFELINE GUIDES
    // -------------------------------------------------------------
    const egressGroup = new THREE.Group();
    scene.add(egressGroup);
    egressMarkerGroupRef.current = egressGroup;

    // 3a. Photoluminescent / LED Green Emergency Exit Sign (Overhead Arch)
    const signBoardGeo = new THREE.BoxGeometry(0.55, 0.22, 0.03);
    const signBoardMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.3,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
    });
    const exitSign = new THREE.Mesh(signBoardGeo, signBoardMat);
    exitSign.position.set(1.2, 0.75, -0.4);
    exitSign.rotation.y = -0.4;
    egressGroup.add(exitSign);

    // Directional Arrow & Running Man Text Canvas Texture
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 96;
    const sCtx = signCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#047857';
      sCtx.fillRect(0, 0, 256, 96);
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 26px sans-serif';
      sCtx.fillText('<- EGRESS / निकास', 12, 44);
      sCtx.font = 'bold 16px monospace';
      sCtx.fillText('FRESH AIRWAY INTAKE', 14, 76);
    }
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signFaceGeo = new THREE.PlaneGeometry(0.53, 0.2);
    const signFaceMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true });
    const signFace = new THREE.Mesh(signFaceGeo, signFaceMat);
    signFace.position.set(1.2, 0.75, -0.38);
    signFace.rotation.y = -0.4;
    egressGroup.add(signFace);

    // 3b. Emergency Lifeline Cable (Continuous guide wire along the right rib)
    const lifelineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.48, -0.15, 1.8),
      new THREE.Vector3(1.45, -0.15, 0.6),
      new THREE.Vector3(1.42, -0.15, -0.6),
      new THREE.Vector3(1.38, -0.15, -1.8),
      new THREE.Vector3(1.32, -0.15, -2.8),
    ]);
    const lifelineGeo = new THREE.TubeGeometry(lifelineCurve, 30, 0.014, 6, false);
    const lifelineMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const lifelineMesh = new THREE.Mesh(lifelineGeo, lifelineMat);
    egressGroup.add(lifelineMesh);

    // Directional Cones on Lifeline (DGMS Braille tactile cones pointing toward fresh air exit)
    for (let c = 0; c < 4; c++) {
      const conePt = lifelineCurve.getPoint(0.15 + c * 0.25);
      const coneGeo = new THREE.ConeGeometry(0.045, 0.12, 12);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.5,
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.copy(conePt);
      coneMesh.rotation.x = Math.PI / 2; // Pointing outward to exit
      coneMesh.rotation.z = Math.PI;
      egressGroup.add(coneMesh);
    }

    // 3c. Glowing Green 3D Emergency Egress Beacon / Portal Arch
    const beaconRingGeo = new THREE.TorusGeometry(0.35, 0.035, 12, 24);
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.position.set(1.35, 0.2, -0.6);
    beaconRing.rotation.y = -Math.PI / 3;
    egressGroup.add(beaconRing);

    // -------------------------------------------------------------
    // 4. 3D MULTI-GAS DETECTOR SNIFFER WITH REAL-TIME LCD & PROBE
    // -------------------------------------------------------------
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(0.68, -0.42, 1.85);
    detectorGroup.rotation.set(0.12, -0.28, 0.04);
    scene.add(detectorGroup);
    gasDetectorGroupRef.current = detectorGroup;

    // Rugged High-Impact DGMS Yellow Body
    const detBodyGeo = new THREE.BoxGeometry(0.25, 0.4, 0.11);
    const detBodyMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.2,
    });
    const detBody = new THREE.Mesh(detBodyGeo, detBodyMat);
    detectorGroup.add(detBody);

    // Rubber shock bumper caps (top and bottom)
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    const topBumperGeo = new THREE.BoxGeometry(0.27, 0.065, 0.125);
    const topBumper = new THREE.Mesh(topBumperGeo, bumperMat);
    topBumper.position.set(0, 0.185, 0);
    detectorGroup.add(topBumper);

    const bottomBumper = topBumper.clone();
    bottomBumper.position.set(0, -0.185, 0);
    detectorGroup.add(bottomBumper);

    // Real-time Dynamic LCD Matrix Screen on Front Face
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    detectorScreenCanvasRef.current = canvas;

    const screenTexture = new THREE.CanvasTexture(canvas);
    detectorScreenTextureRef.current = screenTexture;

    const screenGeo = new THREE.PlaneGeometry(0.21, 0.16);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.03, 0.058);
    detectorGroup.add(screenMesh);

    // Dual Flashing Red Hazard LED Strobes on Crown
    const ledGeo = new THREE.SphereGeometry(0.018, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const ledLeft = new THREE.Mesh(ledGeo, ledMat);
    ledLeft.position.set(-0.08, 0.22, 0.04);
    detectorGroup.add(ledLeft);

    const ledRight = new THREE.Mesh(ledGeo, ledMat);
    ledRight.position.set(0.08, 0.22, 0.04);
    detectorGroup.add(ledRight);

    // Telescopic Sampling Wand Probe & Flexible Coiled Line
    const probeWandGroup = new THREE.Group();
    probeWandGroup.position.set(-0.16, 0.22, 0.02);
    detectorGroup.add(probeWandGroup);
    probeWandGroupRef.current = probeWandGroup;

    // Stainless steel wand
    const probeGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.72, 12);
    const probeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const probe = new THREE.Mesh(probeGeo, probeMat);
    probe.position.set(0, 0.36, 0);
    probeWandGroup.add(probe);
    samplingProbeRef.current = probe;

    // Rubber aspirator bulb
    const bulbGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 0.08, 0);
    probeWandGroup.add(bulb);

    // Intake tip nozzle
    const tipGeo = new THREE.ConeGeometry(0.018, 0.04, 12);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0, 0.73, 0);
    probeWandGroup.add(tip);

    // Initial render of detector screen
    updateDetectorScreen(1.45, 17.2, 62, 12);

    // -------------------------------------------------------------
    // 5. 3D SCBA POSITIVE-PRESSURE BREATHING APPARATUS & MASK
    // -------------------------------------------------------------
    const scbaGroup = new THREE.Group();
    scbaGroup.position.set(-0.85, -0.4, 1.85);
    scbaGroup.rotation.set(0.06, 0.32, 0);
    scene.add(scbaGroup);
    scbaGroupRef.current = scbaGroup;

    // 300 Bar Yellow Carbon-Composite Tank
    const tankGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 24);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6, roughness: 0.25 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    scbaGroup.add(tank);

    const tankDomeGeo = new THREE.SphereGeometry(0.12, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const tankDome = new THREE.Mesh(tankDomeGeo, tankMat);
    tankDome.position.set(0, 0.325, 0);
    scbaGroup.add(tankDome);

    // Valve & 300 Bar Pressure Gauge
    const tankValveGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);
    const tankValveMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const tankValve = new THREE.Mesh(tankValveGeo, tankValveMat);
    tankValve.position.set(0, 0.44, 0);
    scbaGroup.add(tankValve);

    const scbaGaugeGeo = new THREE.CircleGeometry(0.03, 16);
    const scbaGaugeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const scbaGauge = new THREE.Mesh(scbaGaugeGeo, scbaGaugeMat);
    scbaGauge.position.set(0.05, 0.44, 0.04);
    scbaGauge.rotation.y = Math.PI / 3;
    scbaGroup.add(scbaGauge);

    // Full-Face Silicone Mask with Transparent Visor
    const maskGroup = new THREE.Group();
    maskGroup.position.set(0.28, 0.22, 0.15);
    scbaGroup.add(maskGroup);

    const maskFrameGeo = new THREE.TorusGeometry(0.11, 0.025, 12, 24);
    const maskFrameMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
    const maskFrame = new THREE.Mesh(maskFrameGeo, maskFrameMat);
    maskGroup.add(maskFrame);

    const visorGeo = new THREE.SphereGeometry(0.105, 16, 12, 0, Math.PI, 0, Math.PI);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    maskGroup.add(visor);

    // -------------------------------------------------------------
    // 6. STRATIFIED 3D HAZARDOUS GAS CLOUDS (CH4 Roof, CO Mid, H2S Sump)
    // -------------------------------------------------------------
    const createCloudTexture = (r: number, g: number, b: number) => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.5)`);
        grad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.15)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };

    // Roof Methane (CH4) Cloud
    const roofCount = 140;
    const roofGeo = new THREE.BufferGeometry();
    const roofPos = new Float32Array(roofCount * 3);
    const roofVel = new Float32Array(roofCount * 3);
    for (let i = 0; i < roofCount; i++) {
      const idx = i * 3;
      roofPos[idx] = (Math.random() - 0.5) * 2.2;
      roofPos[idx + 1] = 0.7 + Math.random() * 0.55;
      roofPos[idx + 2] = -0.5 - Math.random() * 2.4;
      roofVel[idx] = (Math.random() - 0.5) * 0.006;
      roofVel[idx + 1] = 0.002 + Math.random() * 0.003;
      roofVel[idx + 2] = (Math.random() - 0.5) * 0.006;
    }
    roofGeo.setAttribute('position', new THREE.BufferAttribute(roofPos, 3));
    (roofGeo as any).velocities = roofVel;
    const roofMat = new THREE.PointsMaterial({
      size: 0.44,
      map: createCloudTexture(250, 204, 21), // Toxic yellow-green
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const roofGasPoints = new THREE.Points(roofGeo, roofMat);
    scene.add(roofGasPoints);
    roofGasPointsRef.current = roofGasPoints;

    // Mid Carbon Monoxide (CO) Cloud
    const midCount = 120;
    const midGeo = new THREE.BufferGeometry();
    const midPos = new Float32Array(midCount * 3);
    const midVel = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      const idx = i * 3;
      midPos[idx] = (Math.random() - 0.5) * 2.4;
      midPos[idx + 1] = -0.15 + (Math.random() - 0.5) * 0.5;
      midPos[idx + 2] = -0.5 - Math.random() * 2.2;
      midVel[idx] = (Math.random() - 0.5) * 0.006;
      midVel[idx + 1] = (Math.random() - 0.5) * 0.003;
      midVel[idx + 2] = (Math.random() - 0.5) * 0.006;
    }
    midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
    (midGeo as any).velocities = midVel;
    const midMat = new THREE.PointsMaterial({
      size: 0.42,
      map: createCloudTexture(56, 189, 248), // Smoky cyan-blue vapor
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const midGasPoints = new THREE.Points(midGeo, midMat);
    scene.add(midGasPoints);
    midGasPointsRef.current = midGasPoints;

    // Floor Sump Hydrogen Sulfide (H2S) Cloud
    const floorCount = 140;
    const floorGeo = new THREE.BufferGeometry();
    const floorPos = new Float32Array(floorCount * 3);
    const floorVel = new Float32Array(floorCount * 3);
    for (let i = 0; i < floorCount; i++) {
      const idx = i * 3;
      floorPos[idx] = (Math.random() - 0.5) * 1.8;
      floorPos[idx + 1] = -0.85 + Math.random() * 0.35;
      floorPos[idx + 2] = -0.6 - Math.random() * 2.2;
      floorVel[idx] = (Math.random() - 0.5) * 0.006;
      floorVel[idx + 1] = -0.002 - Math.random() * 0.002;
      floorVel[idx + 2] = (Math.random() - 0.5) * 0.006;
    }
    floorGeo.setAttribute('position', new THREE.BufferAttribute(floorPos, 3));
    (floorGeo as any).velocities = floorVel;
    const floorMat = new THREE.PointsMaterial({
      size: 0.46,
      map: createCloudTexture(239, 68, 68), // Amber-red toxic cloud
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const floorGasPoints = new THREE.Points(floorGeo, floorMat);
    scene.add(floorGasPoints);
    floorGasPointsRef.current = floorGasPoints;

    // -------------------------------------------------------------
    // 7. RENDER & ANIMATION LOOP
    // -------------------------------------------------------------
    let frameCount = 0;

    const animate = (timestamp: number) => {
      animIdRef.current = requestAnimationFrame(animate);
      frameCount++;

      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // 7a. Camera Position / Target Tweening
      const targetMode = inspectionTargetRef.current;
      let targetCamX = 0;
      let targetCamY = 0.35;
      let targetCamZ = 3.6;

      if (targetMode === 'detector') {
        targetCamX = 0.68;
        targetCamY = -0.28;
        targetCamZ = 2.4;
      } else if (targetMode === 'vent_duct') {
        targetCamX = -1.15;
        targetCamY = 0.15;
        targetCamZ = 2.0;
      } else if (targetMode === 'egress') {
        targetCamX = 1.15;
        targetCamY = 0.25;
        targetCamZ = 2.0;
      } else if (targetMode === 'scba') {
        targetCamX = -0.85;
        targetCamY = -0.25;
        targetCamZ = 2.5;
      } else if (targetMode === 'gas_layers') {
        targetCamX = 0;
        targetCamY = 0.1;
        targetCamZ = 3.2;
      }

      // Apply touch/pointer orbit drag offset
      camera.position.x += (targetCamX + orbitRotYRef.current * 0.6 - camera.position.x) * 0.06;
      camera.position.y += (targetCamY + orbitRotXRef.current * 0.4 - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;

      // 7b. Animate 3D Stratified Gas Clouds
      const curDensity = gasCloudDensityRef.current / 100;
      const activeLayer = selectedGasLayerRef.current;

      // Roof CH4
      if (roofGasPointsRef.current) {
        roofGasPointsRef.current.visible = activeLayer === 'all' || activeLayer === 'ch4';
        (roofGasPointsRef.current.material as THREE.PointsMaterial).opacity = 0.85 * curDensity;
        const pos = roofGasPointsRef.current.geometry.attributes.position.array as Float32Array;
        const vel = (roofGasPointsRef.current.geometry as any).velocities as Float32Array;
        for (let i = 0; i < roofCount; i++) {
          const idx = i * 3;
          pos[idx] += vel[idx];
          pos[idx + 1] += vel[idx + 1];
          pos[idx + 2] += vel[idx + 2];
          pos[idx] += Math.sin(frameCount * 0.02 + i) * 0.002;
          if (isBlowerActiveRef.current) {
            pos[idx] += 0.04;
            pos[idx + 2] -= 0.03;
          }
          if (pos[idx + 1] > 1.35 || pos[idx + 2] < -3.2) {
            pos[idx] = (Math.random() - 0.5) * 1.8;
            pos[idx + 1] = 0.7;
            pos[idx + 2] = -0.8;
          }
        }
        roofGasPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Mid CO
      if (midGasPointsRef.current) {
        midGasPointsRef.current.visible = activeLayer === 'all' || activeLayer === 'co';
        (midGasPointsRef.current.material as THREE.PointsMaterial).opacity = 0.75 * curDensity;
        const pos = midGasPointsRef.current.geometry.attributes.position.array as Float32Array;
        const vel = (midGasPointsRef.current.geometry as any).velocities as Float32Array;
        for (let i = 0; i < midCount; i++) {
          const idx = i * 3;
          pos[idx] += vel[idx];
          pos[idx + 1] += vel[idx + 1];
          pos[idx + 2] += vel[idx + 2];
          if (isBlowerActiveRef.current) {
            pos[idx] += 0.04;
            pos[idx + 2] -= 0.03;
          }
          if (Math.abs(pos[idx]) > 1.8 || pos[idx + 2] < -3.2) {
            pos[idx] = (Math.random() - 0.5) * 1.8;
            pos[idx + 1] = -0.15;
            pos[idx + 2] = -0.8;
          }
        }
        midGasPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Floor Sump H2S
      if (floorGasPointsRef.current) {
        floorGasPointsRef.current.visible = activeLayer === 'all' || activeLayer === 'h2s';
        (floorGasPointsRef.current.material as THREE.PointsMaterial).opacity = 0.85 * curDensity;
        const pos = floorGasPointsRef.current.geometry.attributes.position.array as Float32Array;
        const vel = (floorGasPointsRef.current.geometry as any).velocities as Float32Array;
        for (let i = 0; i < floorCount; i++) {
          const idx = i * 3;
          pos[idx] += vel[idx];
          pos[idx + 1] += vel[idx + 1];
          pos[idx + 2] += vel[idx + 2];
          if (isBlowerActiveRef.current) {
            pos[idx] += 0.04;
            pos[idx + 2] -= 0.03;
          }
          if (pos[idx + 1] < -0.98 || pos[idx + 2] < -3.2) {
            pos[idx] = (Math.random() - 0.5) * 1.5;
            pos[idx + 1] = -0.85;
            pos[idx + 2] = -0.8;
          }
        }
        floorGasPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // 7c. Alarm Beacon & Egress Beacon Pulses
      if (alarmLightRef.current) {
        if (gasCloudDensityRef.current > 20) {
          const strobe = (Math.sin(frameCount * 0.25) + 1) / 2;
          alarmLightRef.current.intensity = strobe * 2.8;
        } else {
          alarmLightRef.current.intensity = 0;
        }
      }

      if (egressBeaconLightRef.current) {
        const egressPulse = 1.8 + Math.sin(frameCount * 0.08) * 1.2;
        egressBeaconLightRef.current.intensity = egressPulse;
      }

      // 7d. Sampling Probe Height Adjustment & Wand Rotation
      if (gasDetectorGroupRef.current) {
        const curHeight = sampleHeightRef.current;
        let targetY = -0.42;
        let targetRotX = 0.12;

        if (curHeight === 'roof') {
          targetY = -0.15;
          targetRotX = -0.22;
        } else if (curHeight === 'floor') {
          targetY = -0.65;
          targetRotX = 0.38;
        }
        gasDetectorGroupRef.current.position.y += (targetY - gasDetectorGroupRef.current.position.y) * 0.08;
        gasDetectorGroupRef.current.rotation.x += (targetRotX - gasDetectorGroupRef.current.rotation.x) * 0.08;

        if (targetMode === 'detector') {
          gasDetectorGroupRef.current.rotation.y = -0.28 + orbitRotYRef.current * 1.5;
        }
      }

      // 7e. Blower Fan Spin & Fresh Air Purge Physics
      if (blowerFanBladesRef.current && isBlowerActiveRef.current) {
        blowerFanBladesRef.current.rotation.x += 0.55;

        if (windStreamParticlesRef.current) {
          (windStreamParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.75;
          const wPos = windStreamParticlesRef.current.geometry.attributes.position.array as Float32Array;
          const wVel = (windStreamParticlesRef.current.geometry as any).velocities as Float32Array;
          for (let i = 0; i < windCount; i++) {
            const idx = i * 3;
            wPos[idx] += wVel[idx];
            wPos[idx + 1] += wVel[idx + 1];
            wPos[idx + 2] += wVel[idx + 2];
            if (wPos[idx] > 1.5 || wPos[idx + 2] < -3.0) {
              wPos[idx] = nozzlePt.x + (Math.random() - 0.5) * 0.3;
              wPos[idx + 1] = nozzlePt.y + (Math.random() - 0.5) * 0.3;
              wPos[idx + 2] = nozzlePt.z;
            }
          }
          windStreamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Dilute toxic gases with fresh ventilation air
        setGasCloudDensity((prev) => Math.max(0, prev - delta * 18));
        setVentilationProgress((prev) => Math.min(100, prev + delta * 20));

        setGasReadings((prev) => {
          const next = {
            ch4: Math.max(0.04, prev.ch4 - delta * 0.28),
            o2: Math.min(20.9, prev.o2 + delta * 0.72),
            co: Math.max(0, prev.co - delta * 12.5),
            h2s: Math.max(0, prev.h2s - delta * 2.4),
          };
          updateDetectorScreen(next.ch4, next.o2, next.co, next.h2s);
          return next;
        });
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
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      renderer.dispose();
      tunnelFloorGeo.dispose();
      tunnelFloorMat.dispose();
      roofGeo.dispose();
      roofMat.dispose();
      midGeo.dispose();
      midMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      windGeo.dispose();
      windMat.dispose();
      container.innerHTML = '';
    };
  }, []);


  // Pointer drag listeners for 360-degree interactive 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);

    // Raycast check: did user click directly on 3D Egress Marker or 3D Detector?
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mousePosRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mousePosRef.current, cameraRef.current);
    if (egressMarkerGroupRef.current) {
      const hits = raycasterRef.current.intersectObjects(egressMarkerGroupRef.current.children, true);
      if (hits.length > 0 && currentStep === 'EGRESS') {
        handleIdentifyEgress();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOrbitRotY((prev) => Math.max(-1.5, Math.min(1.5, prev + e.movementX * 0.015)));
    setOrbitRotX((prev) => Math.max(-0.8, Math.min(0.8, prev - e.movementY * 0.015)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Perform Sampling Step
  const handlePerformSampling = () => {
    sfx.playTargetLock();

    if (sampleHeight === 'roof') {
      setHasSampledRoof(true);
      setSampleHeight('floor');
      sfx.playGasAlarmBeep();
    } else {
      setHasSampledFloor(true);
      setSampleHeight('mid');
      setCurrentStep('DON_SCBA');
      announceStep('DON_SCBA');
    }
  };

  // Don SCBA Step
  const handleDonSCBA = () => {
    sfx.playTargetLock();
    sfx.playSCBABreath();
    setIsSCBADonned(true);

    if (scbaGroupRef.current) {
      scbaGroupRef.current.position.set(-0.6, -0.2, 1.4);
      scbaGroupRef.current.scale.set(1.15, 1.15, 1.15);
    }

    setCurrentStep('EGRESS');
    announceStep('EGRESS');
  };

  // Identify Emergency Egress Route Step
  const handleIdentifyEgress = () => {
    sfx.playEgressIdentified();
    setHasIdentifiedEgress(true);
    setInspectionTarget('egress');

    setTimeout(() => {
      setCurrentStep('VENTILATE');
      announceStep('VENTILATE');
    }, 1200);
  };

  // Run Blower & Vent Duct Step
  const handleStartBlower = () => {
    sfx.playTargetLock();
    sfx.playVentBlower();
    setIsBlowerActive(true);

    setTimeout(() => {
      sfx.playSuccess();
      setCurrentStep('CLEARED');
      setShowClearanceCard(true);
      announceStep('CLEARED');
      onDrillComplete?.(98);
    }, 5200);
  };

  // Reset Drill
  const handleResetDrill = () => {
    sfx.playTargetLock();
    setCurrentStep('SAMPLE');
    setSampleHeight('roof');
    setHasSampledRoof(false);
    setHasSampledFloor(false);
    setIsSCBADonned(false);
    setHasIdentifiedEgress(false);
    setIsBlowerActive(false);
    setGasCloudDensity(100);
    setVentilationProgress(0);
    setShowClearanceCard(false);
    setInspectionTarget('overview');
    setOrbitRotX(0);
    setOrbitRotY(0);
    setGasReadings({
      ch4: 1.45,
      o2: 17.2,
      co: 62,
      h2s: 12,
    });
    updateDetectorScreen(1.45, 17.2, 62, 12);

    if (scbaGroupRef.current) {
      scbaGroupRef.current.position.set(-0.85, -0.4, 1.85);
      scbaGroupRef.current.scale.set(1, 1, 1);
    }

    announceStep('SAMPLE');
  };


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
        2. CLEAN, MINIMAL AR HUD (Non-intrusive so 3D equipment is visible)
        ================================================================
      */}
      <div className="absolute top-2 left-2 right-2 z-20 pointer-events-none flex flex-col gap-1.5">
        {/* Sleek Step Progression Bar */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-md pointer-events-auto">
          {/* Step 1: Sniff */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'SAMPLE'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                : hasSampledFloor
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span className="truncate">1·{language === 'hi' ? 'गैस' : 'SNIFF'}</span>
          </div>

          {/* Step 2: SCBA */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'DON_SCBA'
                ? 'bg-blue-500 text-white ring-2 ring-blue-400/50'
                : isSCBADonned
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="truncate">2·{language === 'hi' ? 'मास्क' : 'SCBA'}</span>
          </div>

          {/* Step 3: Egress */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'EGRESS'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 animate-pulse'
                : hasIdentifiedEgress
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <DoorOpen className="w-3 h-3" />
            <span className="truncate">3·{language === 'hi' ? 'निकास' : 'EGRESS'}</span>
          </div>

          {/* Step 4: Vent Duct */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'VENTILATE'
                ? 'bg-purple-500 text-white ring-2 ring-purple-400/50 animate-pulse'
                : currentStep === 'CLEARED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span className="truncate">4·{language === 'hi' ? 'डक्ट' : 'DUCT'}</span>
          </div>

          {/* Step 5: Safe */}
          <div
            className={`flex-1 flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all ${
              currentStep === 'CLEARED'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                : 'bg-slate-900/60 text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="truncate">5·{language === 'hi' ? 'सेफ' : 'SAFE'}</span>
          </div>

          {/* Voice Narration Button */}
          <button
            type="button"
            onClick={() => announceStep(currentStep)}
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
            id="ar-inspect-overview-btn"
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
            {language === 'hi' ? 'टनल दृश्य' : 'Tunnel 3D'}
          </button>

          <button
            type="button"
            id="ar-inspect-detector-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('detector');
              announceInspection('detector');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'detector'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Radio className="w-2.5 h-2.5" />
            <span>{t.gasDetectorTitle}</span>
          </button>

          <button
            type="button"
            id="ar-inspect-vent-duct-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('vent_duct');
              announceInspection('vent_duct');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'vent_duct'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Wind className="w-2.5 h-2.5" />
            <span>{t.ventDuctTitle}</span>
          </button>

          <button
            type="button"
            id="ar-inspect-egress-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('egress');
              announceInspection('egress');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'egress'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <DoorOpen className="w-2.5 h-2.5" />
            <span>{t.egressTitle}</span>
          </button>

          <button
            type="button"
            id="ar-inspect-scba-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('scba');
              announceInspection('scba');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'scba'
                ? 'bg-blue-500 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>{t.scbaTitle}</span>
          </button>

          <button
            type="button"
            id="ar-inspect-gas-layers-btn"
            onClick={() => {
              sfx.playTargetLock();
              setInspectionTarget('gas_layers');
              announceInspection('gas_layers');
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1 ${
              inspectionTarget === 'gas_layers'
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:text-white bg-slate-900/60'
            }`}
          >
            <Layers className="w-2.5 h-2.5" />
            <span>{t.gasLayersTitle}</span>
          </button>
        </div>
      </div>

      {/* Floating 3D Target Identification Banner (Clean & Non-blocking) */}
      {inspectionTarget !== 'overview' && (
        <div className="absolute top-18 right-2 z-20 pointer-events-auto max-w-[210px] p-2 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-xl backdrop-blur-md text-[10px] text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
            <span className="font-bold text-white flex items-center gap-1 truncate">
              <Eye className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">
                {inspectionTarget === 'detector'
                  ? t.gasDetectorTitle
                  : inspectionTarget === 'vent_duct'
                  ? t.ventDuctTitle
                  : inspectionTarget === 'egress'
                  ? t.egressTitle
                  : inspectionTarget === 'scba'
                  ? t.scbaTitle
                  : t.gasLayersTitle}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setInspectionTarget('overview')}
              className="text-slate-400 hover:text-white px-1 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>

          {inspectionTarget === 'detector' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'डीजीएमएस 4-गैस डिटेक्टर: लाइव एलसीडी स्क्रीन, उत्प्रेरक मीथेन सेंसर व एस्पिरेटर प्रोब।'
                : 'DGMS 4-Gas Sniffer: Real-time LCD, catalytic bead sensor & aspirator probe.'}
            </p>
          )}

          {inspectionTarget === 'vent_duct' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'स्पाइरल वेंटिलेशन डक्ट: छत के मेहराबों से लटकता प्रबलित डक्ट, जो स्वच्छ वायु पहुंचाता है।'
                : 'Flexible spiral duct suspended from steel arches supplying 450 CFM fresh air.'}
            </p>
          )}

          {inspectionTarget === 'egress' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? 'आपातकालीन निकास: हरा चमकीला निकास बोर्ड व स्पर्शनीय दिशात्मक कोन वाली लाइफलाइन।'
                : 'Photoluminescent green exit sign & continuous lifeline with directional cones.'}
            </p>
          )}

          {inspectionTarget === 'scba' && (
            <p className="text-slate-300 leading-snug">
              {language === 'hi'
                ? '३००-बार कम्पोजिट एससीबीए: सकारात्मक दबाव सिलिकॉन मास्क विषाक्त गैसों से रक्षा करता है।'
                : '300-Bar composite SCBA: Positive pressure mask protects from toxic atmospheres.'}
            </p>
          )}

          {inspectionTarget === 'gas_layers' && (
            <div className="space-y-1">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedGasLayer('all')}
                  className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                    selectedGasLayer === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGasLayer('ch4')}
                  className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                    selectedGasLayer === 'ch4' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  CH₄
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGasLayer('co')}
                  className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                    selectedGasLayer === 'co' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  CO
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGasLayer('h2s')}
                  className={`flex-1 py-0.5 rounded text-[9px] font-bold ${
                    selectedGasLayer === 'h2s' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  H₂S
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 
        ================================================================
        3. BOTTOM GLOVE-FRIENDLY ACTION CONTROLS (Clear Confined Space Walk-through)
        ================================================================
      */}
      <div className="absolute bottom-2 left-2 right-2 z-30 pointer-events-auto flex flex-col gap-1.5">
        {/* Step 1: Atmospheric Sampling */}
        {currentStep === 'SAMPLE' && (
          <button
            type="button"
            id="ar-sample-gas-btn"
            onClick={handlePerformSampling}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 border-amber-300 cursor-pointer animate-bounce"
          >
            <Activity className="w-4 h-4 text-slate-950" />
            <span>
              {sampleHeight === 'roof'
                ? language === 'hi'
                  ? '3D डिटेक्टर से छत पर मीथेन (CH4) जांचें'
                  : 'SAMPLE ROOF WITH 3D GAS DETECTOR'
                : language === 'hi'
                ? '3D डिटेक्टर से तलहटी में H2S व CO जांचें'
                : 'SAMPLE FLOOR SUMP FOR H2S & CO'}
            </span>
          </button>
        )}

        {/* Step 2: Don SCBA */}
        {currentStep === 'DON_SCBA' && (
          <button
            type="button"
            id="ar-don-scba-btn"
            onClick={handleDonSCBA}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 border-blue-400 cursor-pointer animate-pulse"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>
              {language === 'hi'
                ? '3D SCBA किट व सकारात्मक दबाव मास्क पहनें'
                : 'DON 3D POSITIVE-PRESSURE SCBA GEAR'}
            </span>
          </button>
        )}

        {/* Step 3: Identify Emergency Egress Markers */}
        {currentStep === 'EGRESS' && (
          <button
            type="button"
            id="ar-identify-egress-btn"
            onClick={handleIdentifyEgress}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 border-emerald-400 cursor-pointer animate-pulse"
          >
            <DoorOpen className="w-4 h-4 text-white" />
            <span>
              {language === 'hi'
                ? 'आपातकालीन निकास संकेतक व लाइफलाइन सत्यापित करें'
                : 'IDENTIFY EMERGENCY EGRESS & LIFELINE'}
            </span>
          </button>
        )}

        {/* Step 4: Ventilation Ducts & Blower */}
        {currentStep === 'VENTILATE' && (
          <button
            type="button"
            id="ar-run-blower-btn"
            onClick={handleStartBlower}
            disabled={isBlowerActive}
            className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl border-2 transition-all cursor-pointer ${
              isBlowerActive
                ? 'bg-purple-700 text-purple-200 border-purple-500 ring-4 ring-purple-600/40'
                : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400'
            }`}
          >
            <Wind className={`w-4 h-4 ${isBlowerActive ? 'animate-spin' : ''}`} />
            <span>
              {isBlowerActive
                ? `${language === 'hi' ? 'वेंटिलेशन डक्ट से निष्कासन...' : 'PURGING VIA VENTILATION DUCT...'} ${Math.round(ventilationProgress)}%`
                : language === 'hi'
                ? '3D वेंटिलेशन डक्ट व ब्लोअर से गैस बाहर निकालें'
                : 'ACTIVATE 3D VENTILATION DUCT & PURGE'}
            </span>
          </button>
        )}

        {/* Step 5: Cleared Safe Repeat */}
        {currentStep === 'CLEARED' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="ar-gas-repeat-btn"
              onClick={handleResetDrill}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'पुनः 3D अभ्यास करें' : 'Repeat 3D Drill'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 
        ================================================================
        4. CLEARANCE SUCCESS CARD (DGMS CONFINED SPACE ACCREDITATION)
        ================================================================
      */}
      {showClearanceCard && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-150">
          <div className="w-full max-w-md p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500 shadow-2xl text-slate-100 flex flex-col space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  DGMS CONFINED SPACE SAFETY PROTOCOL
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {t.clearanceGranted}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-b border-slate-800 py-2">
              {language === 'hi'
                ? 'उत्कृष्ट अनुपालन! 3D बहु-गैस डिटेक्टर जांच, SCBA धारण, आपातकालीन निकास सत्यापन एवं वेंटिलेशन डक्ट निष्कासन सफलतापूर्वक पूर्ण।'
                : 'Full DGMS compliance achieved: 3D gas sampling, SCBA donning, emergency egress identification, and ventilation duct purging.'}
            </p>

            <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
              <div className="p-1 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-[9px] text-slate-400">CH₄</div>
                <div className="font-bold text-emerald-400">0.04%</div>
              </div>
              <div className="p-1 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-[9px] text-slate-400">O₂</div>
                <div className="font-bold text-emerald-400">20.9%</div>
              </div>
              <div className="p-1 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-[9px] text-slate-400">CO</div>
                <div className="font-bold text-emerald-400">0 PPM</div>
              </div>
              <div className="p-1 rounded-lg bg-slate-800 border border-slate-700">
                <div className="text-[9px] text-slate-400">Score</div>
                <div className="font-bold text-amber-400">98%</div>
              </div>
            </div>

            <button
              type="button"
              id="ar-gas-clear-close-btn"
              onClick={() => setShowClearanceCard(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <span>{language === 'hi' ? '3D वातावरण में निरीक्षण जारी रखें' : 'Continue 3D Inspection'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
