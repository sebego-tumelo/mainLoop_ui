<script setup>
import { ref, watch } from 'vue';
import {
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Cpu,
  Loader2,
  X,
  CheckCircle2,
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import LottoBall from './LottoBall.vue';
import {
  BOARD_PRICE_ZAR,
  generatePredictionBoards,
  generateCandidateSet,
  formatZAR,
} from '../utils/lottoEngine';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  targetDrawDate: {
    type: String,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onSavePrediction: {
    type: Function,
    required: true,
  },
});

const step = ref('config'); // 'config' | 'analyzing' | 'complete'
const boardCount = ref(3);
const strategy = ref('balanced');
const analysisProgress = ref(0);
const analysisMessage = ref('Initializing historical pattern engine...');
const generatedSets = ref([]);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      step.value = 'config';
      analysisProgress.value = 0;
      generatedSets.value = [];
    }
  }
);

const handleStartGeneration = () => {
  step.value = 'analyzing';
  analysisProgress.value = 10;
  analysisMessage.value = 'Scanning 5/36 frequency matrix & hot numbers...';

  const t1 = setTimeout(() => {
    analysisProgress.value = 45;
    analysisMessage.value = 'Calculating combinatoric delta & odd/even balance...';
  }, 450);

  const t2 = setTimeout(() => {
    analysisProgress.value = 80;
    analysisMessage.value = 'Optimizing 3-board synergy to maximize coverage...';
  }, 950);

  const t3 = setTimeout(() => {
    analysisProgress.value = 100;
    analysisMessage.value = 'Prediction complete!';

    // Generate real candidate boards
    const sets = generatePredictionBoards(boardCount.value);
    generatedSets.value = sets;
    step.value = 'complete';

    // Celebration confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#F6BD51', '#FFB59E', '#B7E1D2', '#D2CFF7'],
      });
    } catch {
      // Ignore if canvas unavailable
    }
  }, 1450);
};

const handleRegenerateSingleSet = (setIdx) => {
  const newSet = generateCandidateSet(setIdx + 1, strategy.value);
  const updated = [...generatedSets.value];
  updated[setIdx] = newSet;
  generatedSets.value = updated;
};

const handleDone = () => {
  const newPredictionRecord = {
    id: `pred-${Date.now()}`,
    createdAt: new Date().toISOString(),
    targetDrawDate: props.targetDrawDate,
    boardsCount: boardCount.value,
    cost: boardCount.value * BOARD_PRICE_ZAR,
    sets: generatedSets.value,
    status: 'pending',
    totalWon: 0,
    netProfit: -(boardCount.value * BOARD_PRICE_ZAR),
    topMatchCount: 0,
  };

  props.onSavePrediction(newPredictionRecord);
  props.onClose();
  step.value = 'config';
};

const handleCloseModal = () => {
  props.onClose();
  step.value = 'config';
};
</script>

<template>
  <div
    v-if="isOpen"
    id="modal-predict-next-draw"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
  >
    <div
      id="modal-predict-container"
      class="w-full max-w-md bg-white border border-[#E7DFD5] rounded-3xl shadow-xl p-5 relative overflow-hidden flex flex-col max-h-[90vh] text-[#2C211C]"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-[#E7DFD5] mb-3.5">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center text-[#2C211C]">
            <Sparkles class="w-4 h-4 text-[#F6BD51]" />
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-[#2C211C]">
              AI PREDICTION GENERATOR
            </h3>
            <p class="text-[10px] text-[#786C65] font-semibold">
              Target: <span class="text-[#2C211C] font-black">{{ targetDrawDate }}</span> • 5/36 SA Daily Lotto
            </p>
          </div>
        </div>

        <button
          id="btn-close-predict-modal"
          @click="handleCloseModal"
          class="p-1 rounded-full text-[#786C65] hover:text-[#2C211C] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Step 1: Configuration Form -->
      <div v-if="step === 'config'" id="predict-step-config" class="space-y-3.5 my-1">
        <!-- Number of Boards Selector -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-[11px] font-bold text-[#2C211C] uppercase tracking-wide">
              Board Count Allocation
            </label>
            <span class="text-xs font-black text-[#2C211C]">
              {{ boardCount }} Boards ({{ formatZAR(boardCount * BOARD_PRICE_ZAR) }})
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="num in [1, 3, 5]"
              :key="num"
              :id="`btn-select-board-count-${num}`"
              type="button"
              @click="boardCount = num"
              :class="[
                'py-2 rounded-full text-xs font-bold transition-all border cursor-pointer',
                boardCount === num
                  ? 'bg-[#2C211C] text-white border-[#2C211C] shadow-xs'
                  : 'bg-[#FAF5EE] hover:bg-[#F4EFE6] text-[#786C65] border-[#EADBCC]'
              ]"
            >
              {{ num }} {{ num === 1 ? 'Board (R3)' : 'Boards (R' + num * 3 + ')' }}
            </button>
          </div>
        </div>

        <!-- Strategy Selection -->
        <div class="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-2">
          <label class="text-[11px] font-extrabold text-[#2C211C] uppercase tracking-wide flex items-center gap-1.5">
            <Cpu class="w-3.5 h-3.5 text-[#F6BD51]" />
            <span>Optimization Heuristic</span>
          </label>

          <div class="space-y-1.5 text-xs">
            <button
              v-for="strat in [
                { id: 'balanced', name: 'Balanced Frequency', desc: 'Combines hot 30-day pairs with cold resurgence' },
                { id: 'hot', name: 'Hot Velocity Cluster', desc: 'Prioritizes highest rolling 7-day draw frequencies' },
                { id: 'frequency', name: 'Low Delta Distribution', desc: 'Even dispersion across 1-36 decade blocks' },
              ]"
              :key="strat.id"
              :id="`btn-strategy-${strat.id}`"
              type="button"
              @click="strategy = strat.id"
              :class="[
                'w-full p-2.5 rounded-xl text-left transition-all border cursor-pointer',
                strategy === strat.id
                  ? 'bg-white border-[#F6BD51] shadow-xs text-[#2C211C]'
                  : 'bg-white/60 hover:bg-white text-[#786C65] border-[#EADBCC]'
              ]"
            >
              <div class="font-bold text-[#2C211C] text-[11px]">{{ strat.name }}</div>
              <div class="text-[10px] text-[#786C65]">{{ strat.desc }}</div>
            </button>
          </div>
        </div>

        <!-- Generate Action Button -->
        <button
          id="btn-execute-generation"
          @click="handleStartGeneration"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-150 active:scale-98 cursor-pointer border border-[#E5A836]"
        >
          <Zap class="w-4 h-4 fill-[#2C211C]" />
          <span>Execute AI Prediction</span>
        </button>
      </div>

      <!-- Step 2: Analyzing / Streaming Execution -->
      <div
        v-if="step === 'analyzing'"
        id="predict-step-analyzing"
        class="py-8 px-2 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div class="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40">
          <Loader2 class="w-8 h-8 text-[#F6BD51] animate-spin" />
          <Sparkles class="w-4 h-4 text-[#F6BD51] absolute" />
        </div>

        <div class="space-y-1 max-w-xs">
          <h4 class="text-xs font-black uppercase text-[#2C211C]">
            Running Algorithmic Simulation
          </h4>
          <p class="text-[11px] text-[#786C65] font-semibold">
            {{ analysisMessage }}
          </p>
        </div>

        <!-- Animated Progress Bar in peach -->
        <div class="w-full bg-[#FAF5EE] rounded-full h-3 p-0.5 border border-[#EADBCC]">
          <div
            class="bg-[#FFB59E] h-full transition-all duration-300 rounded-full border border-[#F0A48C]"
            :style="{ width: `${analysisProgress}%` }"
          />
        </div>
        <div class="flex items-center gap-2 text-[10px] font-bold text-[#786C65]">
          <span>Progress: {{ analysisProgress }}%</span>
          <span>•</span>
          <span class="text-[#2C211C]">Target: {{ boardCount }} Sets</span>
        </div>
      </div>

      <!-- Step 3: Complete / Candidate Sets -->
      <div
        v-if="step === 'complete'"
        id="predict-step-complete"
        class="space-y-3 my-1 flex flex-col"
      >
        <div class="flex items-center justify-between p-2.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold">
          <span class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-[#2E7D32]" />
            <span>✓ {{ generatedSets.length }} Candidates generated & locked!</span>
          </span>
          <span class="text-[11px] text-[#2C211C] font-black">{{ formatZAR(boardCount * BOARD_PRICE_ZAR) }}</span>
        </div>

        <!-- Scrollable Candidate Sets List -->
        <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div
            v-for="(set, idx) in generatedSets"
            :key="set.id"
            :id="`generated-board-${idx + 1}`"
            class="p-3 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-black text-[#2C211C]">Board #{{ set.setNumber || idx + 1 }}</span>
              <span class="text-[10px] font-bold text-[#786C65] bg-white px-2 py-0.5 rounded-full border border-[#E7DFD5]">
                Synergy: <strong class="text-[#2C211C]">{{ set.confidenceScore }}%</strong>
              </span>
            </div>

            <div class="flex items-center justify-between gap-1.5">
              <LottoBall
                v-for="(num, bIdx) in set.numbers"
                :key="`gen-ball-${idx}-${num}`"
                :number="num"
                size="md"
                :variant="bIdx === 0 ? 'peach' : bIdx === 1 ? 'mint' : bIdx === 2 ? 'lavender' : bIdx === 3 ? 'rose' : 'gold'"
              />
            </div>

            <!-- Single board regeneration -->
            <div class="flex justify-end pt-0.5">
              <button
                :id="`btn-reroll-set-${idx + 1}`"
                @click="handleRegenerateSingleSet(idx)"
                class="flex items-center gap-1 text-[10px] font-bold text-[#786C65] hover:text-[#2C211C] px-2 py-1 rounded-full bg-white border border-[#E7DFD5] transition-colors cursor-pointer"
                title="Reroll this specific board"
              >
                <RotateCcw class="w-3 h-3 text-[#786C65]" />
                <span>Reroll Set</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button
            id="btn-re-generate-all"
            @click="handleStartGeneration"
            class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#FAF5EE] hover:bg-[#F4EFE6] text-[#2C211C] font-bold text-xs uppercase tracking-wide transition-colors border border-[#E7DFD5] cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reroll All</span>
          </button>

          <button
            id="btn-done-prediction"
            @click="handleDone"
            class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs uppercase tracking-wider shadow-xs transition-colors border border-[#E5A836] cursor-pointer"
          >
            <Check class="w-4 h-4 stroke-[3]" />
            <span>Accept Candidates</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

