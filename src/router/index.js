// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; // Verifique o nome do arquivo
import LoginView from '../pages/LoginView.vue'; 

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/RegisterView.vue')
  },
  {
    path: '/esqueci-senha',
    name: 'esqueci-senha',
    component: () => import('../pages/ForgotPassword.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
];

// VOCÊ PRECISA DESTA PARTE AQUI (que está faltando na imagem 4):
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Agora sim o 'router' existe e você pode usar o beforeEach
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.user; // Use .user que é o que definimos na store

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;