import React, { useState } from 'react';
import { X, Dices, Trophy, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DrawResult, PredictionRecord } from '../types';
import { LottoBall } from './LottoBall';
import { generateDivisions, evaluatePredictionSets, formatZAR, formatSignedZAR } from '../utils/lottoEngine';

interface SimulateDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrediction: PredictionRecord | null;
  onRecordDraw: (draw: DrawResult, updatedPrediction: PredictionRecord | null) => void;
}

export const SimulateDrawModal: React.FC<SimulateDrawModalProps> = ({
  isOpen,
  onClose,
  currentPrediction,
  onRecordDraw,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<{
    evaluatedSets: any[];
    totalWon: number;
    topMatch: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulateDraw = () => {
    setIsDrawing(true);
    setDrawnBalls([]);
    setEvaluationResult(null);

    // Pick 5 random unique numbers from 1 to 36
    const pool = Array.from({ length: 36 }, (_, i) => i + 1);
    const chosen: number[] = [];
    while (chosen.length < 5) {
      const idx = Math.floor(Math.random() * pool.length);
      chosen.push(pool.splice(idx, 1)[0]);
    }
    chosen.sort((a, b) => a - b);

    // Simulate balls dropping one by one
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDrawnBalls(chosen.slice(0, count));
      if (count >= 5) {
        clearInterval(interval);
        setIsDrawing(false);

        // Evaluate against current prediction if exists
        if (currentPrediction && currentPrediction.sets.length > 0) {
          const evalRes = evaluatePredictionSets(currentPrediction.sets, chosen);
          setEvaluationResult(evalRes);

          if (evalRes.totalWon > 0) {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
            });
          }
        }
      }
    }, 400);
  };

  const handleSaveAndApply = () => {
    if (drawnBalls.length < 5) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const prizePool = Math.floor(400000 + Math.random() * 150000);
    const newDraw: DrawResult = {
      id: `draw-${Date.now()}`,
      drawNumber: Math.floor(1985 + Math.random() * 50),
      date: todayStr,
      time: '21:00 SAST',
      winningNumbers: drawnBalls,
      prizePool,
      divisions: generateDivisions(drawnBalls, prizePool),
    };

    let updatedPred: PredictionRecord | null = null;
    if (currentPrediction && evaluationResult) {
      updatedPred = {
        ...currentPrediction,
        status: 'evaluated',
        evaluatedDrawId: newDraw.id,
        sets: evaluationResult.evaluatedSets,
        totalWon: evaluationResult.totalWon,
        netProfit: evaluationResult.totalWon - currentPrediction.cost,
        topMatchCount: evaluationResult.topMatch,
      };
    }

    onRecordDraw(newDraw, updatedPred);
    onClose();
  };

  return (
    <div
      id="modal-simulate-draw"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="simulate-draw-card"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-100">
                Official Draw Simulator
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Generate 5 random winning balls (1-36)
              </p>
            </div>
          </div>

          <button
            id="btn-close-simulate-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Draw Machine Chamber */}
        <div className="my-2 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center gap-3 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Draw Machine Extraction</span>
          </div>

          <div className="flex items-center justify-center gap-2 min-h-[56px]">
            {drawnBalls.length === 0 ? (
              <span className="text-xs text-zinc-500 font-mono py-2">
                Click below to start live ball extraction...
              </span>
            ) : (
              drawnBalls.map((num, i) => (
                <LottoBall
                  key={`drawn-ball-${num}-${i}`}
                  number={num}
                  size="lg"
                  variant="gold"
                  className="animate-in zoom-in-50 duration-300"
                />
              ))
            )}
          </div>
        </div>

        {/* Evaluation Output Preview */}
        {evaluationResult && currentPrediction && (
          <div className="my-2 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-zinc-300">Prediction Match Result</span>
              <span
                className={`px-2 py-0.5 rounded ${
                  evaluationResult.totalWon > 0
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {evaluationResult.topMatch > 0
                  ? `Best: Match ${evaluationResult.topMatch} (${formatZAR(evaluationResult.totalWon)})`
                  : '0 Matches'}
              </span>
            </div>

            <div className="text-[11px] font-mono flex items-center justify-between text-zinc-400 border-t border-zinc-800/80 pt-1.5">
              <span>Current Session P&L:</span>
              <span
                className={`font-bold ${
                  evaluationResult.totalWon >= currentPrediction.cost
                    ? 'text-indigo-400'
                    : 'text-rose-400'
                }`}
              >
                {formatSignedZAR(evaluationResult.totalWon - currentPrediction.cost)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 space-y-2">
          {drawnBalls.length < 5 ? (
            <button
              id="btn-trigger-draw-simulation"
              onClick={handleSimulateDraw}
              disabled={isDrawing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
            >
              <Dices className="w-4 h-4" />
              <span>{isDrawing ? 'Extracting Balls...' : '🎲 Spin & Extract Balls'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-spin-again"
                onClick={handleSimulateDraw}
                disabled={isDrawing}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider border border-zinc-700 transition-colors"
              >
                Spin Again
              </button>

              <button
                id="btn-apply-and-save-draw"
                onClick={handleSaveAndApply}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply to Ledger</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
