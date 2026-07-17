<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';
import { useAuth } from '../composables/useAuth';
import SeloStatus from '../components/SeloStatus.vue';
import BarraProgresso from '../components/BarraProgresso.vue';

const route = useRoute();
const router = useRouter();
const { usuario, ehOrganizador, ehDoador } = useAuth();

const campanha = ref(null);
const pontos = ref([]);
const itens = ref([]);
const carregando = ref(true);
const erro = ref('');
const mensagem = ref('');

const novoPonto = ref({ nome: '', endereco: '' });
const novoItem = ref({ nome: '', quantidadeNecessaria: 1 });
const erroFormularios = ref('');

const TRANSICOES_VALIDAS = {
  ABERTA: ['EM_ANDAMENTO', 'CANCELADA'],
  EM_ANDAMENTO: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
};

const ROTULOS_STATUS = {
  ABERTA: 'Marcar como em andamento',
  EM_ANDAMENTO: 'Concluir campanha',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};

const ehDono = computed(
  () => campanha.value && usuario.value && campanha.value.organizadorId === usuario.value.id,
);

const campanhaAtiva = computed(
  () => campanha.value && ['ABERTA', 'EM_ANDAMENTO'].includes(campanha.value.status),
);

const transicoesDisponiveis = computed(() => {
  if (!campanha.value) return [];
  return TRANSICOES_VALIDAS[campanha.value.status] || [];
});

async function carregarTudo() {
  carregando.value = true;
  erro.value = '';
  const id = route.params.id;
  try {
    const [dadosCampanha, dadosPontos, dadosItens] = await Promise.all([
      api.get(`/campanhas/${id}`),
      api.get(`/campanhas/${id}/pontos-coleta`),
      api.get(`/campanhas/${id}/itens-necessarios`),
    ]);
    campanha.value = dadosCampanha;
    pontos.value = dadosPontos;
    itens.value = dadosItens;
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

async function mudarStatus(novoStatus) {
  erro.value = '';
  try {
    await api.patch(`/campanhas/${campanha.value.id}/status`, { status: novoStatus });
    await carregarTudo();
    mensagem.value = 'Status da campanha atualizado.';
  } catch (e) {
    erro.value = e.message;
  }
}

async function criarPonto() {
  erroFormularios.value = '';
  try {
    await api.post('/pontos-coleta', {
      nome: novoPonto.value.nome,
      endereco: novoPonto.value.endereco,
      campanhaId: campanha.value.id,
    });
    novoPonto.value = { nome: '', endereco: '' };
    await carregarTudo();
  } catch (e) {
    erroFormularios.value = e.message;
  }
}

async function criarItem() {
  erroFormularios.value = '';
  try {
    await api.post('/itens-necessarios', {
      nome: novoItem.value.nome,
      quantidadeNecessaria: Number(novoItem.value.quantidadeNecessaria),
      campanhaId: campanha.value.id,
    });
    novoItem.value = { nome: '', quantidadeNecessaria: 1 };
    await carregarTudo();
  } catch (e) {
    erroFormularios.value = e.message;
  }
}

function irDoar(item) {
  router.push({
    path: '/doacoes/nova',
    query: {
      itemId: item.id,
      itemNome: item.nome,
      restante: item.quantidadeNecessaria - item.quantidadeArrecadada,
      campanhaId: campanha.value.id,
    },
  });
}

onMounted(carregarTudo);
</script>

<template>
  <div class="container">
    <p v-if="carregando" class="vazio">Carregando campanha…</p>

    <div v-else-if="erro && !campanha" class="mensagem-erro">{{ erro }}</div>

    <div v-else-if="campanha" class="secao">
      <router-link to="/campanhas" style="font-size: 0.85rem;">← Voltar para campanhas</router-link>

      <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem;">
        <h1 style="margin: 0;">{{ campanha.titulo }}</h1>
        <SeloStatus :status="campanha.status" />
      </div>
      <p style="color: var(--cor-tinta-suave)">{{ campanha.descricao }}</p>

      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>
      <div v-if="mensagem" class="mensagem-sucesso">{{ mensagem }}</div>

      <div v-if="ehDono && transicoesDisponiveis.length" style="margin: 1rem 0; display: flex; gap: 0.6rem;">
        <button
          v-for="opcao in transicoesDisponiveis"
          :key="opcao"
          class="botao"
          :class="opcao === 'CANCELADA' ? 'botao--perigo' : 'botao--primario'"
          @click="mudarStatus(opcao)"
        >
          {{ opcao === 'CANCELADA' ? 'Cancelar campanha' : ROTULOS_STATUS[campanha.status] }}
        </button>
      </div>

      <!-- Itens necessários -->
      <div class="secao">
        <h2>Itens necessários</h2>
        <ul v-if="itens.length" class="lista-simples">
          <li v-for="item in itens" :key="item.id">
            <div class="linha-item">
              <strong>{{ item.nome }}</strong>
              <button
                v-if="ehDoador() && campanhaAtiva"
                class="botao botao--acento"
                @click="irDoar(item)"
              >
                Doar
              </button>
            </div>
            <BarraProgresso :arrecadado="item.quantidadeArrecadada" :necessario="item.quantidadeNecessaria" />
          </li>
        </ul>
        <p v-else class="vazio">Nenhum item cadastrado ainda.</p>

        <form
          v-if="ehDono && campanhaAtiva"
          class="formulario"
          style="margin-top: 1rem;"
          @submit.prevent="criarItem"
        >
          <h3>Adicionar item</h3>
          <div class="campo">
            <label for="item-nome">Nome do item</label>
            <input id="item-nome" v-model="novoItem.nome" type="text" required />
          </div>
          <div class="campo">
            <label for="item-qtd">Quantidade necessária</label>
            <input id="item-qtd" v-model="novoItem.quantidadeNecessaria" type="number" min="1" required />
          </div>
          <button class="botao botao--primario" type="submit">Adicionar item</button>
        </form>
      </div>

      <!-- Pontos de coleta -->
      <div class="secao">
        <h2>Pontos de coleta</h2>
        <ul v-if="pontos.length" class="lista-simples">
          <li v-for="ponto in pontos" :key="ponto.id">
            <strong>{{ ponto.nome }}</strong>
            <div style="color: var(--cor-tinta-suave); font-size: 0.88rem;">{{ ponto.endereco }}</div>
          </li>
        </ul>
        <p v-else class="vazio">Nenhum ponto de coleta cadastrado ainda.</p>

        <form
          v-if="ehDono && campanhaAtiva"
          class="formulario"
          style="margin-top: 1rem;"
          @submit.prevent="criarPonto"
        >
          <h3>Adicionar ponto de coleta</h3>
          <div class="campo">
            <label for="ponto-nome">Nome</label>
            <input id="ponto-nome" v-model="novoPonto.nome" type="text" required />
          </div>
          <div class="campo">
            <label for="ponto-endereco">Endereço</label>
            <input id="ponto-endereco" v-model="novoPonto.endereco" type="text" required />
          </div>
          <button class="botao botao--primario" type="submit">Adicionar ponto</button>
        </form>
      </div>

      <div v-if="erroFormularios" class="mensagem-erro">{{ erroFormularios }}</div>
    </div>
  </div>
</template>
