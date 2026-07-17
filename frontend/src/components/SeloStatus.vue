<script setup>
const props = defineProps({
  status: { type: String, required: true },
});

const ROTULOS = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};
</script>

<template>
  <span class="selo-status" :class="`selo-status--${status}`">
    <svg
      v-if="status === 'ABERTA'"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path
        d="M12 10c0-4-3-6-6-6 0 4 2 6 6 6z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
    <svg
      v-else-if="status === 'EM_ANDAMENTO'"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M12 21V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M12 8c0-4-3-6-6-6 0 4 2 6 6 6z" fill="currentColor" opacity="0.85" />
      <path d="M12 12c0-4 3-6 6-6 0 4-2 6-6 6z" fill="currentColor" opacity="0.6" />
    </svg>
    <svg
      v-else-if="status === 'CONCLUIDA'"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M12 21V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <circle cx="12" cy="7" r="6" fill="currentColor" opacity="0.85" />
    </svg>
    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path
        d="M12 10c0-3-2-4-4-3 0 3 1 4 4 3z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
    {{ ROTULOS[status] || status }}
  </span>
</template>
