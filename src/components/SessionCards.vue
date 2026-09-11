<template>
  <div
    class="flex flex-col gap-4 bg-component-background p-4 border border-secondary-button-background"
  >
    <div class="flex flex-wrap items-center gap-4">
      <router-link
        :to="`/session/${session.id}`"
        class="min-w-0 break-words text-text-primary font-title font-bold p-2 text-lg hover:text-text-alert"
        >{{ session.name }}
      </router-link>
      <p
        class="text-text-detail font-mono text-xs border border-secondary-button-background p-2 sm:ml-auto"
      >
        {{ session.pnj.length }} PNJ
      </p>
    </div>

    <div>
      <p class="text-text-secondary text-sm border-b border-secondary-button-background pb-2">
        {{ session.description }}
      </p>
    </div>

    <div class="flex">
      <p class="text-text-detail font-mono text-xs">
        modifié le {{ new Date(session.updatedAt).toLocaleDateString() }}
      </p>
      <button
        class="font-body text-xs text-text-secondary hover:text-primary-button-background ml-auto"
        @click="$emit('duplicate', session.id)"
      >
        Dupliquer
      </button>
      <button
        class="font-body text-xs text-text-delete hover:text-text-delete ml-2"
        @click="$emit('remove', session.id)"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/sessions'
import { ref } from 'vue'
const sessionStore = useSessionStore()
defineEmits<{
  duplicate: [id: string]
  remove: [id: string]
}>()
const props = defineProps<{
  session: {
    id: string
    name: string
    description: string
    resume: string
    keypoint: { id: string; label: string; state: boolean }[]
    music: { id: string; label: string; categorie: string; link: string }[]
    pnj: { pnjId: string; but: string }[]
    updatedAt: string
  }
}>()
</script>
