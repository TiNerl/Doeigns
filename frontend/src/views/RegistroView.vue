<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const nome = ref('');
const email = ref('');
const senha = ref('');
const papel = ref('DOADOR');
const carregando = ref(false);
const erro = ref('');

const router = useRouter();
const { registrar } = useAuth();

async function enviar() {
  erro.value = '';
  carregando.value = true;
  try {
    await registrar(nome.value, email.value, senha.value, papel.value);
    router.push('/campanhas');
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
      <h1>Criar conta</h1>
      <p style="color: var(--cor-tinta-suave)">
        Escolha o perfil de doador para contribuir com campanhas, ou organizador para criá-las.
      </p>

      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>

      <form class="formulario" @submit.prevent="enviar">
        <div class="campo">
          <label for="nome">Nome</label>
          <input id="nome" v-model="nome" type="text" required />
        </div>
        <div class="campo">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" />
        </div>
        <div class="campo">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
          />
          <small>Mínimo de 8 caracteres.</small>
        </div>
        <div class="campo">
          <label for="papel">Perfil</label>
          <select id="papel" v-model="papel">
            <option value="DOADOR">Doador</option>
            <option value="ORGANIZADOR">Organizador de campanhas</option>
          </select>
        </div>
        <button class="botao botao--primario" type="submit" :disabled="carregando">
          {{ carregando ? 'Criando conta…' : 'Criar conta' }}
        </button>
      </form>

      <p style="margin-top: 1.5rem; font-size: 0.9rem;">
        Já tem conta? <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>
