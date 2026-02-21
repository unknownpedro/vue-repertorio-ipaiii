import { defineStore } from 'pinia';
import { auth, db } from '../firebase'; // Certifique-se que o caminho está correto
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Importamos o getDoc aqui

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    loading: true
  }),
  
  actions: {
    // 1. Busca o cargo do usuário no Firestore
    async fetchUserRole(uid) {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef); // CORRIGIDO: Era setDoc
        
        if (docSnap.exists()) {
          this.role = docSnap.data().role;
        } else {
          this.role = 'user'; // Fallback caso o doc não exista
        }
      } catch (e) {
        console.error("Erro ao buscar role:", e);
        this.role = 'user';
      }
    },

    // 2. Registro: Cria no Auth e depois no Firestore
    async register(email, password, name) {
      // O createUser retorna um objeto com a propriedade 'user'
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Grava no Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        name: name,
        email: email,
        role: 'user',
        violao: false,
        teclado: false,
        bateria: false,
        vocal: false,
        createdAt: new Date()
      });

      // Atualiza o estado local imediatamente
      this.user = newUser;
      this.role = 'user'; 
    },

    // 3. Login
    async login(email, password) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
      await this.fetchUserRole(this.user.uid); // Busca o cargo logo após logar
    },

    // 4. Logout
    async logout() {
      await signOut(auth);
      this.user = null;
      this.role = null;
    },

    // 5. Inicialização (Unificada)
    // Chame isso no App.vue ou no main.js
    initialize() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.loading = true;
          if (user) {
            this.user = user;
            await this.fetchUserRole(user.uid);
          } else {
            this.user = null;
            this.role = null;
          }
          this.loading = false;
          resolve(user);
        });
      });
    }
  }
});