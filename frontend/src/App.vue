<script setup>
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router';

const { usuario, estaAutenticado, ehOrganizador, logout } = useAuth();
const router = useRouter();

function sair() {
  logout();
  router.push('/login');
}
</script>

<template>
  <header class="cabecalho">
    <div class="cabecalho__conteudo">
      <router-link to="/campanhas" class="cabecalho__marca">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 21V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M12 8c0-4-3-6-6-6 0 4 2 6 6 6z" fill="currentColor" />
          <path d="M12 12c0-4 3-6 6-6 0 4-2 6-6 6z" fill="currentColor" opacity="0.6" />
        </svg>
        Rede de Doações
      </router-link>

      <nav class="cabecalho__nav">
        <router-link to="/campanhas">Campanhas</router-link>
        <router-link v-if="ehOrganizador()" to="/campanhas/nova">Nova campanha</router-link>
      </nav>

      <div class="cabecalho__usuario">
        <template v-if="estaAutenticado()">
          <span>{{ usuario?.nome }}</span>
          <button class="botao botao--fantasma" @click="sair">Sair</button>
        </template>
        <template v-else>
          <router-link to="/login" class="botao botao--fantasma">Entrar</router-link>
          <router-link to="/registro" class="botao botao--primario">Criar conta</router-link>
        </template>
      </div>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <footer class="rodape-pagina">Rede de Doações e Campanhas Solidárias — projeto acadêmico</footer>
</template>
