<script setup>
import { ref, watch, onMounted } from 'vue';
import { api } from '../services/api';
import SeloStatus from '../components/SeloStatus.vue';

const campanhas = ref([]);
const total = ref(0);
const pagina = ref(1);
const limite = 6;
const statusFiltro = ref('');
const carregando = ref(true);
const erro = ref('');

async function carregar() {
  carregando.value = true;
  erro.value = '';
  try {
    const query = new URLSearchParams({ page: pagina.value, limit: limite });
    if (statusFiltro.value) query.set('status', statusFiltro.value);
    const dados = await api.get(`/campanhas?${query.toString()}`);
    campanhas.value = dados.dados;
    total.value = dados.total;
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

function totalPaginas() {
  return Math.max(1, Math.ceil(total.value / limite));
}

function irPara(novaPagina) {
  if (novaPagina < 1 || novaPagina > totalPaginas()) return;
  pagina.value = novaPagina;
}

watch(statusFiltro, () => {
  pagina.value = 1;
  carregar();
});
watch(pagina, carregar);

onMounted(carregar);
</script>

<template>
  <div class="container">
    <div class="secao">
      <h1>Campanhas solidárias</h1>
      <p style="color: var(--cor-tinta-suave)">
        Acompanhe campanhas ativas e veja onde sua doação ajuda a completar uma meta.
      </p>

      <div class="barra-filtro">
        <div class="campo">
          <label for="filtro-status">Filtrar por status</label>
          <select id="filtro-status" v-model="statusFiltro">
            <option value="">Todas</option>
            <option value="ABERTA">Aberta</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        <router-link to="/campanhas/nova" class="botao botao--acento">
          + Nova campanha
        </router-link>
      </div>

      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

      <p v-if="carregando" class="vazio">Carregando campanhas…</p>

      <template v-else>
        <div v-if="campanhas.length === 0" class="vazio">
          Nenhuma campanha encontrada com esse filtro.
        </div>

        <div v-else class="grade-campanhas">
          <router-link
            v-for="campanha in campanhas"
            :key="campanha.id"
            :to="`/campanhas/${campanha.id}`"
            class="cartao cartao-campanha"
          >
            <SeloStatus :status="campanha.status" />
            <span class="cartao-campanha__titulo">{{ campanha.titulo }}</span>
            <span class="cartao-campanha__descricao">{{ campanha.descricao }}</span>
          </router-link>
        </div>

        <div class="paginacao" v-if="total > limite">
          <button class="botao botao--fantasma" @click="irPara(pagina - 1)" :disabled="pagina === 1">
            ← Anterior
          </button>
          <span>Página {{ pagina }} de {{ totalPaginas() }}</span>
          <button
            class="botao botao--fantasma"
            @click="irPara(pagina + 1)"
            :disabled="pagina === totalPaginas()"
          >
            Próxima →
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
