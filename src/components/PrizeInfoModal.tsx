import React from 'react';
import { X, ShieldCheck, HelpCircle, Coins, Award } from 'lucide-react';
import { formatZAR } from '../utils/lottoEngine';

interface PrizeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrizeInfoModal: React.FC<PrizeInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-prize-info"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="prize-info-card"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-100">
                Daily Lotto Guide & Payouts
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Game Matrix: 5 from 36 • Draw Daily 21:00
              </p>
            </div>
          </div>

          <button
            id="btn-close-prize-info"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto pr-1 text-xs text-zinc-300 font-sans">
          {/* Cost Rules */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1.5">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ticket Cost & Strategy Structure</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Each individual board costs <strong className="text-zinc-200">R3.00</strong>.
              A standard AI recommendation session plays <strong className="text-indigo-400">3 boards (R9.00 total)</strong> to maximize combinatoric delta coverage.
            </p>
          </div>

          {/* Division Matrix */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Prize Divisions & Pool Distribution</span>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                <span>Match 5 (Division 1)</span>
                <span className="text-amber-400 font-bold">35.6% (~R350,000+)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                <span>Match 4 (Division 2)</span>
                <span className="text-indigo-400 font-bold">33.7% (~R420)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                <span>Match 3 (Division 3)</span>
                <span className="text-indigo-400 font-bold">21.4% (~R22)</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-300">
                <span>Match 2 (Division 4)</span>
                <span className="text-indigo-400 font-bold">9.3% (~R6)</span>
              </div>
            </div>
          </div>

          {/* AI Methodology */}
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1 text-[11px] text-zinc-400 leading-relaxed">
            <div className="font-bold text-zinc-200">Algorithmic Filters:</div>
            <ul className="list-disc pl-4 space-y-0.5 text-zinc-400">
              <li>Frequency Recency Score (Hot/Cold distribution)</li>
              <li>Delta Interval & Even/Odd parity balance</li>
              <li>Gaussian sum range optimization (65 - 120)</li>
              <li>High-entropy board dispersion</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-zinc-800">
          <button
            id="btn-close-info-ok"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
