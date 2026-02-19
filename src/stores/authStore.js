import { defineStore } from 'pinia';
import { auth } from '../firebase'; // Verifique se o caminho está certo
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    // ESSA É A FUNÇÃO QUE ESTAVA FALTANDO:
    init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user;
          resolve(user);
        });
      });
    },
    async login(email, password) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    }
  }
});