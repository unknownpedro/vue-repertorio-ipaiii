<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Escala {
    titulo: string;
    ministro: string;
    equipe: string[];
}

const escala = ref<Escala | null>(null);
const isLoading = ref(true);
const infoDomingo = ref("");

// --- LÓGICA PARA CALCULAR O PRÓXIMO DOMINGO ---
function calcularProximoDomingoOrdinal() {
    const hoje = new Date();
    const dataBusca = new Date(hoje);
    
    // Se hoje não for domingo (0), avançamos até o próximo
    if (hoje.getDay() !== 0) {
        dataBusca.setDate(hoje.getDate() + (7 - hoje.getDay()));
    }

    const dia = dataBusca.getDate();
    const mes = dataBusca.getMonth();
    
    // Calcula se é o 1º, 2º, 3º, 4º ou 5º domingo do mês
    const ordinal = Math.ceil(dia / 7);
    
    // Texto para exibir no card (ex: "1º Domingo de Março")
    const nomeMes = dataBusca.toLocaleDateString('pt-BR', { month: 'long' });
    infoDomingo.value = `${ordinal}º Domingo de ${nomeMes}`;
    
    return ordinal;
}

async function buscarEscala() {
    try {
        const ordinal = calcularProximoDomingoOrdinal();
        
        // Buscamos no Firestore o documento com ID "1", "2", etc.
        // Ou você pode usar um query(collection, where('ordem', '==', ordinal))
        const docRef = doc(db, "escalas_fixas", ordinal.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            escala.value = docSnap.data() as Escala;
        }
    } catch (error) {
        console.error("Erro ao buscar escala:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(buscarEscala);
</script>

<template>
    <div class="escala-card">
        <div class="header-escala">
            <span class="badge-domingo">{{ infoDomingo }}</span>
            <h3>Próxima Escala</h3>
        </div>

        <div v-if="isLoading" class="loader">Verificando calendário...</div>

        <div v-else-if="escala" class="escala-conteudo">
            <h4>{{ escala.titulo }}</h4>
            <p><strong>Líder:</strong> {{ escala.ministro }}</p>
            
            <div class="equipe-tags">
                <span v-for="membro in escala.equipe" :key="membro" class="tag">
                    {{ membro }}
                </span>
            </div>
        </div>

        <div v-else class="aviso">
            <p>Escala para este domingo ainda não definida.</p>
        </div>
    </div>
</template>

<style scoped>

.escala-card {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
    color: white;
}

.header-escala {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.badge-domingo {
    background: #42b883;
    color: #121412;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    width: fit-content;
    text-transform: uppercase;
}

.equipe-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag {
    background: #2a2a2a;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    border: 1px solid #444;
}

h4 {
    color: #42b883;
    margin-bottom: 5px;
}
</style>