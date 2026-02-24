<script setup lang="ts">
import ProxEscala from '@/components/ProxEscala.vue';
import TopBar from '@/components/TopBar.vue';
import ProxRepertorio from '@/components/ProxRepertorio.vue';

</script>

<template>
    <TopBar />
    <div class="dashboard">
        <div class="temProxEscala"><ProxEscala /></div>
        <div class="temProxRepertorio"><ProxRepertorio /></div>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 20px;
    gap: 20px;
    display: flex;
    flex-direction: column;
}


</style>