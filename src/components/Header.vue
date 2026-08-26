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
  <header class="w-full bg-[#F6BD51] text-[#2C211C] pt-2.5 pb-4 px-4 rounded-b-[32px] border-b border-[#333333] relative z-20">
    <!-- Top status line mock from reference image: 9:41 ... icons -->
    <div class="flex items-center justify-between text-[11px] font-semibold text-[#2C211C]/80 px-1 mb-2">
      <span class="font-bold tracking-tight">9:41</span>
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] font-bold">5G</span>
        <div class="w-4 h-2 rounded-xs border border-[#2C211C]/80 p-[1px] flex items-center">
          <div class="h-full w-3 bg-[#2C211C] rounded-[0.5px]"></div>
        </div>
      </div>
    </div>

    <!-- Main Title Header -->
    <div class="flex items-center justify-between gap-2 max-w-lg mx-auto mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-[#2C211C] text-[#F6BD51] flex items-center justify-center font-black text-sm shadow-xs">
          5
        </div>
        <div>
          <h1 class="text-lg font-black tracking-wider uppercase text-[#2C211C]">
            TODAY
          </h1>
        </div>
      </div>

      <!-- Header actions (Test Draw & Rules) -->
      <div class="flex items-center gap-1.5">
        <button
          id="btn-simulate-draw-quick"
          @click="onOpenSimulateModal"
          title="Simulate Draw"
          class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C211C] border border-[#2C211C]/15 transition-all shadow-xs active:scale-95"
        >
          <Dices class="w-3.5 h-3.5 text-[#2C211C]" />
          <span>Simulate</span>
        </button>

        <button
          id="btn-open-rules-info"
          @click="onOpenPrizeInfoModal"
          title="Daily Lotto Rules & Payout Structure"
          class="p-1.5 rounded-full bg-white/90 hover:bg-white text-[#2C211C] border border-[#2C211C]/15 transition-all shadow-xs active:scale-95"
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
            ? 'bg-[#2C211C] text-white px-2.5 py-1.5 rounded-[18px] shadow-sm -my-1 scale-105'
            : 'text-[#2C211C]/75 hover:text-[#2C211C] px-1.5 py-1'
        ]"
      >
        <span class="text-[9px] font-extrabold tracking-wider">{{ item.day }}</span>
        <span
          :class="[
            'text-xs font-black mt-0.5',
            selectedDayIndex === idx ? 'text-[#F6BD51]' : 'text-[#2C211C]'
          ]"
        >
          {{ item.date }}
        </span>
      </button>
    </div>

    <!-- Live Status Pill Card (Matches the Cat / Live status card in the reference image) -->
    <div class="mt-3.5 max-w-lg mx-auto bg-white rounded-2xl p-2.5 border border-[#2C211C]/10 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- Avatar Badge with Lucky Ball Icon -->
        <div class="w-9 h-9 rounded-xl bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center shrink-0">
          <Sparkles class="w-4 h-4 text-[#F6BD51]" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1 text-[11px] font-bold text-[#2C211C]">
            <span class="inline-flex items-center text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.2 rounded-full font-bold">
              (•) LIVE
            </span>
            <span class="truncate">SA Daily Lotto 5/36</span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-[#786C65] font-medium mt-0.5">
            <span>🕒 21:00 SAST</span>
            <span>•</span>
            <span>R475k Est. Jackpot</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 bg-[#FBF7F0] px-2.5 py-1 rounded-full border border-[#E7DFD5] text-[10px] font-mono font-bold text-[#2C211C] shrink-0">
        <span>87%</span>
        <BatteryCharging class="w-3 h-3 text-[#2E7D32]" />
      </div>
    </div>
  </header>
</template>

