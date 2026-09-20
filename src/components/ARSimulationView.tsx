import React, { useState, useEffect, useRef } from 'react';
import { TrainingModule, ARScenario, Language } from '../types';
import { translations } from '../data/translations';
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
  Users,
  HardHat,
  Eye,
  Crosshair,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { sfx } from '../utils/audio';

interface ARSimulationViewProps {
  module: TrainingModule;
  language: Language;
  onBackToDashboard: () => void;
  onCompleteSimulation: () => void;
}

export const ARSimulationView: React.FC<ARSimulationViewProps> = ({
  module,
  language,
  onBackToDashboard,
  onCompleteSimulation,
}) => {
  const t = translations[language];
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  
  // PPE Selector multi-selection state for Scenario 2 of Gas module
  const [selectedPPE, setSelectedPPE] = useState<string[]>([]);
  const [ppeSubmitted, setPpeSubmitted] = useState<boolean>(false);

  // Evacuation interactive route selection state
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Active marker inspected
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Camera & Gyro simulation states
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [virtualPitch, setVirtualPitch] = useState<number>(0);
  const [virtualYaw, setVirtualYaw] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scenario: ARScenario = module.scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === module.scenarios.length - 1;

  // Initialize camera attempt
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          });
          if (active && videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setIsLiveCameraActive(true);
            setCameraPermissionError(null);
          }
        } else {
          setIsLiveCameraActive(false);
        }
      } catch (err) {
        // Fallback gracefully to industrial simulated camera background
        console.warn('Live camera unavailable, using simulated industrial camera feed', err);
        setIsLiveCameraActive(false);
        setCameraPermissionError('Using Realistic Virtual Mine Simulation');
      }
    }

    setupCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Subtle simulated sensor drift/pan when dragging on canvas
  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      setVirtualYaw((prev) => Math.max(-25, Math.min(25, prev + e.movementX * 0.1)));
      setVirtualPitch((prev) => Math.max(-15, Math.min(15, prev + e.movementY * 0.1)));
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    sfx.playTargetLock();
    setSelectedOptionId(optionId);
  };

  const handleSubmitOption = () => {
    if (!selectedOptionId) return;

    const chosenOption = scenario.options.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(chosenOption.isCorrect);

    if (chosenOption.isCorrect) {
      sfx.playSuccess();
      setFeedbackText(
        chosenOption.feedback ||
          'Correct Action: DGMS emergency protocol verified. Safe operations maintained.'
      );
    } else {
      sfx.playWarning();
      setFeedbackText(
        chosenOption.feedback ||
          'Critical Warning: Non-compliant safety procedure. Risk of severe hazard escalation.'
      );
    }
  };

  // PPE Multi-select toggle
  const togglePPEItem = (ppeId: string) => {
    if (isAnswerSubmitted) return;
    sfx.playTargetLock();
    setSelectedPPE((prev) =>
      prev.includes(ppeId) ? prev.filter((id) => id !== ppeId) : [...prev, ppeId]
    );
  };

  const handlePPESubmit = () => {
    if (selectedPPE.length === 0) return;

    // Check if required PPEs are chosen and hazardous ones (like sandals) are excluded
    const hasDangerousItem = selectedPPE.includes('ppe-sandals');
    const hasCorePPE =
      selectedPPE.includes('ppe-helmet') &&
      selectedPPE.includes('ppe-boots') &&
      selectedPPE.includes('ppe-respirator');

    setIsAnswerSubmitted(true);

    if (!hasDangerousItem && hasCorePPE) {
      setIsAnswerCorrect(true);
      sfx.playSuccess();
      setFeedbackText(
        'Verified Complete PPE: Helmet, heavy mining safety boots, multi-gas respirator, and gloves selected. Open sandals strictly forbidden underground.'
      );
    } else {
      setIsAnswerCorrect(false);
      sfx.playWarning();
      setFeedbackText(
        hasDangerousItem
          ? 'CRITICAL DEFECT: Never wear open footwear/sandals in mining zones! Heavy puncture-resistant safety boots are legally mandatory under DGMS § 114.'
          : 'INCOMPLETE PPE: Must equip hard hat, safety boots, gas respirator, and gloves before entering suspected leak or confined space.'
      );
    }
  };

  const handleRetryScenario = () => {
    sfx.playTargetLock();
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);
    setFeedbackText('');
  };

  const handleNextScenario = () => {
    sfx.playSuccess();
    if (isLastScenario) {
      onCompleteSimulation();
    } else {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(false);
      setFeedbackText('');
      setSelectedPPE([]);
      setActiveMarkerId(null);
    }
  };

  const toggleCameraFeed = () => {
    sfx.playTargetLock();
    setIsLiveCameraActive((prev) => !prev);
  };

  return (
    <div
      className="relative w-full h-full min-h-[580px] sm:min-h-[640px] flex flex-col bg-slate-950 overflow-hidden rounded-2xl border border-slate-700 select-none shadow-xl"
      onPointerMove={handlePointerMove}
    >
      {/* 
        [ARCore Integration Hook]:
        In an Android native wrapper (e.g. Capacitor/TWA or native Kotlin ArFragment),
        this DOM layer acts as the UI HUD over the ArSceneView. 
      */}

      {/* Background: Live Camera Stream OR Simulated Underground Mining Environment */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {isLiveCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          /* Realistic Simulated Mine Canvas */
          <div
            className="relative w-full h-full bg-slate-950 transition-transform duration-75 ease-out"
            style={{
              transform: `scale(1.05) translate(${virtualYaw * 1.5}px, ${virtualPitch * 1.5}px)`,
            }}
          >
            {/* SVG Industrial Environment Backdrop */}
            <svg
              className="w-full h-full object-cover opacity-90"
              viewBox="0 0 1000 700"
              preserveAspectRatio="xMidYMid slice"
            >
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

              {/* Tunnel Wall Strata and Timber Supports */}
              <rect width="1000" height="700" fill="url(#tunnelVignette)" />

              {/* Steel Arch Tunnel Ribs */}
              <path
                d="M 120,700 L 180,240 Q 500,40 820,240 L 880,700"
                fill="none"
                stroke="#404040"
                strokeWidth="18"
              />
              <path
                d="M 240,700 L 290,300 Q 500,120 710,300 L 760,700"
                fill="none"
                stroke="#333333"
                strokeWidth="14"
              />
              <path
                d="M 360,700 L 400,360 Q 500,200 600,360 L 640,700"
                fill="none"
                stroke="#262626"
                strokeWidth="10"
              />

              {/* Underground Haulage Track / Rails */}
              <line x1="380" y1="700" x2="480" y2="400" stroke="#525252" strokeWidth="6" />
              <line x1="620" y1="700" x2="520" y2="400" stroke="#525252" strokeWidth="6" />
              {/* Rail sleepers */}
              <line x1="370" y1="670" x2="630" y2="670" stroke="#3f3f46" strokeWidth="7" />
              <line x1="410" y1="600" x2="590" y2="600" stroke="#3f3f46" strokeWidth="6" />
              <line x1="445" y1="530" x2="555" y2="530" stroke="#3f3f46" strokeWidth="5" />
              <line x1="470" y1="470" x2="530" y2="470" stroke="#3f3f46" strokeWidth="4" />

              {/* Conveyor Belt Framework on left */}
              <rect x="80" y="440" width="220" height="35" fill="#262626" stroke="#525252" strokeWidth="2" />
              <line x1="80" y1="475" x2="80" y2="700" stroke="#525252" strokeWidth="6" />
              <line x1="220" y1="475" x2="220" y2="700" stroke="#525252" strokeWidth="6" />

              {/* High Voltage Transformer panel on right */}
              <rect x="730" y="380" width="130" height="190" fill="#1c1917" stroke="#eab308" strokeWidth="3" />
              <circle cx="795" cy="420" r="14" fill="#dc2626" />
              <text x="795" y="460" fill="#facc15" fontSize="13" fontWeight="bold" textAnchor="middle">
                440V LIVE
              </text>

              {/* Specific Module Visual FX */}
              {module.id === 'fire-safety' && (
                <>
                  {/* Dynamic Fire Glow Layer */}
                  <circle cx="510" cy="390" r="220" fill="url(#fireGlow)" className="animate-pulse" />
                  {/* Flame silhouette */}
                  <path
                    d="M 480,440 Q 495,350 510,320 Q 530,370 545,390 Q 560,340 550,440 Z"
                    fill="#ef4444"
                    opacity="0.9"
                  />
                  <path
                    d="M 495,440 Q 510,370 520,340 Q 535,390 535,440 Z"
                    fill="#fbbf24"
                    opacity="0.95"
                  />
                </>
              )}

              {module.id === 'gas-safety' && (
                <>
                  {/* Gas Dispersion Cloud */}
                  <ellipse cx="490" cy="430" rx="190" ry="110" fill="url(#gasGlow)" className="animate-pulse" />
                  <text x="490" y="440" fill="#34d399" fontSize="18" fontWeight="bold" textAnchor="middle" opacity="0.85">
                    ☁️ TOXIC CH4 / CO VAPOR CLOUD
                  </text>
                </>
              )}
            </svg>
          </div>
        )}

        {/* Tactical AR Scanlines and Vignette */}
        <div className="absolute inset-0 ar-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* Top HUD Bar with Clean Blue / White Styling */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border-b border-slate-700/80">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="ar-back-btn"
            onClick={() => {
              sfx.playTargetLock();
              onBackToDashboard();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-200 cursor-pointer transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                {t.arTrainingMode}
              </span>
              <span className="text-[10px] text-blue-200 bg-blue-900/60 border border-blue-700 px-1.5 py-0.2 rounded font-mono">
                {currentScenarioIndex + 1}/{module.scenarios.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-xs font-medium">
              {scenario.title}
            </p>
          </div>
        </div>

        {/* Live Camera vs Simulation toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="toggle-camera-feed-btn"
            onClick={toggleCameraFeed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isLiveCameraActive
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isLiveCameraActive ? t.cameraLive : t.cameraSimulated}
            </span>
          </button>
        </div>
      </div>

      {/* AR HUD Instruction Banner (Clean Blue Accent) */}
      <div className="relative z-20 px-3.5 py-1.5 bg-blue-900/80 border-b border-blue-700/80 flex items-center justify-between text-[11px] text-blue-100 font-medium">
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 animate-spin text-blue-300" />
          <span>{t.pointCameraInstruction}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[10px]">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-400" />
            AZ 148° SE
          </span>
          <span>•</span>
          <span className="text-emerald-400">DEPTH 14.8m</span>
        </div>
      </div>

      {/* Center AR Reticle & Spatial Target Markers Area */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center p-3 pointer-events-auto">
        {/* Floating Reticle Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
          <div className="w-28 h-28 border border-blue-400/50 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 border border-dashed border-blue-400/60 rounded-full" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
          </div>
        </div>

        {/* Spatial Interactive AR Markers (Rendered over the environment) */}
        {scenario.markers.map((marker) => {
          const isInspected = activeMarkerId === marker.id;
          const isDanger = marker.type === 'danger';
          const isWarning = marker.type === 'warning';
          const isSafety = marker.type === 'safety';
          const isEquipment = marker.type === 'equipment';

          return (
            <div
              key={marker.id}
              className="absolute transition-all duration-300"
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                type="button"
                id={`ar-marker-${marker.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.playTargetLock();
                  setActiveMarkerId(isInspected ? null : marker.id);
                }}
                className={`group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110 active:scale-95`}
              >
                {/* Pulsing Radar Ring (Only Red/Orange for hazard markers) */}
                <span
                  className={`absolute -inset-2 rounded-full animate-ping opacity-70 ${
                    isDanger
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-orange-500'
                      : isSafety
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                />

                {/* Marker Pill Badge */}
                <div
                  className={`px-3 py-1.5 rounded-full border shadow-2xl flex items-center gap-1.5 text-xs font-bold backdrop-blur-md ${
                    isDanger
                      ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-500/40'
                      : isWarning
                      ? 'bg-orange-950/90 border-orange-500 text-orange-200 shadow-orange-500/40'
                      : isSafety
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-emerald-500/40'
                      : 'bg-blue-950/90 border-blue-400 text-blue-200 shadow-blue-500/40'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="tracking-wide whitespace-nowrap">{marker.label}</span>
                </div>

                {/* Connecting Pin Line */}
                <div
                  className={`w-0.5 h-6 ${
                    isDanger
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-orange-500'
                      : isSafety
                      ? 'bg-emerald-500'
                      : 'bg-blue-400'
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    isDanger
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-orange-500'
                      : isSafety
                      ? 'bg-emerald-500'
                      : 'bg-blue-400'
                  }`}
                />
              </button>

              {/* Marker Detailed Tooltip on Tap */}
              {isInspected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/95 border border-blue-400/60 rounded-xl shadow-2xl z-30 text-xs text-slate-100 backdrop-blur-md animate-in fade-in zoom-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
                    <span className="font-bold text-white">{marker.label}</span>
                    <button
                      type="button"
                      onClick={() => setActiveMarkerId(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {marker.description}
                  </p>
                  {marker.actionRequired && (
                    <div className="mt-2 pt-1.5 border-t border-slate-700 text-[10px] text-blue-300 font-semibold">
                      ACTION: {marker.actionRequired}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Interactive Decision Sheet / Modal Overlay (Clean Blue/White Controls) */}
      <div className="relative z-30 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-4 max-h-[52%] overflow-y-auto shadow-2xl text-slate-100">
        {/* Situation Prompt */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase">
              {scenario.subtitle}
            </span>
            <p className="text-[11px] text-slate-400 font-mono">
              DGMS Rule 1961 § 114
            </p>
          </div>
          <h3 className="text-sm font-bold text-white mt-1 tracking-wide">
            {scenario.question}
          </h3>
        </div>

        {/* Specialized Interactive View: PPE Selector (Scenario 2 of Gas Module) */}
        {scenario.interactiveType === 'ppe_selector' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenario.options.map((opt) => {
                const isChecked = selectedPPE.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`ppe-item-${opt.id}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => togglePPEItem(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/25 border-blue-400 text-white font-semibold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'border-slate-600'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span>{opt.text}</span>
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
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                VERIFY PPE SUITE INSPECTION
              </button>
            )}
          </div>
        ) : scenario.interactiveType === 'evacuation_map' ? (
          /* Tactical Evacuation Route Selection (Scenario 3 of Fire Module) */
          <div className="space-y-3">
            <div className="space-y-2">
              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`route-choice-${opt.id}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/25 border-blue-400 text-white font-semibold shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted && (
              <button
                type="button"
                id="submit-route-btn"
                onClick={handleSubmitOption}
                disabled={!selectedOptionId}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                CONFIRM EVACUATION HEADING
              </button>
            )}
          </div>
        ) : (
          /* Standard Multi-Choice AR Hazard Scenarios (Scenario 1 & 2) */
          <div className="space-y-2">
            <div className="space-y-1.5">
              {scenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    id={`scenario-option-${opt.id}`}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/25 border-blue-400 text-white font-semibold shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 ml-2" />
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
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/30"
              >
                {t.submitAnswer}
              </button>
            )}
          </div>
        )}

        {/* Feedback & Progression banner after selection */}
        {isAnswerSubmitted && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              {isAnswerCorrect ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              <div>
                <p
                  className={`text-xs font-bold ${
                    isAnswerCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isAnswerCorrect ? t.correctDecision : t.incorrectDecision}
                </p>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {feedbackText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
              {!isAnswerCorrect && (
                <button
                  type="button"
                  id="retry-scenario-btn"
                  onClick={handleRetryScenario}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.tryAgain}</span>
                </button>
              )}

              <button
                type="button"
                id="next-scenario-btn"
                onClick={handleNextScenario}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isAnswerCorrect
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <span>{isLastScenario ? t.finishSimulation : t.nextScenario}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
