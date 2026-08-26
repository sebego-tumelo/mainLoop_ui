import React from 'react';
import { Sparkles, RefreshCw, Dices, Info } from 'lucide-react';

interface HeaderProps {
  onOpenSimulateModal: () => void;
  onOpenInfoModal: () => void;
  onResetData: () => void;
  isSimulating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSimulateModal,
  onOpenInfoModal,
  onResetData,
  isSimulating = false,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-30 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Title Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black tracking-wider uppercase text-zinc-100 flex items-center gap-1.5 truncate">
              <span>Daily Lotto</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                AI STUDIO
              </span>
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>5/36 SA Daily Lotto • 21:00 SAST</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-simulate-draw-quick"
            onClick={onOpenSimulateModal}
            title="Simulate Today's Draw"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-indigo-400 border border-zinc-700/70 transition-colors shadow-sm active:scale-95"
          >
            <Dices className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-medium">Test Draw</span>
          </button>

          <button
            id="btn-open-rules-info"
            onClick={onOpenInfoModal}
            title="Prize Rules & Payout Matrix"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors active:scale-95"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            id="btn-reset-demo-data"
            onClick={onResetData}
            title="Reset Ledger & History Data"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
