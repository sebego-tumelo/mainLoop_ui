import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { DrawResult } from '../types';
import { LottoBall } from './LottoBall';
import { formatZAR } from '../utils/lottoEngine';

interface LatestDrawPanelProps {
  latestDraw: DrawResult;
}

export const LatestDrawPanel: React.FC<LatestDrawPanelProps> = ({ latestDraw }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section
      id="panel-latest-draw"
      className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-lg backdrop-blur-sm transition-all"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Panel 1: Latest Draw Result
            </h2>
            <div className="text-[11px] font-mono text-zinc-500">
              Draw #{latestDraw.drawNumber} • {latestDraw.time}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Latest Result
          </span>
          <div className="flex items-center gap-1 text-xs font-mono text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-700/50">
            <Calendar className="w-3 h-3 text-zinc-400" />
            <span>{latestDraw.date}</span>
          </div>
        </div>
      </div>

      {/* Winning Numbers Lottery Balls Display */}
      <div className="my-3 py-3 px-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col items-center justify-center">
        <div className="text-[11px] uppercase font-mono tracking-widest text-zinc-400 mb-2.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Official Winning Combination</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {latestDraw.winningNumbers.map((num, idx) => (
            <LottoBall
              key={`${latestDraw.id}-ball-${num}-${idx}`}
              number={num}
              size="lg"
              variant="gold"
            />
          ))}
        </div>

        <div className="mt-2.5 flex items-center justify-between w-full text-[11px] text-zinc-400 px-1 border-t border-zinc-800/50 pt-2 font-mono">
          <span>Est. Prize Pool:</span>
          <span className="font-bold text-amber-400">{formatZAR(latestDraw.prizePool)}</span>
        </div>
      </div>

      {/* Collapsible Prize Divisions Dropdown Toggle */}
      <button
        id="btn-toggle-prize-divisions"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-indigo-300 border border-zinc-700/60 transition-colors duration-150"
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          {isDropdownOpen ? 'Hide Prize Divisions & Payouts' : '[▼] Show Prize Divisions & Payouts'}
        </span>
        {isDropdownOpen ? (
          <ChevronUp className="w-4 h-4 text-indigo-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* Collapsible Prize Table Breakdown */}
      {isDropdownOpen && (
        <div
          id="prize-divisions-breakdown"
          className="mt-2 rounded-xl bg-zinc-950/80 border border-zinc-800 p-2.5 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="grid grid-cols-4 text-[10px] uppercase font-mono tracking-wider text-zinc-500 px-2 py-1 border-b border-zinc-800">
            <span>Division</span>
            <span className="text-center">Pool %</span>
            <span className="text-center">Winners</span>
            <span className="text-right">Est. Payout</span>
          </div>

          {latestDraw.divisions.map((div) => (
            <div
              key={div.label}
              className="grid grid-cols-4 items-center text-xs px-2 py-1.5 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
            >
              <div className="font-semibold text-zinc-200 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Match {div.match}</span>
              </div>
              <div className="text-center text-[11px] font-mono text-zinc-400">
                {div.percentage}
              </div>
              <div className="text-center text-[11px] font-mono text-zinc-300">
                {div.winners.toLocaleString()}
              </div>
              <div className="text-right font-mono font-bold text-amber-400">
                {formatZAR(div.payout)}
              </div>
            </div>
          ))}

          <div className="pt-1.5 px-2 text-[10px] text-zinc-500 text-center font-mono">
            Daily Lotto Guaranteed Payouts • Rule 11.2 NLCSA Standard
          </div>
        </div>
      )}
    </section>
  );
};
