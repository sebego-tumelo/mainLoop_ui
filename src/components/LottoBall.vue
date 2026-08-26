<script setup>
import { computed } from 'vue';

const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
  isMatched: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'gold' | 'peach' | 'mint' | 'lavender' | 'rose' | 'accent'
  },
  className: {
    type: String,
    default: '',
  },
});

const formattedNumber = computed(() => {
  return String(props.number).padStart(2, '0');
});

const sizeClasses = {
  sm: 'w-7 h-7 text-xs font-bold',
  md: 'w-9 h-9 sm:w-10 sm:h-10 text-sm font-extrabold shadow-sm',
  lg: 'w-11 h-11 sm:w-12 sm:h-12 text-base font-black shadow-md',
};

const colorClasses = computed(() => {
  if (props.isMatched) {
    return 'bg-[#F6BD51] text-[#2C211C] border-2 border-[#2C211C] shadow-md ring-2 ring-[#F6BD51]/60 font-black';
  } else if (props.variant === 'gold') {
    return 'bg-gradient-to-b from-[#FED17A] to-[#F6BD51] text-[#2C211C] border border-[#E5A836] shadow-sm';
  } else if (props.variant === 'peach') {
    return 'bg-[#FFB59E] text-[#6B2F1F] border border-[#EFA38B]';
  } else if (props.variant === 'mint') {
    return 'bg-[#B7E1D2] text-[#1D4F3E] border border-[#9FD3C1]';
  } else if (props.variant === 'lavender') {
    return 'bg-[#D2CFF7] text-[#3D3577] border border-[#BBB7EE]';
  } else if (props.variant === 'rose') {
    return 'bg-[#F8B6B7] text-[#712233] border border-[#E99FA1]';
  } else if (props.variant === 'accent') {
    return 'bg-[#FFF3D9] text-[#784A0E] border border-[#F6BD51] font-bold';
  } else {
    return 'bg-white text-[#2C221E] border border-[#E7DFD5] shadow-xs';
  }
});
</script>

<template>
  <div
    :class="[
      'relative inline-flex items-center justify-center rounded-full select-none transition-transform duration-150 hover:scale-105',
      sizeClasses[size] || sizeClasses.md,
      colorClasses,
      className,
    ]"
  >
    <!-- Specular ball gloss highlight -->
    <span class="absolute top-1 left-2 w-2 h-1 bg-white/50 rounded-full blur-[0.4px] pointer-events-none" />
    <span class="relative z-10 tracking-tight font-mono">{{ formattedNumber }}</span>
    <span v-if="isMatched" class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F6BD51] opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2C211C] text-white text-[8px] font-bold items-center justify-center border border-white">✓</span>
    </span>
  </div>
</template>

