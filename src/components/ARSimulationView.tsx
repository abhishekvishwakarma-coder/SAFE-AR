import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrainingModule, ARScenario, Language } from '../types';
import { modulesData } from '../data/mockData';
import { translations } from '../data/translations';
import { getLocalizedModule } from '../data/localizedScenarios';
import {
  Camera,
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Flame,
  DoorOpen,
  Shield,
  ShieldCheck,
  HardHat,
  Crosshair,
  MapPin,
  RefreshCw,
  Sparkles,
  Zap,
  ZapOff,
  SwitchCamera,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Layers,
  Eye,
  Maximize2,
  FileCheck2,
  Sun,
  Moon,
  Info,
  Scan,
  Smartphone,
  Check,
  Skull,
} from 'lucide-react';
import { sfx } from '../utils/audio';
import { AR3DFireSimulation } from './AR3DFireSimulation';
import { AR3DGasSimulation } from './AR3DGasSimulation';

interface ARSimulationViewProps {
  module: TrainingModule;
  language: Language;
  onBackToDashboard: () => void;
  onCompleteSimulation: () => void;
  onSelectModule?: (moduleId: string) => void;
  isDedicatedScreen?: boolean;
  onProceedToAssessment?: (moduleId: string) => void;
}

export const ARSimulationView: React.FC<ARSimulationViewProps> = ({
  module: initialModule,
  language,
  onBackToDashboard,
  onCompleteSimulation,
  onSelectModule,
  isDedicatedScreen = false,
  onProceedToAssessment,
}) => {
  const t = translations[language];

  // Active module state (allows switching modules directly in AR screen)
  const [currentModuleId, setCurrentModuleId] = useState<string>(initialModule.id);
  const rawActiveModule: TrainingModule =
    modulesData.find((m) => m.id === currentModuleId) || initialModule;

  // Fully localized module data (titles, questions, options, markers in en, hi, sat)
  const activeModule: TrainingModule = getLocalizedModule(rawActiveModule, language);

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // PPE Selector multi-selection state for Scenario 2 of Gas module
  const [selectedPPE, setSelectedPPE] = useState<string[]>([]);

  // Active marker inspected
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // LAYOUT MODE: Landscape vs Portrait (75% Camera / 25% Quiz)
  const [orientationMode, setOrientationMode] = useState<'portrait' | 'landscape'>('portrait');

  // MOBILE DETECTION: Back Camera Only Enforcement
  const isMobile =
    typeof navigator !== 'undefined' &&
    (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && 'ontouchstart' in window));

  // CAMERA & SENSOR STATES
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(true);
  const [cameraStatus, setCameraStatus] = useState<
    'requesting' | 'active' | 'denied' | 'error' | 'simulated'
  >('requesting');
  // On mobile, enforce back/environment camera strictly
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isFreezeFrame, setIsFreezeFrame] = useState<boolean>(false);
  const [frozenFrameData, setFrozenFrameData] = useState<string | null>(null);
  const [isLowLight, setIsLowLight] = useState<boolean>(false);
  const [hasGyroscope, setHasGyroscope] = useState<boolean>(false);

  // Enhanced Area Scanning States & Scan Modes
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [scanFilterMode, setScanFilterMode] = useState<'hazard' | 'lidar' | 'ppe'>('hazard');
  const [scanPulseTime, setScanPulseTime] = useState<number>(0);
  const [areaMappedPercent, setAreaMappedPercent] = useState<number>(88);

  // Virtual pitch/yaw for 3D marker parallax & Gyro tracking
  const [virtualPitch, setVirtualPitch] = useState<number>(0);
  const [virtualYaw, setVirtualYaw] = useState<number>(0);

  // Target lock indicator
  const [lockedMarkerId, setLockedMarkerId] = useState<string | null>(null);

  // 3D Burning Fire and 3D Fire Extinguisher AR Drill Mode
  const [is3DFireMode, setIs3DFireMode] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const scenario: ARScenario = activeModule.scenarios[currentScenarioIndex] || activeModule.scenarios[0];
  const isLastScenario = currentScenarioIndex === activeModule.scenarios.length - 1;

  // Sync module change if prop changes
  useEffect(() => {
    setCurrentModuleId(initialModule.id);
  }, [initialModule.id]);

  // Initialize camera stream - STRICTLY BACK CAMERA on mobile phones
  const startCameraStream = useCallback(
    async (facing: 'environment' | 'user' = 'environment') => {
      setCameraStatus('requesting');
      setIsFreezeFrame(false);
      setFrozenFrameData(null);

      // Stop any existing tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('error');
        setIsLiveCameraActive(false);
        return;
      }

      try {
        let stream: MediaStream;

        if (isMobile) {
          // On mobile phones, strictly enforce back/environment camera
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { exact: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            });
          } catch {
            // Fallback to ideal if exact is rejected on some devices
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: 'environment' },
              },
              audio: false,
            });
          }
        } else {
          // Desktop / simulator environment
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: facing },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            });
          } catch {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
          }
        }

        streamRef.current = stream;

        // Check torch capability
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          try {
            const capabilities = videoTrack.getCapabilities?.() as { torch?: boolean } | undefined;
            setIsTorchSupported(Boolean(capabilities?.torch));
          } catch {
            setIsTorchSupported(false);
          }
        }

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((e) => console.warn('Video play interrupted', e));
          };
        }

        setCameraFacing('environment');
        setCameraStatus('active');
        setIsLiveCameraActive(true);
      } catch (err: unknown) {
        console.warn('Camera access error', err);
        const error = err as { name?: string };
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setCameraStatus('denied');
        } else {
          setCameraStatus('error');
        }
        setIsLiveCameraActive(false);
      }
    },
    [isMobile]
  );

  // Initial camera mount
  useEffect(() => {
    startCameraStream('environment');

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [startCameraStream]);

  // Ensure video element has srcObject if it re-mounts
  useEffect(() => {
    if (isLiveCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isLiveCameraActive]);

  // Device orientation / Gyroscope listener for realistic AR parallax
  useEffect(() => {
    let initialAlpha: number | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setHasGyroscope(true);

        if (initialAlpha === null && e.alpha !== null) {
          initialAlpha = e.alpha;
        }

        const deltaYaw = e.alpha !== null && initialAlpha !== null ? e.alpha - initialAlpha : e.gamma;
        const clampedYaw = Math.max(-30, Math.min(30, deltaYaw * 0.4));
        const clampedPitch = Math.max(-20, Math.min(20, (e.beta - 50) * 0.3));

        setVirtualYaw(clampedYaw);
        setVirtualPitch(clampedPitch);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Enhanced Real-time Canvas AR Area Scanning, SLAM Mesh & Sweeping Laser
  useEffect(() => {
    let isSubscribed = true;
    let frameCount = 0;

    const renderARHUD = () => {
      if (!isSubscribed) return;
      frameCount++;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const width = (canvas.width = canvas.clientWidth);
          const height = (canvas.height = canvas.clientHeight);

          ctx.clearRect(0, 0, width, height);

          // 1. Enhanced Sweeping LIDAR/SLAM Laser Line
          if (isScanningActive) {
            const scanY = (Math.sin(frameCount * 0.035) * 0.45 + 0.5) * height;

            const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
            grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
            grad.addColorStop(0.5, scanFilterMode === 'hazard' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(56, 189, 248, 0.55)');
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

            ctx.fillStyle = grad;
            ctx.fillRect(0, scanY - 15, width, 30);

            // Laser core line
            ctx.strokeStyle = scanFilterMode === 'hazard' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(56, 189, 248, 0.85)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();

            // Laser telemetry readouts
            ctx.fillStyle = scanFilterMode === 'hazard' ? '#f87171' : '#38bdf8';
            ctx.font = '10px monospace';
            ctx.fillText(`SLAM SCAN LINE · Y: ${Math.round(scanY)}px | DENSITY: 98.4%`, 12, scanY - 4);
          }

          // 2. Ultrasonic Rescan Pulse Wave (triggered by user button)
          if (scanPulseTime > 0) {
            const elapsed = (Date.now() - scanPulseTime) / 1000;
            if (elapsed < 1.8) {
              const pulseRadius = elapsed * Math.max(width, height) * 0.7;
              ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, 0.8 - elapsed * 0.45)})`;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(width / 2, height / 2, pulseRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // 3. Spatial Ground Plane Isometric Perspective Mesh (0.85m AGL)
          if (scanFilterMode === 'lidar' || scanFilterMode === 'hazard') {
            const horizonY = height * 0.58;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
            ctx.lineWidth = 1;

            // Longitudinal grid rays converging to horizon
            for (let i = -5; i <= 5; i++) {
              ctx.beginPath();
              ctx.moveTo(width / 2 + i * 28, horizonY);
              ctx.lineTo(width / 2 + i * (width * 0.14), height);
              ctx.stroke();
            }

            // Transverse distance contour rings
            const rings = [0.15, 0.35, 0.6, 0.9];
            rings.forEach((rRatio) => {
              const y = horizonY + (height - horizonY) * rRatio;
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(width, y);
              ctx.stroke();
            });
          }

          // 4. Dense SLAM Feature Tracking Point Cloud (40+ vertices)
          const featurePoints = [
            { x: 0.15, y: 0.32 },
            { x: 0.24, y: 0.38 },
            { x: 0.32, y: 0.45 },
            { x: 0.42, y: 0.35 },
            { x: 0.48, y: 0.42 },
            { x: 0.56, y: 0.36 },
            { x: 0.64, y: 0.48 },
            { x: 0.72, y: 0.39 },
            { x: 0.82, y: 0.44 },
            { x: 0.88, y: 0.35 },
            { x: 0.18, y: 0.62 },
            { x: 0.28, y: 0.68 },
            { x: 0.38, y: 0.74 },
            { x: 0.46, y: 0.69 },
            { x: 0.54, y: 0.78 },
            { x: 0.62, y: 0.72 },
            { x: 0.74, y: 0.66 },
            { x: 0.84, y: 0.75 },
            { x: 0.35, y: 0.82 },
            { x: 0.65, y: 0.84 },
          ];

          featurePoints.forEach((pt, idx) => {
            const px = pt.x * width + virtualYaw * 1.6;
            const py = pt.y * height + virtualPitch * 1.6;
            const pulse = (Math.sin((frameCount + idx * 15) * 0.08) + 1) / 2;

            ctx.fillStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(52, 211, 153, 0.85)';
            ctx.beginPath();
            ctx.arc(px, py, 2 + pulse * 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby points to simulate spatial surface mesh triangulation
            if (idx > 0 && idx % 3 === 0) {
              const prev = featurePoints[idx - 1];
              const ppx = prev.x * width + virtualYaw * 1.6;
              const ppy = prev.y * height + virtualPitch * 1.6;
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(ppx, ppy);
              ctx.stroke();
            }
          });

          // 5. Center Reticle Target Raycast & Distance Rangefinder
          const cx = width / 2;
          const cy = height / 2;

          let closestMarkerId: string | null = null;
          let minDistance = 9999;

          scenario.markers.forEach((marker) => {
            const mx = (marker.x / 100) * width + virtualYaw * 1.6;
            const my = (marker.y / 100) * height + virtualPitch * 1.6;
            const dist = Math.hypot(mx - cx, my - cy);

            if (dist < 90 && dist < minDistance) {
              minDistance = dist;
              closestMarkerId = marker.id;
            }
          });

          if (closestMarkerId !== lockedMarkerId) {
            setLockedMarkerId(closestMarkerId);
            if (closestMarkerId) {
              sfx.playTargetLock();
              if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                try {
                  navigator.vibrate(35);
                } catch {
                  // ignore
                }
              }
            }
          }

          const isLocked = Boolean(closestMarkerId);
          ctx.strokeStyle = isLocked ? 'rgba(52, 211, 153, 0.95)' : 'rgba(96, 165, 250, 0.7)';
          ctx.lineWidth = 1.5;

          // Circular reticle
          ctx.beginPath();
          ctx.arc(cx, cy, 32, 0, Math.PI * 2);
          ctx.stroke();

          // Reticle brackets & tick lines
          const r = 38;
          ctx.beginPath();
          ctx.moveTo(cx - r, cy);
          ctx.lineTo(cx - 24, cy);
          ctx.moveTo(cx + 24, cy);
          ctx.lineTo(cx + r, cy);
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx, cy - 24);
          ctx.moveTo(cx, cy + 24);
          ctx.lineTo(cx, cy + r);
          ctx.stroke();

          // Reticle center dot
          ctx.fillStyle = isLocked ? '#34d399' : '#60a5fa';
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Real-time Rangefinder & Telemetry HUD text beneath reticle
          const simulatedDist = isLocked ? (1.4 + (minDistance / 100) * 0.5).toFixed(1) : '2.1';
          ctx.fillStyle = isLocked ? '#34d399' : '#94a3b8';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`DIST: ${simulatedDist}m · AZ: ${Math.round(virtualYaw)}° · ELEV: ${Math.round(virtualPitch)}°`, cx, cy + 50);

          // 6. Periodic Ambient Light Level Check (every ~45 frames)
          if (frameCount % 45 === 0 && isLiveCameraActive && videoRef.current) {
            try {
              const video = videoRef.current;
              if (video.videoWidth > 0 && video.videoHeight > 0) {
                const offCanvas = document.createElement('canvas');
                offCanvas.width = 32;
                offCanvas.height = 32;
                const offCtx = offCanvas.getContext('2d');
                if (offCtx) {
                  offCtx.drawImage(video, 0, 0, 32, 32);
                  const imgData = offCtx.getImageData(0, 0, 32, 32).data;
                  let totalLum = 0;
                  for (let i = 0; i < imgData.length; i += 4) {
                    totalLum += 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
                  }
                  const avgLum = totalLum / (imgData.length / 4);
                  setIsLowLight(avgLum < 38);
                }
              }
            } catch {
              // ignore
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(renderARHUD);
    };

    animFrameRef.current = requestAnimationFrame(renderARHUD);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    scenario.markers,
    virtualPitch,
    virtualYaw,
    lockedMarkerId,
    isLiveCameraActive,
    isScanningActive,
    scanPulseTime,
    scanFilterMode,
  ]);

  // Touch / Pointer drag for manual panning on desktop or non-gyro devices
  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      setVirtualYaw((prev) => Math.max(-28, Math.min(28, prev + e.movementX * 0.12)));
      setVirtualPitch((prev) => Math.max(-18, Math.min(18, prev + e.movementY * 0.12)));
    }
  };

  // Toggle Torch / Flashlight
  const handleToggleTorch = async () => {
    sfx.playTargetLock();
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (err) {
        console.warn('Torch constraint not supported on this device', err);
      }
    }
  };

  // Freeze Frame / Snapshot capture
  const handleToggleFreezeFrame = () => {
    sfx.playTargetLock();
    if (isFreezeFrame) {
      setIsFreezeFrame(false);
      setFrozenFrameData(null);
    } else {
      if (videoRef.current) {
        try {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setFrozenFrameData(dataUrl);
            setIsFreezeFrame(true);
            sfx.playSuccess();
          }
        } catch (err) {
          console.warn('Unable to freeze camera frame', err);
        }
      }
    }
  };

  // Trigger Area Rescan
  const handleTriggerRescan = () => {
    sfx.playTargetLock();
    setScanPulseTime(Date.now());
    setAreaMappedPercent((prev) => Math.min(100, prev + 4));
  };

  // Option selection in Quiz
  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    sfx.playTargetLock();
    setSelectedOptionId(optionId);
  };

  // PPE item toggle
  const togglePPEItem = (itemId: string) => {
    if (isAnswerSubmitted) return;
    sfx.playTargetLock();
    setSelectedPPE((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Submit Answer
  const handleSubmitOption = () => {
    if (!selectedOptionId) return;

    const opt = scenario.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(opt.isCorrect);
    setFeedbackText(opt.feedback);

    if (opt.isCorrect) {
      sfx.playSuccess();
    } else {
      sfx.playWarning();
    }
  };

  // Submit PPE Answer
  const handlePPESubmit = () => {
    const requiredItems = ['ppe-helmet', 'ppe-shoes', 'ppe-respirator', 'ppe-gloves'];
    const invalidItems = ['ppe-sandals'];

    const hasAllRequired = requiredItems.every((item) => selectedPPE.includes(item));
    const hasNoInvalid = !invalidItems.some((item) => selectedPPE.includes(item));

    const isCorrect = hasAllRequired && hasNoInvalid;

    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setFeedbackText(
        language === 'hi'
          ? 'सटीक निरीक्षण! सभी अनिवार्य श्वसन, सुरक्षा जूते एवं हेलमेट उपकरण सत्यापित।'
          : language === 'sat'
          ? 'ᱴᱷᱤᱠ ᱜᱚᱴᱟ! ᱡᱚᱛᱚ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ PPE ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ᱾'
          : 'Protocol Verified! Full SCBA and electrostatic PPE suit verified.'
      );
      sfx.playSuccess();
    } else {
      setFeedbackText(
        language === 'hi'
          ? 'अनुपालन त्रुटि: निषिद्ध जूते अथवा अधूरा पीपीई सुरक्षा कवच पाया गया।'
          : language === 'sat'
          ? 'ᱵᱟᱹᱲᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ᱾ ᱟᱨᱦᱚᱸ ᱧᱮᱞ ᱢᱮ᱾'
          : 'Compliance Violation: Forbidden footwear selected or critical SCBA gear omitted.'
      );
      sfx.playWarning();
    }
  };

  // Retry
  const handleRetryScenario = () => {
    sfx.playTargetLock();
    setSelectedOptionId(null);
    setSelectedPPE([]);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);
    setFeedbackText('');
  };

  // Proceed to Next Scenario or Assessment
  const handleNextScenario = () => {
    sfx.playTargetLock();
    if (isLastScenario) {
      if (onProceedToAssessment) {
        onProceedToAssessment(activeModule.id);
      } else {
        onCompleteSimulation();
      }
    } else {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setSelectedPPE([]);
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(false);
      setFeedbackText('');
      setActiveMarkerId(null);
    }
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col ${
        orientationMode === 'landscape'
          ? 'h-[85vh] min-h-[560px] max-h-[860px]'
          : 'h-[88vh] min-h-[660px] max-h-[920px]'
      }`}
      onPointerMove={handlePointerMove}
    >
      {/* 
        ================================================================
        TOP COMPACT AR HUD CONTROLS BAR
        ================================================================
      */}
      <div className="relative z-30 px-3 py-2 bg-slate-900 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="ar-back-btn"
            onClick={() => {
              sfx.playTargetLock();
              onBackToDashboard();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors shadow-xs"
            title={t.dashboard}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                {t.arTrainingMode}
              </span>
              <span className="text-[10px] text-blue-200 bg-blue-950 border border-blue-800 px-1.5 py-0.2 rounded font-mono">
                {currentScenarioIndex + 1}/{activeModule.scenarios.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[180px] sm:max-w-xs font-medium">
              {scenario.title}
            </p>
          </div>
        </div>

        {/* Action Controls: Orientation Segmented Toggle, Scan Filters, Torch, Rescan */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Prominent Orientation Segmented Toggle (Portrait 75/25 vs Landscape 75/25) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              id="ar-portrait-mode-btn"
              onClick={() => {
                sfx.playTargetLock();
                setOrientationMode('portrait');
              }}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                orientationMode === 'portrait'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={t.orientationPortrait}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'पोर्ट्रेट (75/25)' : language === 'sat' ? 'ᱯᱚᱨᱴᱨᱮᱴ (75/25)' : 'Portrait (75/25)'}
              </span>
            </button>
            <button
              type="button"
              id="ar-landscape-mode-btn"
              onClick={() => {
                sfx.playTargetLock();
                setOrientationMode('landscape');
              }}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                orientationMode === 'landscape'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title={t.orientationLandscape}
            >
              <Smartphone className="w-3.5 h-3.5 rotate-90" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'लैंडस्केप (75/25)' : language === 'sat' ? 'ᱞᱮᱱᱰᱥᱠᱮᱯ (75/25)' : 'Landscape (75/25)'}
              </span>
            </button>
          </div>

          {/* Area Scan Filter Modes: Hazard, LiDAR Mesh, PPE */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => {
                sfx.playTargetLock();
                setScanFilterMode('hazard');
              }}
              className={`px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                scanFilterMode === 'hazard'
                  ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.hazardScan}
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.playTargetLock();
                setScanFilterMode('lidar');
              }}
              className={`px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                scanFilterMode === 'lidar'
                  ? 'bg-blue-950 text-blue-300 border border-blue-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.slamMesh}
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.playTargetLock();
                setScanFilterMode('ppe');
              }}
              className={`px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                scanFilterMode === 'ppe'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.ppeDetect}
            </button>
          </div>

          {/* Quick Module Switcher Pill (Fire vs Gas) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              id="ar-switch-to-fire-btn"
              onClick={() => {
                sfx.playTargetLock();
                setCurrentModuleId('fire-safety');
                onSelectModule?.('fire-safety');
              }}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                activeModule.id === 'fire-safety'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fire Safety Module"
            >
              <Flame className="w-3 h-3 text-orange-200" />
              <span className="hidden sm:inline">{language === 'hi' ? 'अग्नि' : 'Fire'}</span>
            </button>
            <button
              type="button"
              id="ar-switch-to-gas-btn"
              onClick={() => {
                sfx.playTargetLock();
                setCurrentModuleId('gas-safety');
                onSelectModule?.('gas-safety');
              }}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                activeModule.id === 'gas-safety'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Gas Leak & Confined Space Module"
            >
              <Skull className="w-3 h-3 text-emerald-200" />
              <span className="hidden sm:inline">{language === 'hi' ? 'गैस व संकीर्ण' : 'Gas & Confined'}</span>
            </button>
          </div>

          {/* 3D AR Equipment Simulation Toggle */}
          <button
            type="button"
            id="ar-toggle-3d-fire-btn"
            onClick={() => {
              sfx.playTargetLock();
              setIs3DFireMode((prev) => !prev);
            }}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              is3DFireMode
                ? activeModule.id === 'gas-safety'
                  ? 'bg-emerald-700 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-500/40'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="3D AR Simulation Drill"
          >
            {activeModule.id === 'gas-safety' ? (
              <>
                <Skull className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="hidden md:inline">
                  {language === 'hi' ? '3D गैस व SCBA' : language === 'sat' ? '3D ᱜᱮᱥ ᱟᱨ SCBA' : '3D Gas & SCBA'}
                </span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden md:inline">
                  {language === 'hi' ? '3D आग व अग्निशामक' : language === 'sat' ? '3D ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ' : '3D Fire & Extinguisher'}
                </span>
              </>
            )}
          </button>

          {/* Rescan Colliery Surface Button */}
          <button
            type="button"
            id="ar-rescan-btn"
            onClick={handleTriggerRescan}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title={t.rescanArea}
          >
            <Scan className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{t.rescanArea}</span>
          </button>

          {/* Helmet Cap Torch / Flashlight */}
          {isTorchSupported && isLiveCameraActive && (
            <button
              type="button"
              id="toggle-torch-btn"
              onClick={handleToggleTorch}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                isTorchOn
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={t.torchToggle}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.torchToggle}</span>
            </button>
          )}

          {/* Freeze Frame Button */}
          {isLiveCameraActive && (
            <button
              type="button"
              id="freeze-frame-btn"
              onClick={handleToggleFreezeFrame}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                isFreezeFrame
                  ? 'bg-rose-600 text-white border-rose-500 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={isFreezeFrame ? t.resumeFeed : t.freezeFrame}
            >
              {isFreezeFrame ? <Play className="w-3.5 h-3.5 text-rose-200" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isFreezeFrame ? t.resumeFeed : t.freezeFrame}</span>
            </button>
          )}
        </div>
      </div>

      {/* 
        ================================================================
        MAIN CONTENT: 75% CAMERA VIEW + 25% QUIZ VIEW
        (Arranged flex-col in Portrait, flex-row in Landscape)
        ================================================================
      */}
      <div className={`w-full flex-1 overflow-hidden ${orientationMode === 'landscape' ? 'flex flex-row' : 'flex flex-col'}`}>
        {/* 
          ----------------------------------------------------------------
          SECTION 1: CAMERA VIEWPORT (EXACTLY 75% OF SCREEN)
          ----------------------------------------------------------------
        */}
        <div
          className={`relative overflow-hidden bg-slate-950 ${
            orientationMode === 'landscape' ? 'w-[75%] h-full' : 'h-[75%] w-full'
          }`}
        >
          {/* Real Live Video Feed Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLiveCameraActive && !isFreezeFrame ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Frozen Frame Snapshot View */}
          {isFreezeFrame && frozenFrameData && (
            <img
              src={frozenFrameData}
              alt="Hazard freeze frame snapshot"
              className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-95"
            />
          )}

          {/* Simulated Mine Canvas when Camera is toggled off or unavailable (hidden when 3D AR is running) */}
          {!is3DFireMode && (!isLiveCameraActive || cameraStatus === 'denied' || cameraStatus === 'error') && !isFreezeFrame && (
            <div
              className="relative w-full h-full bg-slate-950 transition-transform duration-75 ease-out"
              style={{
                transform: `scale(1.06) translate(${virtualYaw * 1.5}px, ${virtualPitch * 1.5}px)`,
              }}
            >
              <svg className="w-full h-full object-cover opacity-90" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="tunnelVignette" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#262626" />
                    <stop offset="60%" stopColor="#171717" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </radialGradient>
                  <radialGradient id="fireGlow" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#dc2626" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="gasGlow" cx="50%" cy="50%" r="45%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#065f46" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="1000" height="700" fill="url(#tunnelVignette)" />

                {/* Steel Arch Tunnel Ribs */}
                <path d="M 120,700 L 180,240 Q 500,40 820,240 L 880,700" fill="none" stroke="#404040" strokeWidth="18" />
                <path d="M 240,700 L 290,300 Q 500,120 710,300 L 760,700" fill="none" stroke="#333333" strokeWidth="14" />
                <path d="M 360,700 L 400,360 Q 500,200 600,360 L 640,700" fill="none" stroke="#262626" strokeWidth="10" />

                {/* Haulage Rails */}
                <line x1="380" y1="700" x2="480" y2="400" stroke="#525252" strokeWidth="6" />
                <line x1="620" y1="700" x2="520" y2="400" stroke="#525252" strokeWidth="6" />

                {/* Module FX */}
                {activeModule.id === 'fire-safety' && (
                  <>
                    <circle cx="510" cy="390" r="220" fill="url(#fireGlow)" className="animate-pulse" />
                    <path d="M 480,440 Q 495,350 510,320 Q 530,370 545,390 Q 560,340 550,440 Z" fill="#ef4444" opacity="0.9" />
                  </>
                )}

                {activeModule.id === 'gas-safety' && (
                  <>
                    <ellipse cx="490" cy="430" rx="190" ry="110" fill="url(#gasGlow)" className="animate-pulse" />
                    <text x="490" y="440" fill="#34d399" fontSize="18" fontWeight="bold" textAnchor="middle" opacity="0.85">
                      TOXIC CH4 / CO VAPOR CLOUD
                    </text>
                  </>
                )}
              </svg>
            </div>
          )}

          {/* Real-time AR Canvas Overlay (SLAM Scanning Laser, Point Cloud, Reticle) */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

          {/* Tactical AR Top Scanning Telemetry Badge (hidden in 3D AR mode to keep 3D equipments fully visible) */}
          {!is3DFireMode && (
            <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-blue-300 backdrop-blur-md flex items-center gap-1">
                <Scan className="w-3 h-3 text-emerald-400" />
                <span>{t.cameraSplit75}</span>
              </span>

              {isMobile ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-700 text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-emerald-400 inline-block animate-pulse" />
                  <span>{t.backCameraOnly}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                  {t.backCameraActive}
                </span>
              )}

              <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                {t.areaMapped}: {areaMappedPercent}%
              </span>
            </div>
          )}

          {/* Low Light Warning Banner */}
          {!is3DFireMode && isLowLight && (
            <div className="absolute top-11 left-2.5 z-20 px-2.5 py-1 rounded-md bg-amber-950/90 border border-amber-800 text-[11px] font-medium text-amber-200 flex items-center gap-1.5 backdrop-blur-md">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.lowLightWarning}</span>
            </div>
          )}

          {/* 3D AR Burning Fire or 3D AR Gas Leak & Confined Space Simulation */}
          {is3DFireMode && (
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {activeModule.id === 'gas-safety' ? (
                <AR3DGasSimulation
                  language={language}
                  onDrillComplete={() => {
                    sfx.playSuccess();
                  }}
                />
              ) : (
                <AR3DFireSimulation
                  language={language}
                  onDrillComplete={() => {
                    sfx.playSuccess();
                  }}
                />
              )}
            </div>
          )}

          {/* Bottom Scanner Guidance Instruction (hidden in 3D AR mode for unobstructed visibility) */}
          {!is3DFireMode && (
            <div className="absolute bottom-2 left-3 right-3 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between backdrop-blur-md">
                <span className="truncate">{t.pointCameraInstruction}</span>
                <span className="font-mono text-[10px] text-blue-400 shrink-0 ml-2">75% VIEW</span>
              </div>
            </div>
          )}
        </div>

        {/* 
          ----------------------------------------------------------------
          SECTION 2: QUIZ & DECISION INTERFACE (EXACTLY 25% OF SCREEN)
          ----------------------------------------------------------------
        */}
        <div
          className={`bg-slate-900 border-slate-700 p-2.5 sm:p-3 text-slate-100 overflow-y-auto flex flex-col justify-between shadow-2xl z-30 ${
            orientationMode === 'landscape'
              ? 'w-[25%] h-full border-l'
              : 'h-[25%] w-full border-t'
          }`}
        >
          {/* Header & Question */}
          <div className="space-y-1 mb-1.5 shrink-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                {t.quizSplit25}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                DGMS § 114
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
              {scenario.question}
            </h3>
          </div>

          {/* Quiz Options / PPE Selector */}
          <div className="flex-1 my-1 overflow-y-auto">
            {scenario.interactiveType === 'ppe_selector' ? (
              <div className="space-y-1.5">
                <div
                  className={`grid gap-1.5 ${
                    orientationMode === 'portrait' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {scenario.options.map((opt) => {
                    const isChecked = selectedPPE.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`ppe-item-${opt.id}`}
                        disabled={isAnswerSubmitted}
                        onClick={() => togglePPEItem(opt.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-950 border-blue-400 text-white font-semibold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="truncate mr-2">{opt.text}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                            isChecked ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!isAnswerSubmitted && (
                  <button
                    type="button"
                    id="submit-ppe-selection-btn"
                    onClick={handlePPESubmit}
                    disabled={selectedPPE.length === 0}
                    className="w-full mt-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    {t.verifyPpe}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div
                  className={`grid gap-1.5 ${
                    orientationMode === 'portrait' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {scenario.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`scenario-option-${opt.id}`}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleOptionSelect(opt.id)}
                        className={`w-full p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-950 border-blue-400 text-white font-semibold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="truncate mr-2">{opt.text}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-xs bg-blue-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!isAnswerSubmitted && (
                  <button
                    type="button"
                    id="submit-scenario-answer-btn"
                    onClick={handleSubmitOption}
                    disabled={!selectedOptionId}
                    className="w-full mt-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    {t.submitAnswer}
                  </button>
                )}
              </div>
            )}

            {/* Answer Feedback Banner */}
            {isAnswerSubmitted && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-start gap-2">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-xs font-bold ${isAnswerCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isAnswerCorrect ? t.correctDecision : t.incorrectDecision}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      {feedbackText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-700">
                  {!isAnswerCorrect && (
                    <button
                      type="button"
                      id="retry-scenario-btn"
                      onClick={handleRetryScenario}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{t.tryAgain}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id="next-scenario-btn"
                    onClick={handleNextScenario}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      isAnswerCorrect ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <span>{isLastScenario ? t.finishSimulation : t.nextScenario}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
