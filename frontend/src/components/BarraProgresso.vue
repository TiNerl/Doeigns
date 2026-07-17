<script setup>
import { computed } from 'vue';

const props = defineProps({
  arrecadado: { type: Number, required: true },
  necessario: { type: Number, required: true },
});

const percentual = computed(() => {
  if (props.necessario <= 0) return 0;
  return Math.min(100, Math.round((props.arrecadado / props.necessario) * 100));
});
</script>

<template>
  <div class="progresso">
    <div class="progresso__rotulo">
      <span>{{ arrecadado }} / {{ necessario }}</span>
      <span>{{ percentual }}%</span>
    </div>
    <div class="progresso__trilha">
      <div class="progresso__preenchimento" :style="{ width: percentual + '%' }" />
    </div>
  </div>
</template>
