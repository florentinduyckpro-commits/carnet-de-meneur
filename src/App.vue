<script setup lang="ts">
import CarnetHeader from './components/CarnetHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <CarnetHeader />
    <main class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
