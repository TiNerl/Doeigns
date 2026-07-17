import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', redirect: '/campanhas' },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/registro', name: 'registro', component: () => import('../views/RegistroView.vue') },
  {
    path: '/campanhas',
    name: 'campanhas',
    component: () => import('../views/CampanhasView.vue'),
  },
  {
    path: '/campanhas/nova',
    name: 'nova-campanha',
    component: () => import('../views/NovaCampanhaView.vue'),
    meta: { requerAutenticacao: true, papel: 'ORGANIZADOR' },
  },
  {
    path: '/campanhas/:id',
    name: 'campanha-detalhe',
    component: () => import('../views/CampanhaDetalheView.vue'),
  },
  {
    path: '/doacoes/nova',
    name: 'nova-doacao',
    component: () => import('../views/NovaDoacaoView.vue'),
    meta: { requerAutenticacao: true, papel: 'DOADOR' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { estaAutenticado, usuario } = useAuth();

  if (to.meta.requerAutenticacao && !estaAutenticado()) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (to.meta.papel && usuario.value?.papel !== to.meta.papel) {
    return { path: '/campanhas' };
  }

  return true;
});

export default router;
