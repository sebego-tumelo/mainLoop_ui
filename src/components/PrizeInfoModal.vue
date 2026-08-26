<script setup>
import { ShieldCheck, X, Coins, Trophy, ExternalLink } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    v-if="isOpen"
    id="modal-prize-info"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
  >
    <div
      id="modal-prize-container"
      class="w-full max-w-md bg-white border border-[#E7DFD5] rounded-3xl shadow-xl p-5 relative overflow-hidden max-h-[90vh] overflow-y-auto text-[#2C211C]"
    >
      <div class="flex items-center justify-between pb-3 border-b border-[#E7DFD5] mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-[#FFF3D9] border border-[#F6BD51]/40 flex items-center justify-center text-[#2C211C]">
            <ShieldCheck class="w-4 h-4 text-[#F6BD51]" />
          </div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-wider text-[#2C211C]">
              DAILY LOTTO RULES & PAYOUTS
            </h3>
            <p class="text-[10px] text-[#786C65] font-semibold">
              Official South African National Lottery Framework
            </p>
          </div>
        </div>

        <button
          id="btn-close-prize-modal"
          @click="onClose"
          class="p-1 rounded-full text-[#786C65] hover:text-[#2C211C] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs text-[#2C211C]">
        <!-- Game Structure -->
        <div class="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-1">
          <div class="font-extrabold text-[#2C211C] flex items-center gap-1.5 text-xs">
            <Trophy class="w-3.5 h-3.5 text-[#F6BD51]" />
            <span>Game Matrix: 5 / 36</span>
          </div>
          <p class="text-[#786C65] leading-relaxed text-[11px] font-medium">
            Players select 5 numbers between 1 and 36. Daily draws occur every evening at
            <strong class="text-[#2C211C]"> 21:00 SAST</strong> (South Africa Standard Time).
          </p>
        </div>

        <!-- Cost Rules -->
        <div class="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-1">
          <div class="font-extrabold text-[#2C211C] flex items-center gap-1.5 text-xs">
            <Coins class="w-3.5 h-3.5 text-[#F6BD51]" />
            <span>Ticket Cost & Strategy Structure</span>
          </div>
          <p class="text-[#786C65] leading-relaxed text-[11px] font-medium">
            Each single board costs <strong class="text-[#2C211C]">R3.00</strong>.
            A standard AI recommendation session plays <strong class="text-[#2C211C]">3 boards (R9.00 total)</strong> to maximize combinatoric delta coverage.
          </p>
        </div>

        <!-- Divisions Breakdown -->
        <div class="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] space-y-2">
          <div class="font-extrabold text-[#2C211C] text-xs">Official Prize Divisions</div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between py-1 border-b border-[#EADBCC] text-[#786C65]">
              <span>Match 5 (Division 1 - Jackpot)</span>
              <span class="text-[#2C211C] font-black">35.6% (~R160k+)</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#EADBCC] text-[#786C65]">
              <span>Match 4 (Division 2)</span>
              <span class="text-[#2C211C] font-black">33.7% (~R420)</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#EADBCC] text-[#786C65]">
              <span>Match 3 (Division 3)</span>
              <span class="text-[#2C211C] font-black">21.4% (~R22)</span>
            </div>
            <div class="flex justify-between py-1 text-[#786C65]">
              <span>Match 2 (Division 4)</span>
              <span class="text-[#2C211C] font-black">9.3% (~R6)</span>
            </div>
          </div>
        </div>

        <!-- Rolldown Feature -->
        <div class="p-3.5 rounded-2xl bg-[#FFF9E6] border border-[#F6BD51]/50 text-[11px] text-[#784A0E] space-y-1 font-medium">
          <div class="font-bold text-[#2C211C] flex items-center gap-1">
            <ExternalLink class="w-3 h-3 text-[#F6BD51]" />
            <span>Guaranteed Daily Payout (Rolldown Rule)</span>
          </div>
          <p>
            If nobody matches all 5 numbers in Division 1, the entire jackpot rolls down automatically to Division 2 (Match 4), significantly boosting medium-tier payouts!
          </p>
        </div>

        <button
          id="btn-confirm-prize-info"
          @click="onClose"
          class="w-full py-3 rounded-full bg-[#F6BD51] hover:bg-[#F4B238] text-[#2C211C] font-black text-xs uppercase tracking-wider transition-colors border border-[#E5A836] cursor-pointer shadow-xs"
        >
          Close & Return
        </button>
      </div>
    </div>
  </div>
</template>

