<script setup>
import { ref } from 'vue';
import { Trophy, Calendar, ChevronDown, ChevronUp, Sparkles, Award } from 'lucide-vue-next';
import LottoBall from './LottoBall.vue';
import { formatZAR } from '../utils/lottoEngine';

const props = defineProps({
  draw: {
    type: Object,
    required: true,
  },
  matchedNumbers: {
    type: Array,
    default: () => [],
  },
});

const isDropdownOpen = ref(false);
</script>

<template>
  <section
    id="section-latest-draw"
    class="w-full bg-white rounded-3xl p-4 border border-[#E7DFD5] shadow-xs space-y-3.5 transition-all"
  >
    <!-- Top Header mimicking the Insights section from reference image -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center text-[#2C211C]">
          <Award class="w-4 h-4 text-[#F6BD51]" />
        </div>
        <div>
          <h2 class="text-xs font-black tracking-wider uppercase text-[#2C211C] flex items-center gap-1.5">
            <span>OFFICIAL DRAW #{{ draw.drawNumber }}</span>
          </h2>
          <p class="text-[10px] text-[#786C65] font-semibold">
            {{ draw.date }} • {{ draw.time }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
          Latest Result
        </span>
      </div>
    </div>

    <!-- Winning Numbers Display inside soft warm capsule -->
    <div class="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] flex flex-col items-center justify-center">
      <div class="text-[10px] uppercase font-extrabold tracking-wider text-[#786C65] mb-2.5 flex items-center gap-1.5">
        <Sparkles class="w-3 h-3 text-[#F6BD51]" />
        <span>Winning Number Combination</span>
      </div>
      
      <div class="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
        <LottoBall
          v-for="num in draw.winningNumbers"
          :key="`win-ball-${num}`"
          :id="`ball-win-${num}`"
          :number="num"
          size="lg"
          variant="gold"
          :isMatched="matchedNumbers?.includes(num)"
        />
      </div>

      <!-- Estimated Prize Pool Pill -->
      <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DFD5] text-[11px] font-bold text-[#2C211C] shadow-xs">
        <span class="text-[#786C65]">Estimated Pool:</span>
        <span class="text-[#2C211C] font-black">{{ formatZAR(draw.prizePool) }}</span>
      </div>
    </div>

    <!-- Prize Breakdown Dropdown -->
    <div>
      <button
        id="btn-toggle-prize-divisions"
        @click="isDropdownOpen = !isDropdownOpen"
        class="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold rounded-full bg-[#FAF5EE] hover:bg-[#F4EFE6] text-[#2C211C] border border-[#E7DFD5] transition-all cursor-pointer"
      >
        <span class="flex items-center gap-1.5 text-[11px]">
          <Trophy class="w-3.5 h-3.5 text-[#F6BD51]" />
          {{ isDropdownOpen ? 'Hide Prize Divisions & Payouts' : 'Show Prize Divisions & Payouts' }}
        </span>
        <ChevronUp v-if="isDropdownOpen" class="w-4 h-4 text-[#2C211C]" />
        <ChevronDown v-else class="w-4 h-4 text-[#786C65]" />
      </button>

      <!-- Dropdown Content Table -->
      <div
        v-if="isDropdownOpen"
        id="prize-divisions-table"
        class="mt-2.5 p-2.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-1.5 transition-all"
      >
        <div class="grid grid-cols-4 text-[9px] uppercase font-extrabold tracking-wider text-[#786C65] px-2 py-1 border-b border-[#E7DFD5]">
          <div>Division</div>
          <div class="text-center">Pool Share</div>
          <div class="text-center">Winners</div>
          <div class="text-right">Est. Payout</div>
        </div>

        <div class="space-y-1">
          <div
            v-for="div in draw.divisions"
            :key="div.match"
            class="grid grid-cols-4 items-center text-xs px-2 py-1.5 rounded-xl bg-white border border-[#EADBCC]/60"
          >
            <div class="font-bold text-[#2C211C] flex items-center gap-1">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#F6BD51]"></span>
              <span>Match {{ div.match }}</span>
            </div>
            <div class="text-center text-[10px] font-semibold text-[#786C65]">
              {{ div.percentage }}
            </div>
            <div class="text-center text-[10px] font-semibold text-[#2C211C]">
              {{ div.winners.toLocaleString() }}
            </div>
            <div class="text-right font-black text-[#2C211C]">
              {{ formatZAR(div.payout) }}
            </div>
          </div>
        </div>

        <p class="text-[9px] text-[#786C65] font-medium pt-1 text-center">
          *Payout amounts vary per draw according to actual ticket sales and prize rolldown rules.
        </p>
      </div>
    </div>
  </section>
</template>

