<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  errorMsg.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)
    router.push('/home')
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMsg.value = 'E-mail ou senha inválidos.'
    } else {
      errorMsg.value = 'Ocorreu um erro ao tentar entrar. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-card">
      <h1>Entrar</h1>
      <br>
      
      <div class="input-group">
        <label>E-mail</label>
        <input 
          v-model="email" 
          type="email" 
          placeholder="exemplo@email.com" 
          required 
        />
      </div>

      <div class="input-group">
        <label>Senha</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="Sua senha" 
          required 
        />
      </div>
      <p><router-link class="inlinedecoration" to="/esqueci-senha">Esqueci minha senha</router-link></p>
      <br>
      <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

      <button :disabled="isLoading" type="submit">
        {{ isLoading ? 'Carregando...' : 'Entrar' }}
      </button>
      
      <p class="footer-link">
        Não tem uma conta? <router-link class="inlinedecoration" to="/register">Cadastre-se</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #121412;
}

.login-card {
  background: rgb(0, 0, 0);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.error-text {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.footer-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.inlinedecoration {
  text-decoration: none;
  font-size: 0.9rem;
  color: #227c35;
}
</style>