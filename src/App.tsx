/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Zap, Coins, History, Dices, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { LatestDrawPanel } from './components/LatestDrawPanel';
import { CurrentPredictionPanel } from './components/CurrentPredictionPanel';
import { FinancialLedgerPanel } from './components/FinancialLedgerPanel';
import { HistoricalRecordsPanel } from './components/HistoricalRecordsPanel';
import { PredictModal } from './components/PredictModal';
import { SimulateDrawModal } from './components/SimulateDrawModal';
import { PrizeInfoModal } from './components/PrizeInfoModal';
import { DrawResult, PredictionRecord } from './types';
import {
  INITIAL_DRAWS,
  INITIAL_ACTIVE_PREDICTION,
  INITIAL_PREDICTION_HISTORY,
} from './data/mockData';
import { computeFinancialStats } from './utils/lottoEngine';

const STORAGE_KEY_DRAWS = 'daily_lotto_draws_v1';
const STORAGE_KEY_ACTIVE_PRED = 'daily_lotto_active_pred_v1';
const STORAGE_KEY_PRED_HISTORY = 'daily_lotto_pred_history_v1';

export default function App() {
  // State with LocalStorage fallbacks
  const [draws, setDraws] = useState<DrawResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAWS);
      return saved ? JSON.parse(saved) : INITIAL_DRAWS;
    } catch {
      return INITIAL_DRAWS;
    }
  });

  const [currentPrediction, setCurrentPrediction] = useState<PredictionRecord | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PRED);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_PREDICTION;
    } catch {
      return INITIAL_ACTIVE_PREDICTION;
    }
  });

  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRED_HISTORY);
      return saved ? JSON.parse(saved) : INITIAL_PREDICTION_HISTORY;
    } catch {
      return INITIAL_PREDICTION_HISTORY;
    }
  });

  // Modal visibility states
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAWS, JSON.stringify(draws));
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [draws]);

  useEffect(() => {
    try {
      if (currentPrediction) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_PRED, JSON.stringify(currentPrediction));
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_PRED);
      }
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [currentPrediction]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRED_HISTORY, JSON.stringify(predictionHistory));
    } catch (e) {
      console.error('Storage sync error', e);
    }
  }, [predictionHistory]);

  // Compute financial stats across all prediction sessions
  const financialStats = computeFinancialStats(predictionHistory, currentPrediction);

  // Latest draw is the first draw in the array
  const latestDraw = draws[0] || INITIAL_DRAWS[0];

  // Target draw date for next predictions
  const nextTargetDate = '2026-08-26';

  // Handle new prediction generated
  const handleSavePrediction = (newPred: PredictionRecord) => {
    setCurrentPrediction(newPred);
    // Also append to history list for audit tracking
    setPredictionHistory((prev) => [newPred, ...prev]);
  };

  // Handle simulated official draw
  const handleRecordDraw = (newDraw: DrawResult, updatedPred: PredictionRecord | null) => {
    setDraws((prev) => [newDraw, ...prev]);

    if (updatedPred) {
      setCurrentPrediction(updatedPred);
      setPredictionHistory((prev) =>
        prev.map((p) => (p.id === updatedPred.id ? updatedPred : p))
      );
    }
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (window.confirm('Reset all ledger data and draw logs to defaults?')) {
      setDraws(INITIAL_DRAWS);
      setCurrentPrediction(INITIAL_ACTIVE_PREDICTION);
      setPredictionHistory(INITIAL_PREDICTION_HISTORY);
      localStorage.removeItem(STORAGE_KEY_DRAWS);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_PRED);
      localStorage.removeItem(STORAGE_KEY_PRED_HISTORY);
    }
  };

  // Quick jump navigation helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center selection:bg-indigo-500 selection:text-white pb-20">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 -right-40 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Container Formatted to Mobile-First Width */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col flex-1 shadow-2xl border-x border-zinc-900/80 bg-zinc-950/60 min-h-screen">
        {/* Header */}
        <Header
          onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
          onResetData={handleResetData}
        />

        {/* Dashboard Main Scrollable Feed */}
        <main className="flex-1 p-4 space-y-4">
          {/* PANEL 1: LATEST DRAW RESULT */}
          <div id="section-latest-draw">
            <LatestDrawPanel latestDraw={latestDraw} />
          </div>

          {/* PANEL 2: CURRENT PREDICTION */}
          <div id="section-current-prediction">
            <CurrentPredictionPanel
              currentPrediction={currentPrediction}
              latestDraw={latestDraw}
              onOpenPredictModal={() => setIsPredictModalOpen(true)}
            />
          </div>

          {/* PANEL 3: FINANCIAL LEDGER */}
          <div id="section-financial-ledger">
            <FinancialLedgerPanel stats={financialStats} />
          </div>

          {/* PANEL 4: HISTORICAL RECORDS */}
          <div id="section-historical-records">
            <HistoricalRecordsPanel
              draws={draws}
              predictions={predictionHistory}
            />
          </div>
        </main>

        {/* Floating Mobile Bottom Navigation Bar (Inspired by smart mobile app layout) */}
        <nav
          id="mobile-bottom-nav"
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/60 rounded-2xl px-3 py-2 shadow-2xl shadow-zinc-950 flex items-center justify-around"
        >
          <button
            id="nav-btn-home"
            onClick={() => scrollToSection('section-latest-draw')}
            className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold">Result</span>
          </button>

          <button
            id="nav-btn-predict"
            onClick={() => setIsPredictModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-indigo-500/30 transition-transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Predict</span>
          </button>

          <button
            id="nav-btn-ledger"
            onClick={() => scrollToSection('section-financial-ledger')}
            className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <Coins className="w-4 h-4" />
            <span className="text-[10px] font-bold">Ledger</span>
          </button>

          <button
            id="nav-btn-history"
            onClick={() => scrollToSection('section-historical-records')}
            className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-indigo-400 transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="text-[10px] font-bold">History</span>
          </button>
        </nav>
      </div>

      {/* Interactive Modals */}
      <PredictModal
        isOpen={isPredictModalOpen}
        onClose={() => setIsPredictModalOpen(false)}
        onSavePrediction={handleSavePrediction}
        targetDrawDate={nextTargetDate}
      />

      <SimulateDrawModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        currentPrediction={currentPrediction}
        onRecordDraw={handleRecordDraw}
      />

      <PrizeInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
