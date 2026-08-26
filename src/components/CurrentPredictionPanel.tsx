import React from 'react';
import { Sparkles, Zap, Calendar, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { PredictionRecord, DrawResult } from '../types';
import { LottoBall } from './LottoBall';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

interface CurrentPredictionPanelProps {
  currentPrediction: PredictionRecord | null;
  latestDraw: DrawResult;
  onOpenPredictModal: () => void;
  onEvaluateCurrent?: () => void;
}

export const CurrentPredictionPanel: React.FC<CurrentPredictionPanelProps> = ({
  currentPrediction,
  latestDraw,
  onOpenPredictModal,
  onEvaluateCurrent,
}) => {
  const isEvaluated = currentPrediction?.status === 'evaluated';

  return (
    <section
      id="panel-current-prediction"
      className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-lg backdrop-blur-sm transition-all relative overflow-hidden"
    >
      {/* Subtle ambient accent gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/60 to-purple-500/0" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Panel 2: Current Prediction
            </h2>
            <div className="text-[11px] font-mono text-zinc-500">
              Target Draw: {currentPrediction ? currentPrediction.targetDrawDate : 'Upcoming Date'}
            </div>
          </div>
        </div>

        {currentPrediction ? (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isEvaluated
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            {isEvaluated ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                <span>Evaluated ({formatSignedZAR(currentPrediction.netProfit)})</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Active (3 Boards • R9)</span>
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            Empty
          </span>
        )}
      </div>

      {/* Content State: Empty State vs Active Prediction Boards */}
      {!currentPrediction || currentPrediction.sets.length === 0 ? (
        <div
          id="prediction-empty-state"
          className="my-3 py-6 px-4 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-zinc-300">
            No active prediction generated for the upcoming draw.
          </p>
          <p className="text-xs text-zinc-500 max-w-xs">
            Run the AI prediction engine to analyze past frequencies, hot/cold intervals, and generate 3 optimal boards.
          </p>
        </div>
      ) : (
        <div id="prediction-boards-list" className="space-y-2.5 my-3">
          {currentPrediction.sets.map((set, idx) => {
            const matchedNumbers = set.matchedNumbers || [];
            const hasMatches = matchedNumbers.length > 0;

            return (
              <div
                key={set.id || `set-${idx}`}
                id={`prediction-board-${idx + 1}`}
                className={`p-3 rounded-xl bg-zinc-950/70 border transition-all ${
                  hasMatches && isEvaluated
                    ? 'border-indigo-500/50 bg-indigo-950/20 shadow-sm shadow-indigo-950/50'
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-xs font-mono font-bold border border-zinc-700">
                      Set #{set.setNumber || idx + 1}
                    </span>
                    {set.confidenceScore && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        Conf: <span className="text-indigo-400 font-bold">{set.confidenceScore}%</span>
                      </span>
                    )}
                  </div>

                  {isEvaluated && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-md font-bold ${
                          (set.winAmount || 0) > 0
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50'
                        }`}
                      >
                        {matchedNumbers.length} Matches • {formatZAR(set.winAmount || 0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Numbers */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {set.numbers.map((num) => {
                    const isMatched = isEvaluated && latestDraw.winningNumbers.includes(num);
                    return (
                      <LottoBall
                        key={`set-${idx}-ball-${num}`}
                        number={num}
                        size="md"
                        isMatched={isMatched}
                        variant="emerald"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Primary Action CTA: Predict Next Draw */}
      <div className="mt-4 pt-1">
        <button
          id="btn-predict-next-draw"
          onClick={onOpenPredictModal}
          className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 fill-white text-white" />
          <span>⚡ Predict Next Draw</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-mono font-bold ml-1 text-white">
            3 Boards • R9
          </span>
        </button>
      </div>
    </section>
  );
};
