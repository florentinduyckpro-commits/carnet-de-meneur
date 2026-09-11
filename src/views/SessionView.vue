<template>
  <div class="flex min-w-0 flex-col gap-4 py-6 sm:py-10">
    <router-link
      to="/"
      class="font-mono uppercase text-text-secondary text-xs hover:text-primary-button-background"
    >
      ← Toutes les sessions
    </router-link>
    <h1 class="font-title text-text-primary text-3xl font-bold">{{ session?.name }}</h1>
    <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 justify-between">
      <p class="text-sm text-text-secondary">{{ session?.description }}</p>
      <p class="font-mono text-xs text-text-detail">
        modifié le {{ session?.updatedAt ? new Date(session.updatedAt).toLocaleDateString() : '-' }}
      </p>
    </div>
    <template v-if="session">
      <nav
        class="mt-8 border-b border-secondary-button-background"
        aria-label="Sections de la séance"
      >
        <ul class="flex gap-6 overflow-x-auto">
          <li v-for="section in sections" :key="section.id">
            <button
              type="button"
              class="border-b-2 px-1 pb-3 font-title text-xs uppercase tracking-wide transition-colors"
              :class="
                activeSection === section.id
                  ? 'border-primary-button-background text-text-primary'
                  : 'border-transparent text-text-secondary'
              "
              :aria-selected="activeSection === section.id"
              role="tab"
              @click="activeSection = section.id"
            >
              {{ section.label }}
            </button>
          </li>
        </ul>
      </nav>
      <SessionSummary v-if="activeSection === 'session'" :session="session" />
      <MusicSection v-if="activeSection === 'ambiance'" :session="session" />
      <NpcSection v-if="activeSection === 'pnjs'" :session="session" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SessionSummary from '@/components/SessionSummary.vue'
import MusicSection from '@/components/MusicSection.vue'
import NpcSection from '@/components/NpcSection.vue'
import { useSessionStore } from '@/stores/sessions'
import { useRoute } from 'vue-router'

const sessionStore = useSessionStore()
const route = useRoute()

const session = ref(sessionStore.getSession(String(route.params.id)))

const activeSection = ref<'session' | 'ambiance' | 'pnjs'>('session')
const sections = [
  { id: 'session', label: 'Séance' },
  { id: 'ambiance', label: 'Ambiance' },
  { id: 'pnjs', label: 'PNJ' },
] as const
</script>
