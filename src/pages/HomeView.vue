<script setup lang="ts">
import ProxEscala from '@/components/proxEscala.vue';
import TopBar from '@/components/topBar.vue';

</script>

<template>
    <TopBar />
    <div class="dashboard">
        <ProxEscala />
    </div>
</template>

<style scoped>
.dashboard {
    padding: 20px;
}
</style>