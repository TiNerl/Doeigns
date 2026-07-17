<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const email = ref('');
const senha = ref('');
const carregando = ref(false);
const erro = ref('');

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

async function enviar() {
  erro.value = '';
  carregando.value = true;
  try {
    await login(email.value, senha.value);
    router.push(route.query.redirect || '/campanhas');
  } catch (e) {
    erro.value = e.message;
  } finally {
    carregando.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="secao" style="max-width: 420px; margin: 3rem auto 0;">
      <h1>Entrar</h1>
      <p style="color: var(--cor-tinta-suave)">
        Acesse sua conta para acompanhar campanhas e registrar doações.
      </p>

      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

      <form class="formulario" @submit.prevent="enviar">
        <div class="campo">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" />
        </div>
        <div class="campo">
          <label for="senha">Senha</label>
          <input id="senha" v-model="senha" type="password" required autocomplete="current-password" />
        </div>
        <button class="botao botao--primario" type="submit" :disabled="carregando">
          {{ carregando ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p style="margin-top: 1.5rem; font-size: 0.9rem;">
        Ainda não tem conta? <router-link to="/registro">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>
