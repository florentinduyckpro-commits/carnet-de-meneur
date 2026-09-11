<template>
  <div
    class="flex flex-col gap-4 bg-component-background p-4 border border-secondary-button-background"
  >
    <div class="flex flex-wrap items-center gap-4">
      <img
        class="w-[76px] h-[94px] border border-secondary-button-background bg-secondary-button-background"
        :src="pnj.image"
        alt="Portrait"
      />
      <div class="flex min-w-0 flex-col gap-2">
        <h1 class="text-text-primary font-title font-bold text-lg">
          {{ pnj.nom }}
        </h1>
        <p class="text-text-secondary text-sm pb-2">
          {{ pnj.personnalite }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="border border-secondary-button-background p-2"
        v-for="(stat, index) in pnj.stats"
        :key="index"
      >
        <h1 class="text-text-secondary text-xs font-body uppercase">{{ stat.label }}</h1>
        <p class="text-text-primary text-base font-mono">{{ stat.value }}</p>
      </div>
    </div>

    <div class="flex justify-between">
      <button
        type="button"
        class="font-body text-xs text-text-secondary hover:text-primary-button-background"
        @click="$emit('edit', pnj)"
      >
        Modifier la fiche
      </button>
      <button
        class="font-body text-xs text-text-delete hover:text-text-delete ml-2"
        @click="deletePnj"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePnjStore } from '@/stores/pnjs'

type Pnj = {
  id: string
  nom: string
  image: string
  personnalite: string
  stats: { id: string; label: string; value: string }[]
}

const pnjStore = usePnjStore()
defineEmits<{
  edit: [pnj: Pnj]
}>()

function deletePnj() {
  pnjStore.pnjRemove(props.pnj.id)
}

const props = defineProps<{
  pnj: {
    id: string
    nom: string
    image: string
    personnalite: string
    stats: { id: string; label: string; value: string }[]
  }
}>()
</script>
