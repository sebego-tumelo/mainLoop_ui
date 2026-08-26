import React, { useState } from 'react';
import { History, ArrowUpDown, Calendar, Award, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import { DrawResult, PredictionRecord, ViewTab, SortOrder } from '../types';
import { LottoBall } from './LottoBall';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

interface HistoricalRecordsPanelProps {
  draws: DrawResult[];
  predictions: PredictionRecord[];
  onSelectDraw?: (draw: DrawResult) => void;
}

export const HistoricalRecordsPanel: React.FC<HistoricalRecordsPanelProps> = ({
  draws,
  predictions,
}) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('draws');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [expandedPredId, setExpandedPredId] = useState<string | null>(null);

  // Toggle sort
  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'));
  };

  // Sorted items
  const sortedDraws = [...draws].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const sortedPredictions = [...predictions].sort((a, b) => {
    const timeA = new Date(a.targetDrawDate).getTime();
    const timeB = new Date(b.targetDrawDate).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <section
      id="panel-historical-records"
      className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-lg backdrop-blur-sm transition-all flex flex-col"
    >
      {/* Panel Title */}
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <History className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Panel 4: Historical Records
          </h2>
          <div className="text-[11px] font-mono text-zinc-500">
            Audit Archive & Draw Logs
          </div>
        </div>
      </div>

      {/* Header Controls: Segmented View Switch & Sort Button */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-zinc-950/60 p-1.5 rounded-xl border border-zinc-800">
        {/* Segmented View Toggle Switch */}
        <div id="segmented-tab-control" className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
          <button
            id="tab-draw-history"
            onClick={() => setActiveTab('draws')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'draws'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Draw History
          </button>
          <button
            id="tab-prediction-history"
            onClick={() => setActiveTab('predictions')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'predictions'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Prediction History
          </button>
        </div>

        {/* Sort Order Button */}
        <button
          id="btn-sort-records"
          onClick={toggleSort}
          className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors shrink-0"
        >
          <ArrowUpDown className="w-3 h-3 text-indigo-400" />
          <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
        </button>
      </div>

      {/* Scrollable Data List (capped with custom scrollbar) */}
      <div
        id="history-data-container"
        className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {activeTab === 'draws' ? (
          /* Draw History View */
          sortedDraws.map((draw) => (
            <div
              key={draw.id}
              id={`draw-record-${draw.date}`}
              className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-zinc-200">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{draw.date}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    #{draw.drawNumber}
                  </span>
                </div>

                <span className="text-xs font-mono text-amber-400 font-bold">
                  Pool: {formatZAR(draw.prizePool)}
                </span>
              </div>

              {/* 5 Balls */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 pt-0.5">
                {draw.winningNumbers.map((num) => (
                  <LottoBall
                    key={`hist-draw-${draw.id}-num-${num}`}
                    number={num}
                    size="sm"
                    variant="gold"
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Prediction History View */
          sortedPredictions.map((pred) => {
            const isExpanded = expandedPredId === pred.id;
            const isProfitable = pred.netProfit >= 0;

            return (
              <div
                key={pred.id}
                id={`prediction-record-${pred.id}`}
                className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-zinc-200">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{pred.targetDrawDate}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {pred.sets.length} Sets
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isProfitable
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {formatSignedZAR(pred.netProfit)}
                    </span>

                    <button
                      id={`btn-expand-pred-${pred.id}`}
                      onClick={() => setExpandedPredId(isExpanded ? null : pred.id)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800"
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Summary row */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>
                    Spent: <strong className="text-zinc-300">{formatZAR(pred.cost)}</strong> | Won:{' '}
                    <strong className="text-amber-400">{formatZAR(pred.totalWon)}</strong>
                  </span>
                  <span className="text-amber-400 font-bold">
                    {pred.topMatchCount > 0 ? `Best: Match ${pred.topMatchCount}` : 'No Match'}
                  </span>
                </div>

                {/* Expanded Sets Details */}
                {isExpanded && (
                  <div className="mt-1 pt-2 border-t border-zinc-800 space-y-2 animate-in fade-in duration-150">
                    {pred.sets.map((set, sIdx) => {
                      const matched = set.matchedNumbers || [];
                      return (
                        <div
                          key={`expanded-set-${set.id || sIdx}`}
                          className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold text-zinc-300">Set #{set.setNumber || sIdx + 1}</span>
                            <span className="text-indigo-400 font-bold">
                              {matched.length > 0
                                ? `${matched.length} Matched (${formatZAR(set.winAmount || 0)})`
                                : '0 Matches'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            {set.numbers.map((num) => (
                              <LottoBall
                                key={`expanded-num-${num}`}
                                number={num}
                                size="sm"
                                isMatched={matched.includes(num)}
                                variant="emerald"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
