<template>
  <router-view />

  <GlobalConfirmModal />
  <GlobalToast />
</template>

<script setup lang="ts">
import GlobalConfirmModal from './components/ui/GlobalConfirmModal.vue'
import GlobalToast from './components/ui/GlobalToast.vue'
</script>

<style></style>
