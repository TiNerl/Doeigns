<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, BASE_URL } from '../services/api';

const route = useRoute();
const router = useRouter();

const itemId = route.query.itemId || '';
const itemNome = route.query.itemNome || '';
const restante = route.query.restante ? Number(route.query.restante) : null;
const campanhaId = route.query.campanhaId || '';

const quantidade = ref(1);
const carregando = ref(false);
const erro = ref('');

const doacaoCriada = ref(null);
const arquivo = ref(null);
const enviandoComprovante = ref(false);
const comprovanteEnviado = ref(false);
const erroComprovante = ref('');

const temItemSelecionado = computed(() => !!itemId);

async function registrarDoacao() {
  erro.value = '';
  carregando.value = true;
  try {
    doacaoCriada.value = await api.post('/doacoes', {
      itemId,
      quantidade: Number(quantidade.value),
    });
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}

function selecionarArquivo(evento) {
  arquivo.value = evento.target.files[0] || null;
}

async function enviarComprovante() {
  if (!arquivo.value) return;
  erroComprovante.value = '';
  enviandoComprovante.value = true;
  try {
    const formData = new FormData();
    formData.append('arquivo', arquivo.value);
    await api.post(`/doacoes/${doacaoCriada.value.id}/comprovante`, formData, { formData: true });
    comprovanteEnviado.value = true;
  } catch (e) {
    erroComprovante.value = e.message;
  } finally {
    enviandoComprovante.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="secao">
      <router-link
        :to="campanhaId ? `/campanhas/${campanhaId}` : '/campanhas'"
        style="font-size: 0.85rem;"
      >
        ← Voltar para a campanha
      </router-link>
      <h1 style="margin-top: 0.75rem;">Registrar doação</h1>

      <div v-if="!temItemSelecionado" class="mensagem-erro">
        Nenhum item selecionado. Volte a uma campanha e escolha um item para doar.
      </div>

      <template v-else-if="!doacaoCriada">
        <div class="cartao" style="margin-bottom: 1.25rem; max-width: 460px;">
          <strong>{{ itemNome }}</strong>
          <p v-if="restante !== null" style="margin: 0.3rem 0 0; color: var(--cor-tinta-suave); font-size: 0.88rem;">
            Restam {{ restante }} unidades para completar a meta.
          </p>
        </div>

        <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

        <form class="formulario" @submit.prevent="registrarDoacao">
          <div class="campo">
            <label for="quantidade">Quantidade que você vai doar</label>
            <input id="quantidade" v-model="quantidade" type="number" min="1" required />
          </div>
          <button class="botao botao--primario" type="submit" :disabled="carregando">
            {{ carregando ? 'Registrando…' : 'Registrar doação' }}
          </button>
        </form>
      </template>

      <template v-else>
        <div class="mensagem-sucesso">
          Doação registrada! Agora envie o comprovante (imagem ou PDF, até 5MB) para o organizador confirmar.
        </div>

        <div v-if="!comprovanteEnviado" class="formulario">
          <div class="campo">
            <label for="comprovante">Comprovante</label>
            <input id="comprovante" type="file" accept=".jpg,.jpeg,.png,.pdf" @change="selecionarArquivo" />
            <small>Formatos aceitos: JPEG, PNG ou PDF.</small>
          </div>
          <div v-if="erroComprovante" class="mensagem-erro">{{ erroComprovante }}</div>
          <button
            class="botao botao--primario"
            type="button"
            :disabled="!arquivo || enviandoComprovante"
            @click="enviarComprovante"
          >
            {{ enviandoComprovante ? 'Enviando…' : 'Enviar comprovante' }}
          </button>
        </div>

        <div v-else>
          <p class="mensagem-sucesso">Comprovante enviado com sucesso.</p>
          <router-link
            class="botao botao--fantasma"
            :to="campanhaId ? `/campanhas/${campanhaId}` : '/campanhas'"
          >
            Voltar para a campanha
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>
