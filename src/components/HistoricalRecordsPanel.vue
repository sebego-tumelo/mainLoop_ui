<script setup>
import { ref, computed } from 'vue';
import { History, ArrowUpDown, ChevronDown, ChevronUp, Trophy } from 'lucide-vue-next';
import LottoBall from './LottoBall.vue';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

const props = defineProps({
  draws: {
    type: Array,
    required: true,
  },
  predictions: {
    type: Array,
    required: true,
  },
});

const activeTab = ref('draws'); // 'draws' | 'predictions'
const sortOrder = ref('newest'); // 'newest' | 'oldest'
const expandedDrawId = ref(null);
const expandedPredictionId = ref(null);

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'newest' ? 'oldest' : 'newest';
};

const sortedDraws = computed(() => {
  return [...props.draws].sort((a, b) => {
    return sortOrder.value === 'newest'
      ? b.drawNumber - a.drawNumber
      : a.drawNumber - b.drawNumber;
  });
});

const sortedPredictions = computed(() => {
  return [...props.predictions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
  });
});

const toggleDrawExpand = (id) => {
  expandedDrawId.value = expandedDrawId.value === id ? null : id;
};

const togglePredictionExpand = (id) => {
  expandedPredictionId.value = expandedPredictionId.value === id ? null : id;
};
</script>

<template>
  <section
    id="section-historical-records"
    class="w-full bg-white rounded-3xl p-4 border border-[#E7DFD5] shadow-xs space-y-3.5 transition-all"
  >
    <!-- Panel Title matching the Insights style in reference image -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center text-[#2C211C]">
          <History class="w-4 h-4 text-[#F6BD51]" />
        </div>
        <div>
          <h2 class="text-xs font-black tracking-wider uppercase text-[#2C211C]">
            HISTORICAL LOGS
          </h2>
          <p class="text-[10px] text-[#786C65] font-semibold">
            SA Daily Lotto archives & prediction yield
          </p>
        </div>
      </div>

      <button
        id="btn-toggle-sort-order"
        @click="toggleSort"
        class="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FAF5EE] hover:bg-[#F4EFE6] text-[#2C211C] border border-[#E7DFD5] transition-colors cursor-pointer"
      >
        <ArrowUpDown class="w-3 h-3 text-[#2C211C]" />
        <span>{{ sortOrder === 'newest' ? 'Newest' : 'Oldest' }}</span>
      </button>
    </div>

    <!-- Pill Tab Switcher -->
    <div class="flex items-center justify-between gap-1 p-1 rounded-full bg-[#FAF5EE] border border-[#EADBCC]">
      <button
        id="tab-btn-draws"
        @click="activeTab = 'draws'"
        :class="[
          'flex-1 py-1.5 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center',
          activeTab === 'draws'
            ? 'bg-[#2C211C] text-white shadow-xs'
            : 'text-[#786C65] hover:text-[#2C211C]'
        ]"
      >
        Draw Archive ({{ draws.length }})
      </button>
      <button
        id="tab-btn-predictions"
        @click="activeTab = 'predictions'"
        :class="[
          'flex-1 py-1.5 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center',
          activeTab === 'predictions'
            ? 'bg-[#2C211C] text-white shadow-xs'
            : 'text-[#786C65] hover:text-[#2C211C]'
        ]"
      >
        Prediction Log ({{ predictions.length }})
      </button>
    </div>

    <!-- Content 1: Draw Archive -->
    <div v-if="activeTab === 'draws'" id="tab-content-draws" class="space-y-2 max-h-[440px] overflow-y-auto pr-1">
      <div
        v-for="draw in sortedDraws"
        :key="draw.id"
        :id="`history-draw-${draw.drawNumber}`"
        class="p-3 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] hover:border-[#D5C6B5] transition-all"
      >
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-[#2C211C]">
              Draw #{{ draw.drawNumber }}
            </span>
            <span class="text-[10px] font-semibold text-[#786C65]">
              {{ draw.date }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-[#2C211C]">
              {{ formatZAR(draw.prizePool) }}
            </span>
            <button
              :id="`btn-expand-draw-${draw.drawNumber}`"
              @click="toggleDrawExpand(draw.id)"
              class="p-1 rounded-full bg-white hover:bg-[#FAF5EE] text-[#786C65] hover:text-[#2C211C] border border-[#E7DFD5] transition-colors cursor-pointer"
            >
              <ChevronUp v-if="expandedDrawId === draw.id" class="w-3.5 h-3.5" />
              <ChevronDown v-else class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Lottery balls in historical draw -->
        <div class="flex items-center justify-between gap-1.5 py-1">
          <LottoBall
            v-for="(num, bIdx) in draw.winningNumbers"
            :key="`hist-draw-${draw.id}-${num}`"
            :number="num"
            size="sm"
            :variant="bIdx % 2 === 0 ? 'gold' : 'peach'"
          />
        </div>

        <!-- Expanded Divisions View -->
        <div
          v-if="expandedDrawId === draw.id"
          class="mt-2.5 pt-2 border-t border-[#EADBCC] text-[10px] space-y-1"
        >
          <div class="text-[9px] uppercase text-[#786C65] font-extrabold mb-1">
            Draw Prize Distribution:
          </div>
          <div
            v-for="div in draw.divisions"
            :key="div.match"
            class="flex items-center justify-between text-[#786C65] px-1"
          >
            <span>Match {{ div.match }} ({{ div.winners }} winners)</span>
            <span class="text-[#2C211C] font-black">{{ formatZAR(div.payout) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content 2: Prediction Log -->
    <div v-else id="tab-content-predictions" class="space-y-2 max-h-[440px] overflow-y-auto pr-1">
      <div
        v-for="pred in sortedPredictions"
        :key="pred.id"
        :id="`history-pred-${pred.id}`"
        class="p-3 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] hover:border-[#D5C6B5] transition-all"
      >
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-[#2C211C]">
              {{ pred.targetDrawDate }}
            </span>
            <span class="text-[10px] font-bold text-[#786C65] bg-white px-2 py-0.5 rounded-full border border-[#E7DFD5]">
              {{ pred.sets.length }} Boards
            </span>
          </div>

          <div class="flex items-center gap-2">
            <template v-if="pred.status === 'evaluated'">
              <span
                :class="[
                  'text-[10px] font-black px-2 py-0.5 rounded-full border',
                  pred.netProfit >= 0
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                ]"
              >
                {{ formatSignedZAR(pred.netProfit) }}
              </span>
            </template>
            <template v-else>
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF3D9] text-[#784A0E] border border-[#F6BD51]">
                Pending Draw
              </span>
            </template>

            <button
              :id="`btn-expand-pred-${pred.id}`"
              @click="togglePredictionExpand(pred.id)"
              class="p-1 rounded-full bg-white hover:bg-[#FAF5EE] text-[#786C65] hover:text-[#2C211C] border border-[#E7DFD5] transition-colors cursor-pointer"
            >
              <ChevronUp v-if="expandedPredictionId === pred.id" class="w-3.5 h-3.5" />
              <ChevronDown v-else class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-[10px] text-[#786C65] font-semibold">
          <span>
            Cost: <strong class="text-[#2C211C]">{{ formatZAR(pred.cost) }}</strong> | Won:
            <strong class="text-[#2C211C]">{{ formatZAR(pred.totalWon) }}</strong>
          </span>
          <span class="text-[#2C211C] font-black">
            {{ pred.topMatchCount > 0 ? `Best: Match ${pred.topMatchCount}` : '0 Matches' }}
          </span>
        </div>

        <!-- Expanded Sets List -->
        <div
          v-if="expandedPredictionId === pred.id"
          class="mt-2.5 pt-2 border-t border-[#EADBCC] space-y-2"
        >
          <div
            v-for="(set, sIdx) in pred.sets"
            :key="set.id"
            class="p-2 rounded-xl bg-white border border-[#EADBCC]"
          >
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-black text-[#2C211C]">Set #{{ set.setNumber || sIdx + 1 }}</span>
              <span class="text-[#2E7D32] font-black">
                {{ (set.matchedNumbers?.length || 0) > 0
                  ? `${set.matchedNumbers.length} Matched (${formatZAR(set.winAmount || 0)})`
                  : '0 Matches' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-1 mt-1.5">
              <LottoBall
                v-for="num in set.numbers"
                :key="`hist-set-ball-${sIdx}-${num}`"
                :number="num"
                size="sm"
                :isMatched="set.matchedNumbers?.includes(num)"
                :variant="set.matchedNumbers?.includes(num) ? 'gold' : 'default'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

