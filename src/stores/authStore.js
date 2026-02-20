import { defineStore } from 'pinia';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    loading: true
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
    },
    async register(email, password, name) {
    // 1. Cria o usuário no Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Cria o documento do usuário no Firestore com a role padrão
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: 'user', // Todo mundo começa como user
      createdAt: new Date()
    });
      this.user = user;
    },
    async fetchUserRole(uid) {
      const db = getFirestore();
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        this.role = docSnap.data().role;
      }
    },
    initialize() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user;
          await this.fetchUserRole(user.uid);
        } else {
          this.user = null;
          this.role = null;
        }
        this.loading = false;
      });
    }
  }
});

