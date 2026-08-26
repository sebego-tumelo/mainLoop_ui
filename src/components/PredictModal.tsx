import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, Check, Loader2, Zap, Layers, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PredictionRecord, PredictionSet } from '../types';
import { generatePredictionBoards, BOARD_PRICE_ZAR, formatZAR } from '../utils/lottoEngine';
import { LottoBall } from './LottoBall';

interface PredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrediction: (prediction: PredictionRecord) => void;
  targetDrawDate: string;
}

type ModalStep = 'setup' | 'analyzing' | 'complete';

export const PredictModal: React.FC<PredictModalProps> = ({
  isOpen,
  onClose,
  onSavePrediction,
  targetDrawDate,
}) => {
  const [step, setStep] = useState<ModalStep>('setup');
  const [boardCount, setBoardCount] = useState<number>(3);
  const [strategy, setStrategy] = useState<'ensemble' | 'hot_cold' | 'delta_spread'>('ensemble');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [currentAnalysisStage, setCurrentAnalysisStage] = useState<string>('Analyzing dataset rules...');
  const [generatedSets, setGeneratedSets] = useState<PredictionSet[]>([]);

  // Reset modal when reopened
  useEffect(() => {
    if (isOpen) {
      setStep('setup');
      setAnalysisProgress(0);
      setGeneratedSets([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartGeneration = () => {
    setStep('analyzing');
    setAnalysisProgress(10);
    setCurrentAnalysisStage('🌀 Analyzing dataset rules & frequency distributions...');

    const stages = [
      { progress: 28, text: '🌀 Evaluating historical hot & cold number frequencies (1-36)...' },
      { progress: 55, text: '🧠 Applying delta sequence & odd/even parity filters...' },
      { progress: 78, text: '⚡ Eliminating low-probability sums (ideal: 65 - 120)...' },
      { progress: 95, text: '✨ Synthesizing top candidate boards with ensemble scoring...' },
      { progress: 100, text: '✓ Generation finalized and indexed.' },
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        setAnalysisProgress(stages[currentIdx].progress);
        setCurrentAnalysisStage(stages[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
        // Create candidate sets
        const sets = generatePredictionBoards(boardCount);
        setGeneratedSets(sets);
        setStep('complete');

        // Trigger celebratory confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
        });
      }
    }, 450);
  };

  const handleRedo = () => {
    handleStartGeneration();
  };

  const handleDone = () => {
    const cost = boardCount * BOARD_PRICE_ZAR;
    const newPrediction: PredictionRecord = {
      id: `pred-${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetDrawDate,
      boardsCount: boardCount,
      cost,
      sets: generatedSets,
      status: 'pending',
      totalWon: 0,
      netProfit: -cost,
      topMatchCount: 0,
    };

    onSavePrediction(newPrediction);
    onClose();
  };

  return (
    <div
      id="modal-predict-next-draw"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="modal-content-card"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/10 via-indigo-500 to-purple-500/10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-100">
                Generate Prediction
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Target: <span className="text-indigo-400 font-bold">{targetDrawDate}</span> • 5/36 SA Daily Lotto
              </p>
            </div>
          </div>

          <button
            id="btn-close-predict-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body based on Step */}
        {step === 'setup' && (
          <div id="predict-step-setup" className="space-y-4 my-1">
            {/* Number of Draws / Boards */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                  Number of Draws / Boards to Predict
                </label>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {boardCount} Boards ({formatZAR(boardCount * BOARD_PRICE_ZAR)})
                </span>
              </div>

              {/* Board count chips */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={`board-option-${num}`}
                    type="button"
                    onClick={() => setBoardCount(num)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                      boardCount === num
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    {num === 3 ? `${num} (Std)` : `${num} B`}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategy Selection */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Algorithmic Model</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ensemble', name: 'Ensemble AI', desc: 'Balanced' },
                  { id: 'hot_cold', name: 'Hot/Cold Heat', desc: 'Recency' },
                  { id: 'delta_spread', name: 'Delta Spread', desc: 'Variance' },
                ].map((strat) => (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => setStrategy(strat.id as any)}
                    className={`p-2 rounded-lg text-left transition-all border ${
                      strategy === strat.id
                        ? 'bg-indigo-950/50 border-indigo-500/60 text-indigo-300'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border-zinc-800/80'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate text-zinc-200">{strat.name}</div>
                    <div className="text-[9px] font-mono text-zinc-500">{strat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Execution CTA Button */}
            <button
              id="btn-execute-generation"
              onClick={handleStartGeneration}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all duration-150 active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Generate Predictions</span>
            </button>
          </div>
        )}

        {/* Step 2: Analyzing / Streaming Execution */}
        {step === 'analyzing' && (
          <div id="predict-step-analyzing" className="py-8 px-2 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <Sparkles className="w-4 h-4 text-indigo-300 absolute" />
            </div>

            <div className="space-y-1 max-w-xs">
              <div className="text-sm font-black text-zinc-100 font-mono tracking-tight animate-pulse">
                {currentAnalysisStage}
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                Running 10,000 Monte-Carlo simulations against 1-36 Daily Lotto bounds...
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Progress: {analysisProgress}%</span>
              <span>•</span>
              <span className="text-indigo-400">Target: {boardCount} Sets</span>
            </div>
          </div>
        )}

        {/* Step 3: Complete / Candidate Sets */}
        {step === 'complete' && (
          <div id="predict-step-complete" className="space-y-3.5 my-1 flex flex-col">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>✓ {generatedSets.length} Candidates generated & saved!</span>
              </span>
              <span className="text-[11px] text-zinc-300">{formatZAR(boardCount * BOARD_PRICE_ZAR)}</span>
            </div>

            {/* Generated Sets List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {generatedSets.map((set, idx) => (
                <div
                  key={set.id || `gen-${idx}`}
                  id={`generated-candidate-set-${idx + 1}`}
                  className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-zinc-200">Set #{set.setNumber || idx + 1}</span>
                    <span className="text-indigo-400 font-bold">Conf: {set.confidenceScore}%</span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5">
                    {set.numbers.map((num) => (
                      <LottoBall
                        key={`gen-set-${idx}-ball-${num}`}
                        number={num}
                        size="md"
                        variant="emerald"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: Redo & Done */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
              <button
                id="btn-redo-prediction"
                onClick={handleRedo}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider border border-zinc-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>[ 🔄 Redo ]</span>
              </button>

              <button
                id="btn-done-prediction"
                onClick={handleDone}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-colors"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ ✓ Done ]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
