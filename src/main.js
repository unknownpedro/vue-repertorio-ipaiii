// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// IMPORTANTE: Inicializa a store antes de montar o app
const authStore = useAuthStore();
authStore.init().then(() => {
  app.mount('#app');
});