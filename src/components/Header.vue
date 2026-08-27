<script setup>
import { ref } from 'vue';
import { Dices, Info, Sparkles, BatteryCharging, Radio, ChevronRight } from 'lucide-vue-next';

defineProps({
  onOpenPredictModal: {
    type: Function,
    required: true,
  },
  onOpenSimulateModal: {
    type: Function,
    required: true,
  },
  onOpenPrizeInfoModal: {
    type: Function,
    required: true,
  },
});

const selectedDayIndex = ref(3); // Default to Thursday 18th like in reference image

const weekDays = [
  { day: 'MON', date: '15' },
  { day: 'TUE', date: '16' },
  { day: 'WED', date: '17' },
  { day: 'THU', date: '18' },
  { day: 'FRI', date: '19' },
  { day: 'SAT', date: '20' },
  { day: 'SUN', date: '21' },
];
</script>

<template>
  <header class="w-full bg-nav-sand text-ui-charcoal pt-2.5 pb-4 px-4 rounded-b-[24px] border-b border-ui-charcoal relative z-20">
    <!-- Empty placeholder to maintain status bar vertical space -->
    <div class="h-[16px] mb-2"></div>

    <!-- Main Title Header -->
    <div class="flex items-center justify-between gap-2 max-w-lg mx-auto mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-ui-charcoal text-nav-sand flex items-center justify-center font-black text-sm">
          27
        </div>
        <div>
          <h1 class="ui-heading text-lg tracking-wider text-ui-charcoal">
            THURSDAY
          </h1>
        </div>
      </div>

      <!-- Header actions (Test Draw & Rules) -->
      <div class="flex items-center gap-1.5">
        <button
          id="btn-simulate-draw-quick"
          @click="onOpenSimulateModal"
          title="Simulate Draw"
          class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-white/90 text-ui-charcoal border border-ui-charcoal transition-all active:scale-95"
        >
          <Dices class="w-3.5 h-3.5 text-ui-charcoal" />
          <span>Simulate</span>
        </button>

        <button
          id="btn-open-rules-info"
          @click="onOpenPrizeInfoModal"
          title="Daily Lotto Rules & Payout Structure"
          class="p-1.5 rounded-full bg-white hover:bg-white/90 text-ui-charcoal border border-ui-charcoal transition-all active:scale-95"
        >
          <Info class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Horizontal Weekly Date Strip (Exact match to reference image) -->
    <div class="flex items-center justify-between max-w-lg mx-auto px-1 py-1">
      <button
        v-for="(item, idx) in weekDays"
        :key="item.day"
        @click="selectedDayIndex = idx"
        :class="[
          'flex flex-col items-center justify-center transition-all cursor-pointer select-none',
          selectedDayIndex === idx
            ? 'bg-ui-charcoal text-white px-2.5 py-1.5 rounded-[18px] -my-1 scale-105'
            : 'text-ui-charcoal/75 hover:text-ui-charcoal px-1.5 py-1'
        ]"
      >
        <span class="text-[9px] font-extrabold tracking-wider">{{ item.day }}</span>
        <span
          :class="[
            'text-xs font-black mt-0.5',
            selectedDayIndex === idx ? 'text-nav-sand' : 'text-ui-charcoal'
          ]"
        >
          {{ item.date }}
        </span>
      </button>
    </div>

    <!-- Live Status Pill Card -->
    <div class="mt-3.5 max-w-lg mx-auto bg-white rounded-[24px] p-3 border border-ui-charcoal flex items-center justify-between">
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- Avatar Badge with Lucky Ball Icon -->
        <div class="w-9 h-9 rounded-[16px] bg-metric-orange border border-ui-charcoal flex items-center justify-center shrink-0">
          <Sparkles class="w-4 h-4 text-ui-charcoal" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1 text-[11px] font-bold text-ui-charcoal">
            <span class="inline-flex items-center text-[10px] text-ui-charcoal bg-metric-mint px-1.5 py-0.2 rounded-full font-bold">
              (•) LIVE
            </span>
            <span class="truncate">SA Daily Lotto 5/36</span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-ui-charcoal/70 font-medium mt-0.5">
            <span>🕒 21:00 SAST</span>
            <span>•</span>
            <span>R475k Est. Jackpot</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 bg-canvas-peach px-2.5 py-1 rounded-full border border-ui-charcoal text-[10px] font-mono font-bold text-ui-charcoal shrink-0">
        <span>87%</span>
        <BatteryCharging class="w-3 h-3 text-ui-charcoal" />
      </div>
    </div>
  </header>
</template>

