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
    class="w-full bg-white rounded-[24px] p-4 border border-ui-charcoal space-y-4 transition-all"
  >
    <!-- Header matching the Journal screen top from reference image -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="text-xl">🐾</span>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="ui-heading text-xl tracking-tight text-ui-charcoal">{{ averageConfidence }}%</span>
            <span class="text-[10px] font-extrabold tracking-wider uppercase text-ui-charcoal/70">
              AI CONFIDENCE MATRIX
            </span>
          </div>
        </div>
      </div>

      <button
        id="btn-edit-goal-predict"
        @click="onOpenPredictModal"
        class="text-[10px] font-extrabold uppercase tracking-wider text-ui-charcoal px-3 py-1.5 rounded-full border border-ui-charcoal/20 hover:bg-nav-sand/50 transition-all cursor-pointer active:scale-95"
      >
        {{ currentPrediction ? 'RECONFIGURE' : 'GENERATE' }}
      </button>
    </div>

    <!-- Wide Pill Progress Bar -->
    <div class="w-full bg-canvas-peach/50 rounded-full h-7 p-1 border border-ui-charcoal flex items-center">
      <div
        class="bg-metric-orange h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
        :style="{ width: `${Math.max(25, averageConfidence)}%` }"
      >
        <span class="text-[9px] font-black text-ui-charcoal tracking-tighter font-mono">
          {{ averageConfidence }}% SATISFACTION
        </span>
      </div>
    </div>

    <!-- Prediction Boards List -->
    <div v-if="currentPrediction" class="space-y-3">
      <div
        v-for="(set, idx) in currentPrediction.sets"
        :key="set.id"
        :id="`prediction-board-${idx + 1}`"
        :class="[
          'p-4 rounded-[24px] border transition-all',
          (set.matchedNumbers?.length || 0) > 0 && isEvaluated
            ? 'bg-metric-orange/30 border-ui-charcoal'
            : 'bg-canvas-peach/20 border-ui-charcoal'
        ]"
      >
        <!-- Board Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="ui-heading text-xs text-ui-charcoal">
              Board #{{ set.setNumber || idx + 1 }}
            </span>
            <span class="text-[10px] font-bold text-ui-charcoal/70 bg-white px-2 py-0.5 rounded-full border border-ui-charcoal">
              Synergy: <strong class="text-ui-charcoal">{{ set.confidenceScore || 82 }}%</strong>
            </span>
          </div>

          <div v-if="isEvaluated" class="flex items-center gap-1">
            <span
              :class="[
                'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-ui-charcoal',
                (set.winAmount || 0) > 0
                  ? 'bg-metric-mint text-ui-charcoal'
                  : 'bg-white text-ui-charcoal'
              ]"
            >
              {{ (set.matchedNumbers?.length || 0) > 0
                ? `${set.matchedNumbers.length} Matched (${formatZAR(set.winAmount || 0)})`
                : '0 Matches' }}
            </span>
          </div>
          <div v-else class="text-[10px] font-extrabold text-ui-charcoal/70 flex items-center gap-1">
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

      <!-- Algorithmic Gauges -->
      

      <!-- Action Button matching the warm golden butterscotch style -->
      <div class="pt-2">
        <button
          id="btn-predict-next-draw"
          @click="onOpenPredictModal"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[24px] bg-nav-sand hover:bg-nav-sand/90 text-ui-charcoal font-black text-xs uppercase tracking-wider border border-ui-charcoal transition-all active:scale-95"
        >
          <Zap class="w-4 h-4 text-ui-charcoal" />
          <span>Generate New Prediction</span>
          <span class="text-[10px] bg-white px-2 py-0.5 rounded-full border border-ui-charcoal font-bold ml-1 text-ui-charcoal">
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

