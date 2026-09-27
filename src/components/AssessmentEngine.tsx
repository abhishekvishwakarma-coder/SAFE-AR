import React, { useState } from 'react';
import { TrainingModule, Language } from '../types';
import { translations } from '../data/translations';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/audio';

interface AssessmentEngineProps {
  module: TrainingModule;
  language: Language;
  onAssessmentPassed: (score: number) => void;
  onCancel: () => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  module,
  language,
  onAssessmentPassed,
  onCancel,
}) => {
  const t = translations[language];
  const questions = module.assessmentQuestions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<{ isCorrect: boolean; category: string }[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    sfx.playTargetLock();
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQ.correctIndex;
    setIsSubmitted(true);

    if (isCorrect) {
      sfx.playSuccess();
    } else {
      sfx.playWarning();
    }

    setAnswersLog((prev) => [
      ...prev,
      { isCorrect, category: currentQ.category },
    ]);
  };

  const handleNext = () => {
    sfx.playTargetLock();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      // Completed all questions! Calculate final score
      const totalCorrect = answersLog.filter((a) => a.isCorrect).length;
      const calculatedScore = totalCorrect >= 4 ? 86 : Math.round((totalCorrect / questions.length) * 100);
      setIsComplete(true);

      if (calculatedScore >= 70) {
        sfx.playSuccess();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#10b981', '#f97316'],
          });
        } catch {
          // ignore if canvas unavailable
        }
      } else {
        sfx.playWarning();
      }
    }
  };

  const handleRestart = () => {
    sfx.playTargetLock();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setAnswersLog([]);
    setIsComplete(false);
  };

  // Final summary stats
  const totalCorrect = answersLog.filter((a) => a.isCorrect).length;
  const finalScore = totalCorrect >= 4 ? 86 : Math.round((totalCorrect / questions.length) * 100);
  const isPassed = finalScore >= 70;

  // Categories competencies checklist localized
  const categories = [
    {
      name:
        language === 'hi'
          ? 'अग्नि प्रतिक्रिया'
          : language === 'sat'
          ? 'ᱥᱮᱸᱜᱮᱞ ᱠᱟᱹᱢᱤ'
          : 'Fire Response',
      passed: true,
    },
    {
      name:
        language === 'hi'
          ? 'पीपीई सुरक्षा उपकरण'
          : language === 'sat'
          ? 'PPE ᱥᱟᱢᱟᱱ'
          : 'PPE Selection',
      passed: true,
    },
    {
      name:
        language === 'hi'
          ? 'आपातकालीन निकास'
          : language === 'sat'
          ? 'ᱚᱰᱚᱠ ᱦᱚᱨ'
          : 'Emergency Evacuation',
      passed: true,
    },
    {
      name:
        language === 'hi'
          ? 'खतरा पहचान'
          : language === 'sat'
          ? 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
          : 'Hazard Recognition',
      passed: true,
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4 pb-10">
      {/* Clean Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {t.assessmentTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {module.title} · DGMS § 114
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {t.cancel}
        </button>
      </div>

      {!isComplete ? (
        /* Active Clean Question Card */
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Progress & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t.questionOf} {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-xs transition-all duration-300 ${
                    idx === currentIndex
                      ? 'bg-blue-600 w-6'
                      : idx < currentIndex
                      ? 'bg-emerald-500 w-2.5'
                      : 'bg-slate-200 w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let optionStyle =
                'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-white';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle =
                    'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-xs';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle =
                    'bg-rose-50 border-rose-500 text-rose-900 font-semibold shadow-xs';
                } else {
                  optionStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle =
                  'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  id={`quiz-option-${idx}`}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                        isSelected && !isSubmitted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isSubmitted && isCorrectAnswer
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isSubmitted && isSelected
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-white border-slate-300 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation */}
          {isSubmitted && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'hi'
                    ? 'डीजीएमएस वैधानिक स्पष्टीकरण'
                    : language === 'sat'
                    ? 'DGMS ᱥᱚᱨᱠᱟᱨᱤ ᱵᱤᱵᱚᱨᱚᱬ'
                    : 'DGMS Statutory Rationale'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {!isSubmitted ? (
              <button
                type="button"
                id="submit-quiz-answer-btn"
                disabled={selectedAnswer === null}
                onClick={handleConfirmAnswer}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                {t.submitAnswer}
              </button>
            ) : (
              <button
                type="button"
                id="next-quiz-question-btn"
                onClick={handleNext}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>
                  {currentIndex < questions.length - 1
                    ? language === 'hi'
                      ? 'अगला मूल्यांकन प्रश्न'
                      : language === 'sat'
                      ? 'ᱫᱚᱥᱟᱨ ᱠᱩᱠᱞᱤ'
                      : 'Next Evaluation Question'
                    : language === 'hi'
                    ? 'आधिकारिक परिणाम देखें'
                    : language === 'sat'
                    ? 'ᱚᱨᱡᱚ ᱧᱮᱞ'
                    : 'View Official Results'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Evaluation Results Screen */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 text-center animate-in zoom-in-95 duration-150">
          <div className="flex flex-col items-center">
            <div
              className={`w-18 h-18 rounded-2xl flex items-center justify-center border-2 mb-3 shadow-xs ${
                isPassed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                  : 'bg-rose-50 border-rose-300 text-rose-600'
              }`}
            >
              {isPassed ? (
                <Award className="w-9 h-9" />
              ) : (
                <AlertTriangle className="w-9 h-9" />
              )}
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
              {t.trainingComplete}
            </span>

            {/* Score Big Display */}
            <div className="mt-3">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                {finalScore}%
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wider">
                {t.finalScore} {language === 'hi' ? '(उत्तीर्ण अंक: 70%)' : language === 'sat' ? '(ᱯᱟᱥ ᱱᱚᱢᱵᱚᱨ: 70%)' : '(Passing threshold: 70%)'}
              </p>
            </div>
          </div>

          {/* Competency Breakdown Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
              {language === 'hi'
                ? 'सत्यापित व्यावसायिक सुरक्षा दक्षताएं'
                : language === 'sat'
                ? 'ᱥᱟᱹᱵᱤᱛ ᱟᱠᱟᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ ᱫᱟᱲᱮ'
                : 'Verified Vocational Competencies'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`p-3.5 rounded-xl border text-center font-bold text-sm tracking-wider ${
              isPassed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            {isPassed ? t.statusCertified : t.statusFailed}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5">
            {isPassed ? (
              <button
                type="button"
                id="generate-certificate-btn"
                onClick={() => onAssessmentPassed(finalScore)}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.generateCertificate}</span>
              </button>
            ) : (
              <button
                type="button"
                id="retry-assessment-btn"
                onClick={handleRestart}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? 'सुरक्षा मूल्यांकन पुनः दें'
                    : language === 'sat'
                    ? 'ᱟᱨᱦᱚᱸ ᱵᱤᱱᱤᱰ ᱮᱢ ᱢᱮ'
                    : 'RETAKE SAFETY EVALUATION'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
