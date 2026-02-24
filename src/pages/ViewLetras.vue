<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import TopBar from '@/components/TopBar.vue';

interface Musica {
    nome: string;
    artista: string;
    tom: string;
    letra: string;
    link: string;
}

const route = useRoute();
const router = useRouter();
const musica = ref<Musica | null>(null);
const isLoading = ref(true);

async function carregarMusica() {
    const musicaId = route.params.id as string;

    if (!musicaId) {
        router.push('/musicas-listas');
        return;
    }

    try {
        const docRef = doc(db, "musicas", musicaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            musica.value = docSnap.data() as Musica;
            
            document.title = `Letra - ${musica.value.nome}`;
        } else {
            console.error("Música não encontrada!");           
        }
    } catch (error) {
        console.error("Erro ao carregar letra:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    carregarMusica();
});
</script>

<template>
    <TopBar />

    <div class="view-container">
        <div v-if="isLoading" class="loading"></div>
        

        <div v-else-if="musica" class="conteudo-musica">
            
            <header class="musica-header">
                <h1 id="viewTitulo">{{ musica.nome }}</h1>
                <p id="viewArtista"><strong>Artista:</strong> {{ musica.artista || 'Não informado' }}</p>
                <p id="viewTom"><strong>Tom:</strong> {{ musica.tom || 'N/A' }}</p>
            </header>
            <br>

            <hr />

            <pre id="viewLetra" class="letra-corpo">{{ musica.letra }}</pre>
            
            <button @click="router.back()" class="btn-voltar">Voltar</button>
        </div>

        <div v-else class="error">
            <p>Música não encontrada.</p>
            <button @click="router.push('/')">Voltar para Início</button>
        </div>
    </div>
</template>

<style scoped>
.loading {
  /* Tamanho e espessura da borda */
  width: 100%;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 5px solid #b5cabd;
  border-bottom-color: #3b7545; /* A cor do detalhe que gira */
  border-radius: 50%;
  display: flex;
  box-sizing: border-box;
  
  /* Chamada da animação: nome, duração, tipo de transição e repetição */
  animation: rotation 1s linear infinite;
}

/* Definição do movimento */
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.view-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    color: #e0e0e0;
}

.musica-header h1 {
    color: #42b883;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.letra-corpo {
    font-family: 'Inter', sans-serif; 
    font-size: 1.2rem;
    line-height: 1.6;
    white-space: pre-wrap; 
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
}

.btn-voltar {
    margin-top: 2rem;
    padding: 0.8rem 1.5rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-voltar:hover {
    background-color: #444;
}

.exibicao-letra {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 45px;
}

#viewArtista {
    padding-top: 10px;
}

#viewTom {
    padding-top: 15px;
    padding-bottom: 10px;
}

#viewLetra {
    padding-bottom: 30px;
}
</style>