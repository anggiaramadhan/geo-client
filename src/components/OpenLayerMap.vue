<template>
    <div id="map">
        <MenuSidebar />
    </div>
</template>

<script setup lang="ts">
import 'ol/ol.css'
import { useBaseMapStore } from '@/stores/baseMap'
import { onMounted } from 'vue'

import MenuSidebar from '@/components/MenuSidebar.vue'

const store = useBaseMapStore()

onMounted(() => {
    store.initializeMap();
})
</script>

<style>
#map {
    position: relative;
    height: 100vh;
    width: 100%;
}
</style>
