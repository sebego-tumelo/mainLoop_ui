<script setup>
import { computed } from 'vue';
import { Sparkles, Zap, CheckCircle2, Clock, RotateCcw, Activity } from 'lucide-vue-next';
import LottoBall from './LottoBall.vue';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

const props = defineProps({
  currentPrediction: {
    type: Object,
    default: null,
  },
  latestWinningNumbers: {
    type: Array,
    default: () => [],
  },
  onOpenPredictModal: {
    type: Function,
    required: true,
  },
});

const isEvaluated = computed(() => props.currentPrediction?.status === 'evaluated');

// Average confidence score
const averageConfidence = computed(() => {
  if (!props.currentPrediction?.sets?.length) return 78;
  const sum = props.currentPrediction.sets.reduce((acc, s) => acc + (s.confidenceScore || 75), 0);
  return Math.round(sum / props.currentPrediction.sets.length);
});
</script>

<template>
  <section
    id="section-current-prediction"
    class="w-full bg-white rounded-3xl p-4 border border-[#E7DFD5] shadow-xs space-y-3.5 transition-all"
  >
    <!-- Header matching the Journal screen top from reference image -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="text-xl">🐾</span>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-xl font-black text-[#2C211C] tracking-tight">{{ averageConfidence }}%</span>
            <span class="text-[10px] font-extrabold tracking-wider uppercase text-[#786C65]">
              AI CONFIDENCE MATRIX
            </span>
          </div>
        </div>
      </div>

      <button
        id="btn-edit-goal-predict"
        @click="onOpenPredictModal"
        class="text-[10px] font-extrabold uppercase tracking-wider text-[#2C211C] px-3 py-1.5 rounded-full border border-[#2C211C]/25 hover:bg-[#FAF5EE] transition-all cursor-pointer shadow-xs active:scale-95"
      >
        {{ currentPrediction ? 'RECONFIGURE' : 'GENERATE' }}
      </button>
    </div>

    <!-- Wide Pill Progress Bar (Exact replica of the Peach progress pill in the reference image) -->
    <div class="w-full bg-[#FAF5EE] rounded-full h-7 p-1 border border-[#EADBCC] flex items-center">
      <div
        class="bg-[#FFB59E] h-full rounded-full transition-all duration-500 border border-[#F0A48C]/60 flex items-center justify-end px-2"
        :style="{ width: `${Math.max(25, averageConfidence)}%` }"
      >
        <span class="text-[9px] font-black text-[#6B2F1F] tracking-tighter font-mono">
          {{ averageConfidence }}% SATISFACTION
        </span>
      </div>
    </div>

    <!-- Prediction Boards List -->
    <div v-if="currentPrediction" class="space-y-2.5">
      <div
        v-for="(set, idx) in currentPrediction.sets"
        :key="set.id"
        :id="`prediction-board-${idx + 1}`"
        :class="[
          'p-3 rounded-2xl border transition-all',
          (set.matchedNumbers?.length || 0) > 0 && isEvaluated
            ? 'bg-[#FFF9E6] border-[#F6BD51] shadow-xs'
            : 'bg-[#FAF5EE] border-[#EADBCC] hover:border-[#D5C6B5]'
        ]"
      >
        <!-- Board Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-[#2C211C]">
              Board #{{ set.setNumber || idx + 1 }}
            </span>
            <span class="text-[10px] font-bold text-[#786C65] bg-white px-2 py-0.5 rounded-full border border-[#E7DFD5]">
              Synergy: <strong class="text-[#2C211C]">{{ set.confidenceScore || 82 }}%</strong>
            </span>
          </div>

          <div v-if="isEvaluated" class="flex items-center gap-1">
            <span
              :class="[
                'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border',
                (set.winAmount || 0) > 0
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : 'bg-white text-[#786C65] border-[#E7DFD5]'
              ]"
            >
              {{ (set.matchedNumbers?.length || 0) > 0
                ? `${set.matchedNumbers.length} Matched (${formatZAR(set.winAmount || 0)})`
                : '0 Matches' }}
            </span>
          </div>
          <div v-else class="text-[10px] font-extrabold text-[#786C65] flex items-center gap-1">
            <Clock class="w-3 h-3 text-[#F6BD51]" />
            <span>Target Draw</span>
          </div>
        </div>

        <!-- Numbers row in board -->
        <div class="flex items-center justify-between gap-1.5 sm:gap-2">
          <LottoBall
            v-for="(num, bIdx) in set.numbers"
            :key="`pred-ball-${idx}-${num}`"
            :number="num"
            size="md"
            :isMatched="set.matchedNumbers?.includes(num)"
            :variant="
              set.matchedNumbers?.includes(num)
                ? 'gold'
                : bIdx === 0
                ? 'peach'
                : bIdx === 1
                ? 'mint'
                : bIdx === 2
                ? 'lavender'
                : bIdx === 3
                ? 'rose'
                : 'default'
            "
          />
        </div>
      </div>

      <!-- Algorithmic Gauges (Tripartite Scale Cards directly replicating Eating, Drinking, Moving in the image) -->
      <div class="space-y-2 pt-1">
        <!-- 1. Frequency Distribution Gauge -->
        <div class="p-2.5 rounded-2xl bg-white border border-[#E7DFD5] space-y-1.5">
          <div class="flex items-center justify-between text-xs font-bold text-[#2C211C]">
            <div class="flex items-center gap-1.5">
              <span>🍗</span>
              <span>Hot Decade Dispersion</span>
            </div>
            <span class="text-[11px] font-mono text-[#786C65]">Optimal △</span>
          </div>
          <!-- Gauge Slider Bar with Indicator Triangle -->
          <div class="relative pt-1 pb-1">
            <div class="h-1.5 bg-[#FAF5EE] rounded-full overflow-hidden flex border border-[#EADBCC]">
              <div class="w-1/3 bg-[#EADBCC]"></div>
              <div class="w-1/3 bg-[#B7E1D2]"></div>
              <div class="w-1/3 bg-[#EADBCC]"></div>
            </div>
            <!-- Pointer Triangle ▼ -->
            <div class="text-center -mt-3.5 ml-[55%] text-[10px] text-[#2C211C] leading-none select-none">
              ▼
            </div>
          </div>
          <div class="flex justify-between text-[8px] font-bold uppercase tracking-wider text-[#9E928C]">
            <span>Below Average</span>
            <span class="text-[#2C211C]">Average</span>
            <span>Above Average</span>
          </div>
        </div>

        <!-- 2. Odd/Even Parity Gauge -->
        <div class="p-2.5 rounded-2xl bg-white border border-[#E7DFD5] space-y-1.5">
          <div class="flex items-center justify-between text-xs font-bold text-[#2C211C]">
            <div class="flex items-center gap-1.5">
              <span>🥚</span>
              <span>Odd / Even Parity Ratio (3:2)</span>
            </div>
            <span class="text-[11px] font-mono text-[#786C65]">92% Match ▽</span>
          </div>
          <div class="relative pt-1 pb-1">
            <div class="h-1.5 bg-[#FAF5EE] rounded-full overflow-hidden flex border border-[#EADBCC]">
              <div class="w-1/3 bg-[#EADBCC]"></div>
              <div class="w-1/3 bg-[#FFB59E]"></div>
              <div class="w-1/3 bg-[#EADBCC]"></div>
            </div>
            <div class="text-center -mt-3.5 ml-[48%] text-[10px] text-[#2C211C] leading-none select-none">
              ▼
            </div>
          </div>
          <div class="flex justify-between text-[8px] font-bold uppercase tracking-wider text-[#9E928C]">
            <span>Below Average</span>
            <span class="text-[#2C211C]">Average</span>
            <span>Above Average</span>
          </div>
        </div>
      </div>

      <!-- Action Button matching the warm golden butterscotch style -->
      <div class="pt-1.5">
        <button
          id="btn-predict-next-draw"
          @click="onOpenPredictModal"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-150 active:scale-98 cursor-pointer border border-[#E5A836]"
        >
          <Zap class="w-4 h-4 fill-[#2C211C] text-[#2C211C]" />
          <span>Generate New Prediction</span>
          <span class="text-[10px] bg-white/70 px-2 py-0.5 rounded-full font-bold ml-1 text-[#2C211C]">
            3 Boards • R9
          </span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-8 flex flex-col items-center justify-center text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-[#FAF5EE] border border-[#EADBCC] flex items-center justify-center text-[#F6BD51]">
        <Zap class="w-6 h-6" />
      </div>
      <div>
        <p class="text-xs font-bold text-[#2C211C]">No Active Predictions</p>
        <p class="text-[11px] text-[#786C65] max-w-xs mt-0.5">
          Generate an AI recommendation for tonight's 21:00 SA Daily Lotto draw.
        </p>
      </div>
      <button
        id="btn-predict-first-time"
        @click="onOpenPredictModal"
        class="flex items-center gap-2 py-2.5 px-4 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs shadow-xs transition-all border border-[#E5A836]"
      >
        <Zap class="w-3.5 h-3.5 fill-[#2C211C]" />
        <span>Generate 3 Candidate Sets</span>
      </button>
    </div>
  </section>
</template>

