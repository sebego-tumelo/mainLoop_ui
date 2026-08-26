import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Coins, Receipt, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { FinancialSummary } from '../types';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

interface FinancialLedgerPanelProps {
  stats: FinancialSummary;
}

export const FinancialLedgerPanel: React.FC<FinancialLedgerPanelProps> = ({ stats }) => {
  const isProfitable = stats.netProfit >= 0;

  return (
    <section
      id="panel-financial-ledger"
      className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-lg backdrop-blur-sm transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Coins className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Panel 3: Financial Ledger
            </h2>
            <div className="text-[11px] font-mono text-zinc-500">
              Real-time P&L Ledger (ZAR)
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-700/50">
          R3 / Board
        </span>
      </div>

      {/* 2x2 Financial Metrics Grid */}
      <div id="financial-metrics-2x2-grid" className="grid grid-cols-2 gap-2.5 my-2">
        {/* Metric 1: Current Draw Cost */}
        <div
          id="metric-current-draw-cost"
          className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="font-medium">Current Draw Cost</span>
            <Receipt className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black font-mono text-zinc-100 tracking-tight">
            {formatZAR(stats.currentDrawCost)}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
            3 boards × R3 standard
          </div>
        </div>

        {/* Metric 2: Lifetime Spent */}
        <div
          id="metric-lifetime-spent"
          className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="font-medium">Lifetime Spent</span>
            <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-xl font-black font-mono text-zinc-200 tracking-tight">
            {formatZAR(stats.lifetimeSpent)}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
            {stats.totalDrawsEvaluated} draws tracked
          </div>
        </div>

        {/* Metric 3: Lifetime Won */}
        <div
          id="metric-lifetime-won"
          className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="font-medium">Lifetime Won</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black font-mono text-amber-400 tracking-tight">
            {formatZAR(stats.lifetimeWon)}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
            {stats.winningDrawsCount} winning sessions
          </div>
        </div>

        {/* Metric 4: Net Profit / Loss & ROI */}
        <div
          id="metric-net-profit-roi"
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isProfitable
              ? 'bg-indigo-950/30 border-indigo-500/40 shadow-sm shadow-indigo-950/40'
              : 'bg-rose-950/30 border-rose-500/40 shadow-sm shadow-rose-950/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-300">Net Profit / Loss</span>
            {isProfitable ? (
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
          <div
            className={`text-xl font-black font-mono tracking-tight flex items-baseline gap-1 ${
              isProfitable ? 'text-indigo-400' : 'text-rose-400'
            }`}
          >
            <span>{formatSignedZAR(stats.netProfit)}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono mt-0.5">
            <span className="text-zinc-400">ROI:</span>
            <span
              className={`font-bold flex items-center ${
                isProfitable ? 'text-indigo-400' : 'text-rose-400'
              }`}
            >
              {isProfitable ? (
                <ArrowUpRight className="w-2.5 h-2.5 inline mr-0.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5 inline mr-0.5" />
              )}
              {stats.roiPercentage > 0 ? `+${stats.roiPercentage.toFixed(1)}%` : `${stats.roiPercentage.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer summary bar */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-1">
          <span className="text-zinc-500">Best Win:</span>
          <span className="font-bold text-amber-400">{formatZAR(stats.bestSingleWin)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-500">Win Rate:</span>
          <span className="font-bold text-indigo-400">
            {stats.totalDrawsEvaluated > 0
              ? `${Math.round((stats.winningDrawsCount / stats.totalDrawsEvaluated) * 100)}%`
              : '0%'}
          </span>
        </div>
      </div>
    </section>
  );
};
