<script setup>
import { ref, watch } from 'vue';
import {
  Dices,
  Trophy,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import LottoBall from './LottoBall.vue';
import {
  evaluatePredictionSets,
  generateDivisions,
  formatZAR,
  formatSignedZAR,
} from '../utils/lottoEngine';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  currentPrediction: {
    type: Object,
    default: null,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onSimulateAndApplyDraw: {
    type: Function,
    required: true,
  },
});

const isDrawing = ref(false);
const drawnNumbers = ref([]);
const drawDate = ref('');
const prizePool = ref(475000);
const evaluationResult = ref(null);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      drawnNumbers.value = [];
      evaluationResult.value = null;
      isDrawing.value = false;
      const today = new Date().toISOString().split('T')[0];
      drawDate.value = props.currentPrediction?.targetDrawDate || today;
    }
  }
);

const handleSimulateDraw = () => {
  isDrawing.value = true;
  drawnNumbers.value = [];
  evaluationResult.value = null;

  // Generate 5 random unique numbers from 1 to 36
  const pool = Array.from({ length: 36 }, (_, i) => i + 1);
  const picked = [];

  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }

  // Animate ball draw sequence
  let count = 0;
  const interval = setInterval(() => {
    count++;
    drawnNumbers.value = picked.slice(0, count);

    if (count === 5) {
      clearInterval(interval);
      isDrawing.value = false;
      const sortedDrawn = [...picked].sort((a, b) => a - b);
      drawnNumbers.value = sortedDrawn;

      // Evaluate against current active prediction if available
      if (props.currentPrediction && props.currentPrediction.sets) {
        const evalRes = evaluatePredictionSets(
          props.currentPrediction.sets,
          sortedDrawn
        );
        evaluationResult.value = evalRes;

        if (evalRes.totalWon > 0) {
          try {
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#F6BD51', '#FFB59E', '#B7E1D2', '#D2CFF7'],
            });
          } catch {
            // Ignore if canvas error
          }
        }
      }
    }
  }, 350);
};

const handleSaveAndApply = () => {
  if (drawnNumbers.value.length < 5) return;

  const newDrawNumber = Math.floor(1985 + Math.random() * 50);
  const newDraw = {
    id: `draw-${Date.now()}`,
    drawNumber: newDrawNumber,
    date: drawDate.value,
    time: '21:00 SAST',
    winningNumbers: drawnNumbers.value,
    prizePool: prizePool.value,
    divisions: generateDivisions(drawnNumbers.value, prizePool.value),
  };

  let evaluatedPred = null;
  if (props.currentPrediction && evaluationResult.value) {
    evaluatedPred = {
      ...props.currentPrediction,
      status: 'evaluated',
      evaluatedDrawId: newDraw.id,
      sets: evaluationResult.value.evaluatedSets,
      totalWon: evaluationResult.value.totalWon,
      netProfit: evaluationResult.value.totalWon - props.currentPrediction.cost,
      topMatchCount: evaluationResult.value.topMatch,
    };
  }

  props.onSimulateAndApplyDraw(newDraw, evaluatedPred);
  props.onClose();
};
</script>

<template>
  <div
    v-if="isOpen"
    id="modal-simulate-draw"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
  >
    <div
      id="modal-simulate-container"
      class="w-full max-w-md bg-white border border-[#E7DFD5] rounded-3xl shadow-xl p-5 relative overflow-hidden flex flex-col max-h-[90vh] text-[#2C211C]"
    >
      <div class="flex items-center justify-between pb-3 border-b border-[#E7DFD5] mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center text-[#2C211C]">
            <Dices class="w-4 h-4 text-[#F6BD51]" />
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-[#2C211C]">
              OFFICIAL DRAW SIMULATOR
            </h3>
            <p class="text-[10px] text-[#786C65] font-semibold">
              Live 21:00 SAST Winning Ball Chamber
            </p>
          </div>
        </div>

        <button
          id="btn-close-simulate-modal"
          @click="onClose"
          class="p-1 rounded-full text-[#786C65] hover:text-[#2C211C] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3.5 my-1">
        <!-- Chamber Simulation Stage -->
        <div class="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
          <div class="text-[10px] uppercase font-extrabold tracking-wider text-[#786C65] mb-3 flex items-center gap-1.5">
            <Trophy class="w-3.5 h-3.5 text-[#F6BD51]" />
            <span>Random Mechanical Ball Extraction</span>
          </div>

          <!-- Ball extraction slots -->
          <div class="flex items-center justify-center gap-2 min-h-[50px]">
            <template v-if="drawnNumbers.length === 0 && !isDrawing">
              <span class="text-xs text-[#786C65] italic">
                Press button below to extract 5 winning numbers
              </span>
            </template>
            <template v-else>
              <LottoBall
                v-for="(num, idx) in drawnNumbers"
                :key="`sim-draw-ball-${idx}-${num}`"
                :number="num"
                size="md"
                variant="gold"
              />
              <div
                v-for="idx in Math.max(0, 5 - drawnNumbers.length)"
                :key="`placeholder-slot-${idx}`"
                class="w-10 h-10 rounded-full border border-dashed border-[#D5C6B5] flex items-center justify-center text-[#786C65] font-bold text-xs bg-white animate-pulse"
              >
                ?
              </div>
            </template>
          </div>

          <div v-if="isDrawing" class="mt-3 text-[11px] font-bold text-[#E0694B] animate-pulse">
            Extracting ball {{ drawnNumbers.length + 1 }} of 5...
          </div>
        </div>

        <!-- Evaluation Outcome if prediction exists -->
        <div
          v-if="evaluationResult && currentPrediction"
          id="simulation-evaluation-summary"
          class="p-3 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-1.5 text-xs font-semibold"
        >
          <div class="flex items-center justify-between text-[#786C65]">
            <span>Prediction Sets Evaluated:</span>
            <span class="font-black text-[#2C211C]">{{ currentPrediction.sets.length }} Boards</span>
          </div>
          <div class="flex items-center justify-between text-[#786C65]">
            <span>Total Payout Won:</span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full font-black border',
                evaluationResult.totalWon > 0
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : 'bg-white text-[#786C65] border-[#E7DFD5]'
              ]"
            >
              {{ formatZAR(evaluationResult.totalWon) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-[#786C65] pt-1.5 border-t border-[#EADBCC]">
            <span>Net Session Result:</span>
            <span
              :class="[
                'font-black',
                evaluationResult.totalWon >= currentPrediction.cost
                  ? 'text-[#2E7D32]'
                  : 'text-[#C62828]'
              ]"
            >
              {{ formatSignedZAR(evaluationResult.totalWon - currentPrediction.cost) }}
            </span>
          </div>
        </div>

        <!-- Warning if no current active prediction -->
        <div
          v-if="!currentPrediction"
          class="p-2.5 rounded-2xl bg-[#FFF3D9] border border-[#F6BD51] text-[#784A0E] text-[11px] font-semibold flex items-center gap-2"
        >
          <AlertCircle class="w-4 h-4 shrink-0 text-[#F6BD51]" />
          <span>Note: No active prediction. This will register as a standalone official draw.</span>
        </div>

        <!-- Controls -->
        <div class="space-y-2 pt-1">
          <button
            id="btn-trigger-draw-simulation"
            @click="handleSimulateDraw"
            :disabled="isDrawing"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-150 active:scale-98 disabled:opacity-50 border border-[#E5A836] cursor-pointer"
          >
            <Dices class="w-4 h-4" />
            <span>{{ isDrawing ? 'Extracting Balls...' : '🎲 Spin & Extract 5 Balls' }}</span>
          </button>

          <div v-if="drawnNumbers.length === 5 && !isDrawing" class="grid grid-cols-2 gap-2">
            <button
              id="btn-reset-simulation"
              @click="handleSimulateDraw"
              class="py-2.5 px-3 rounded-full bg-[#FAF5EE] hover:bg-[#F4EFE6] text-[#2C211C] font-bold text-xs uppercase tracking-wide transition-colors border border-[#E7DFD5] cursor-pointer"
            >
              Re-spin
            </button>

            <button
              id="btn-apply-and-save-draw"
              @click="handleSaveAndApply"
              class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#2C211C] hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 class="w-4 h-4 text-[#F6BD51]" />
              <span>Apply to Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

