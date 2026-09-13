<template>
  <router-view />

  <GlobalConfirmModal />
  <GlobalToast />
  <GlobalTooltip />
</template>

<script setup lang="ts">
import GlobalConfirmModal from './components/ui/GlobalConfirmModal.vue'
import GlobalToast from './components/ui/GlobalToast.vue'
import GlobalTooltip from './components/ui/GlobalTooltip.vue';
</script>

<style></style>
