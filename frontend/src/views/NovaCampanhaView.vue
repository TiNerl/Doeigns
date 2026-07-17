<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const titulo = ref('');
const descricao = ref('');
const dataInicio = ref(new Date().toISOString().slice(0, 10));
const dataFim = ref('');
const carregando = ref(false);
const erro = ref('');

const router = useRouter();

async function enviar() {
  erro.value = '';
  carregando.value = true;
  try {
    const campanha = await api.post('/campanhas', {
      titulo: titulo.value,
      descricao: descricao.value,
      dataInicio: new Date(dataInicio.value).toISOString(),
      dataFim: dataFim.value ? new Date(dataFim.value).toISOString() : undefined,
    });
    router.push(`/campanhas/${campanha.id}`);
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="secao">
      <router-link to="/campanhas" style="font-size: 0.85rem;">← Voltar para campanhas</router-link>
      <h1 style="margin-top: 0.75rem;">Nova campanha</h1>
      <p style="color: var(--cor-tinta-suave)">
        Descreva o problema que a campanha resolve — depois disso você poderá adicionar itens
        necessários e pontos de coleta.
      </p>

      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

      <form class="formulario" @submit.prevent="enviar">
        <div class="campo">
          <label for="titulo">Título</label>
          <input id="titulo" v-model="titulo" type="text" required />
        </div>
        <div class="campo">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="descricao" rows="4" required></textarea>
        </div>
        <div class="campo">
          <label for="data-inicio">Data de início</label>
          <input id="data-inicio" v-model="dataInicio" type="date" required />
        </div>
        <div class="campo">
          <label for="data-fim">Data de encerramento (opcional)</label>
          <input id="data-fim" v-model="dataFim" type="date" />
        </div>
        <button class="botao botao--primario" type="submit" :disabled="carregando">
          {{ carregando ? 'Criando…' : 'Criar campanha' }}
        </button>
      </form>
    </div>
  </div>
</template>
