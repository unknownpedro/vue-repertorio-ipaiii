<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function handleRegister() {
  errorMsg.value = ''
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'As senhas não coincidem.'
    return
  }

  isLoading.value = true
  try {
    await authStore.register(email.value, password.value, name.value)
    router.push('/home')
  } catch (error) {
    errorMsg.value = 'Erro ao criar conta. Verifique os dados ou se o e-mail já existe.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container"> <form @submit.prevent="handleRegister" class="login-card">
      <h1>Criar Conta</h1>
      <br>
      
      <div class="input-group">
        <label>Nome Completo</label>
        <input v-model="name" type="text" placeholder="Seu nome" required />
      </div>

      <div class="input-group">
        <label>E-mail</label>
        <input v-model="email" type="email" placeholder="exemplo@email.com" required />
      </div>

      <div class="input-group">
        <label>Senha</label>
        <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" required />
      </div>

      <div class="input-group">
        <label>Confirmar Senha</label>
        <input v-model="confirmPassword" type="password" placeholder="Repita a senha" required />
      </div>

      <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

      <button :disabled="isLoading" type="submit">
        {{ isLoading ? 'Criando conta...' : 'Cadastrar' }}
      </button>
      
      <p class="footer-link">
        Já tem uma conta? <router-link class="inlinedecoration"to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<style>
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
  color: red;
}

.footer-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.inlinedecoration {
  text-decoration: none;
  font-size: 0.9rem;
  color: #227c35;
}
</style>