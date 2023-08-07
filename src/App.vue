<script setup lang="ts">
import { onMounted } from 'vue';
import LayoutMain from './LayoutMain.vue'
import OpenLayerMap from '@/components/OpenLayerMap.vue'
import * as bootstrap from 'bootstrap'


onMounted(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    return [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

</script>

<template>
    <main>
        <LayoutMain>
            <OpenLayerMap />
        </LayoutMain>
    </main>
</template>
