<template>
  <div
    class="carnet-header flex flex-col gap-3 border-b border-secondary-button-background p-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 flex-wrap items-center gap-2">
      <router-link class="text-text-primary font-title text-xl font-bold" to="/"
        >Carnet de Meneur</router-link
      >
      <p class="text-text-detail text-xs">V0.1</p>
      <nav class="flex flex-wrap gap-4 text-text-primary font-body text-sm sm:pl-6 lg:pl-10">
        <router-link to="/">Sessions</router-link>
        <router-link to="/pnjs">Bibliothèque de PNJ</router-link>
      </nav>
    </div>
    <div class="flex flex-wrap items-center gap-3 text-xs text-text-detail sm:gap-5">
      <p>Table du {{ new Date().toLocaleDateString() }}</p>
      <p class="border bg-secondary-button-background p-2 text-text-secondary">MJ</p>
    </div>
  </div>
</template>
