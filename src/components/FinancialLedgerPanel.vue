<script setup>
import { computed } from 'vue';
import { Info, Sparkles, TrendingUp, TrendingDown } from 'lucide-vue-next';
import { formatZAR, formatSignedZAR } from '../utils/lottoEngine';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  onOpenPrizeInfoModal: {
    type: Function,
    required: true,
  },
});

const isProfitable = computed(() => props.stats.netProfit >= 0);
</script>

<template>
  <section
    id="section-financial-ledger"
    class="w-full space-y-2.5 transition-all"
  >
    <!-- 4-Quadrant Pastel Grid (Direct 1:1 match to the reference image) -->
    <div class="grid grid-cols-2 gap-2.5">
      <!-- 1. Top Left: Soft Peach Card (Needs Satisfaction in reference) -->
      <div
        id="metric-current-cost"
        class="p-3.5 rounded-2xl bg-[#FFB59E] border border-[#333333] text-[#2C211C] flex items-center justify-between transition-transform duration-150 hover:scale-[1.01]"
      >
        <div class="min-w-0 pr-1">
          <div class="text-2xl font-black tracking-tight leading-none text-[#2C211C]">
            {{ formatZAR(stats.currentDrawCost) }}
          </div>
          <div class="text-[11px] font-bold text-[#6B2F1F] mt-1.5 leading-tight">
            Draw Stake
          </div>
        </div>

        <!-- Segmented Donut Ring SVG (Coral / Rust from reference image) -->
        <div class="w-10 h-10 shrink-0 relative flex items-center justify-center">
          <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#ECA089" stroke-width="3" stroke-dasharray="4 2" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#C94F31" stroke-width="3.5" stroke-dasharray="35 60" stroke-linecap="round" />
          </svg>
          <span class="absolute text-[8px] font-black text-[#6B2F1F]">R9</span>
        </div>
      </div>

      <!-- 2. Top Right: Mint / Sage Card (Activity Goal in reference) -->
      <div
        id="metric-lifetime-spent"
        class="p-3.5 rounded-2xl bg-[#B7E1D2] border border-[#333333] text-[#2C211C] flex items-center justify-between transition-transform duration-150 hover:scale-[1.01]"
      >
        <div class="min-w-0 pr-1">
          <div class="text-2xl font-black tracking-tight leading-none text-[#2C211C]">
            {{ formatZAR(stats.lifetimeSpent) }}
          </div>
          <div class="text-[11px] font-bold text-[#1D4F3E] mt-1.5 leading-tight">
            Total Invested
          </div>
        </div>

        <!-- Segmented Donut Ring SVG (Sage Green from reference image) -->
        <div class="w-10 h-10 shrink-0 relative flex items-center justify-center">
          <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#9FD3C1" stroke-width="3" stroke-dasharray="4 2" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#256B52" stroke-width="3.5" stroke-dasharray="55 40" stroke-linecap="round" />
          </svg>
          <span class="absolute text-[8px] font-black text-[#1D4F3E]">{{ stats.totalDrawsEvaluated }}d</span>
        </div>
      </div>

      <!-- 3. Bottom Left: Soft Lavender Card (Sleep Quality in reference) -->
      <div
        id="metric-lifetime-won"
        class="p-3.5 rounded-2xl bg-[#D2CFF7] border border-[#333333] text-[#2C211C] flex items-center justify-between transition-transform duration-150 hover:scale-[1.01]"
      >
        <div class="min-w-0 pr-1">
          <div class="text-2xl font-black tracking-tight leading-none text-[#2C211C]">
            {{ formatZAR(stats.lifetimeWon) }}
          </div>
          <div class="text-[11px] font-bold text-[#3D3577] mt-1.5 leading-tight">
            Lifetime Won
          </div>
        </div>

        <!-- Segmented Donut Ring SVG (Purple from reference image) -->
        <div class="w-10 h-10 shrink-0 relative flex items-center justify-center">
          <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#BBB7EE" stroke-width="3" stroke-dasharray="4 2" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#52479B" stroke-width="3.5" stroke-dasharray="68 30" stroke-linecap="round" />
          </svg>
          <span class="absolute text-[8px] font-black text-[#3D3577]">★</span>
        </div>
      </div>

      <!-- 4. Bottom Right: Soft Coral / Rose Card (Wellness Index in reference) -->
      <div
        id="metric-net-profit-roi"
        class="p-3.5 rounded-2xl bg-[#F8B6B7] border border-[#333333] text-[#2C211C] flex items-center justify-between transition-transform duration-150 hover:scale-[1.01]"
      >
        <div class="min-w-0 pr-1">
          <div class="text-2xl font-black tracking-tight leading-none text-[#2C211C] flex items-baseline gap-1">
            <span>{{ isProfitable ? `+${stats.roiPercentage.toFixed(0)}%` : `${stats.roiPercentage.toFixed(0)}%` }}</span>
          </div>
          <div class="text-[11px] font-bold text-[#712233] mt-1.5 leading-tight truncate">
            Net Yield / ROI
          </div>
        </div>

        <!-- Segmented Donut Ring SVG (Rose / Pink from reference image) -->
        <div class="w-10 h-10 shrink-0 relative flex items-center justify-center">
          <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#E99FA1" stroke-width="3" stroke-dasharray="4 2" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#A6334D" stroke-width="3.5" stroke-dasharray="60 35" stroke-linecap="round" />
          </svg>
          <TrendingUp v-if="isProfitable" class="absolute w-3.5 h-3.5 text-[#712233]" />
          <TrendingDown v-else class="absolute w-3.5 h-3.5 text-[#712233]" />
        </div>
      </div>
    </div>

    <!-- Category Filter Chips (Matches the 3 pills below cards in the reference image: Meowing, Licking, Scratching) -->
    <div class="flex items-center justify-around px-2 py-1 text-xs font-bold text-[#6B5A51]">
      <button
        @click="onOpenPrizeInfoModal"
        class="flex items-center gap-1.5 hover:text-[#2C211C] transition-colors py-1 cursor-pointer"
      >
        <span class="w-2 h-2 rounded-full border-2 border-[#E0694B]"></span>
        <span>Hot Matrix</span>
      </button>

      <button
        @click="onOpenPrizeInfoModal"
        class="flex items-center gap-1.5 hover:text-[#2C211C] transition-colors py-1 cursor-pointer"
      >
        <span class="w-2 h-2 rounded-full border-2 border-[#3E7761]"></span>
        <span>Rolldown Rules</span>
      </button>

      <button
        @click="onOpenPrizeInfoModal"
        class="flex items-center gap-1.5 hover:text-[#2C211C] transition-colors py-1 cursor-pointer"
      >
        <span class="w-2 h-2 rounded-full border-2 border-[#5F56A4]"></span>
        <span>3-Board Synergy</span>
      </button>
    </div>
  </section>
</template>

