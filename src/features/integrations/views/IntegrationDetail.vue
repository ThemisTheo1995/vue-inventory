<template>
  <div class="min-h-full">
    <transition name="fade" mode="out-in">
      <component :is="activeView" :key="platformId" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Marketplace Views
import EbayIntegration from '../../ebay/views/Index.vue'
import IntegrationNotFound from './IntegrationNotFound.vue'

const route = useRoute()

/**
 * Extract the ID from the route.
 * If the URL is just /integration/ without an ID, or the ID is missing,
 * it will return an empty string or undefined.
 */
const platformId = computed(() => (route.params.id as string)?.toLowerCase())

const activeView = computed(() => {
  // 1. Guard against missing ID
  if (!platformId.value) {
    return IntegrationNotFound
  }

  // 2. Route to specific marketplace
  switch (platformId.value) {
    case 'ebay':
      return EbayIntegration
    
    // Future expansion:
    // case 'amazon': return AmazonIntegration
    
    // 3. Fallback for IDs that aren't mapped yet (e.g. /integration/walmart)
    default:
      return IntegrationNotFound
  }
})
</script>

<style scoped>
/* Smooth transition between views */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
