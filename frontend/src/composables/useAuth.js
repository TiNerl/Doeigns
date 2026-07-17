import { ref } from 'vue';
import { api } from '../services/api';

const usuario = ref(carregarUsuarioSalvo());
const token = ref(localStorage.getItem('token') || null);

function carregarUsuarioSalvo() {
  const bruto = localStorage.getItem('usuario');
  return bruto ? JSON.parse(bruto) : null;
}

function definirSessao(dados) {
  token.value = dados.access_token;
  usuario.value = dados.usuario;
  localStorage.setItem('token', dados.access_token);
  localStorage.setItem('usuario', JSON.stringify(dados.usuario));
}

async function login(email, senha) {
  const dados = await api.post('/auth/login', { email, senha });
  definirSessao(dados);
}

async function registrar(nome, email, senha, papel) {
  const dados = await api.post('/auth/registro', { nome, email, senha, papel });
  definirSessao(dados);
}

function logout() {
  token.value = null;
  usuario.value = null;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function useAuth() {
  return {
    usuario,
    token,
    estaAutenticado: () => !!token.value,
    ehOrganizador: () => usuario.value?.papel === 'ORGANIZADOR',
    ehDoador: () => usuario.value?.papel === 'DOADOR',
    login,
    registrar,
    logout,
  };
}
