<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase'; // Ajuste o caminho conforme seu projeto
import { doc, getDoc } from 'firebase/firestore';
import TopBar from '@/components/topBar.vue';

// 1. Definição da Interface para o TypeScript
interface Musica {
    nome: string;
    artista: string;
    tom: string;
    letra: string;
}

const route = useRoute();
const router = useRouter();
const musica = ref<Musica | null>(null);
const isLoading = ref(true);

async function carregarMusica() {
    // 2. Pegar o ID da rota (ex: /musica/:id) em vez da query string
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
            
            // Alterar o título da aba
            document.title = `Letra - ${musica.value.nome}`;
        } else {
            console.error("Música não encontrada!");
            // Opcional: redirecionar se não existir
            // router.push('/404');
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
        <div v-if="isLoading" class="loading">Carregando letra...</div>

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
    font-family: 'Inter', sans-serif; /* Ou sua fonte preferida */
    font-size: 1.2rem;
    line-height: 1.6;
    white-space: pre-wrap; /* Importante para quebrar linha se o texto for longo */
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