<template>
  <div class="flex flex-col gap-4 p-4">
    <h1 class="font-title text-text-primary text-4xl font-bold">Sessions</h1>
    <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
      <p class="text-text-secondary font-body text-sm">
        Préparation de séance : résumé, points clés, ambiance sonore et PNJ liés.
      </p>
      <button
        type="button"
        class="bg-primary-button-background text-primary-button-background-text px-5 py-3 font-bold font-body text-sm sm:ml-auto hover:bg-primary-button-background-hover"
        @click="isNewSessionModalOpen = true"
      >
        + Nouvelle Session
      </button>
    </div>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <SessionCards
        v-for="session in sessions"
        :key="session.id"
        :session="session"
        @duplicate="duplicateSession"
        @remove="deleteSession"
      />
    </div>

    <dialog
      v-if="isNewSessionModalOpen"
      open
      class="fixed inset-0 z-50 flex items-center h-screen w-screen justify-center bg-black/60 p-4"
      @click.self="isNewSessionModalOpen = false"
      @keydown.esc="isNewSessionModalOpen = false"
    >
      <div
        class="max-h-[calc(100vh-2rem)] min-h-52 w-full max-w-lg overflow-y-auto border border-secondary-button-background bg-component-background p-5 flex flex-col gap-2 rounded"
        aria-label="Nouvelle session"
      >
        <div class="flex justify-between">
          <h1 class="font-title text-text-primary text-lg">Nouvelle session</h1>
          <button
            type="button"
            @click="isNewSessionModalOpen = false"
            class="text-text-secondary px-4 py-2 font-body rounded text-sm hover:text-primary-button-background-hover"
          >
            X
          </button>
        </div>

        <label for="nameSession" class="text-xs font-body text-text-secondary"
          >Nom de la session</label
        >
        <input
          id="nameSession"
          v-model="newSession.name"
          type="text"
          class="bg-background border border-text-detail rounded-sm text-text-primary"
        />
        <label class="text-xs font-body text-text-secondary">Description</label>
        <textarea
          class="bg-background border border-text-detail rounded-sm text-text-primary"
          v-model="newSession.description"
        ></textarea>
        <div class="flex justify-end gap-5 border-t border-secondary-button-background pt-5 mt-5">
          <button
            type="button"
            @click="isNewSessionModalOpen = false"
            class="text-text-secondary border border-text-detail px-4 py-2 font-body rounded text-sm hover:text-primary-button-background-hover hover:border-primary-button-background-hover"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="createSession"
            class="bg-primary-button-background text-primary-button-background-text px-4 py-2 font-body rounded text-sm hover:bg-primary-button-background-hover"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SessionCards from '@/components/SessionCards.vue'
import { useSessionStore } from '@/stores/sessions'

interface sessionKeypoint {
  id: string
  label: string
  state: boolean
}

interface sessionMusic {
  id: string
  label: string
  categorie: string
  link: string
}

interface sessionPnj {
  pnjId: string
  but: string
}

interface session {
  id: string
  name: string
  description: string
  resume: string
  keypoint: sessionKeypoint[]
  music: sessionMusic[]
  pnj: sessionPnj[]
  updatedAt: string
}

const sessionStore = useSessionStore()

const isNewSessionModalOpen = ref(false)

const sessions = computed(() => sessionStore.Sessions)
const newSession = ref({
  id: '',
  name: '',
  description: '',
  resume: '',
  keypoint: [],
  music: [],
  pnj: [],
})

function resetSession() {
  newSession.value = {
    id: '',
    name: '',
    description: '',
    resume: '',
    keypoint: [],
    music: [],
    pnj: [],
  }
}

function createSession() {
  sessionStore.sessionCreate(newSession.value)
  isNewSessionModalOpen.value = false
  resetSession()
}

function duplicateSession(id: string) {
  const session = sessions.value.find((session) => session.id === id)

  if (!session) return

  sessionStore.sessionCreate({
    name: `${session.name} - Copie`,
    description: session.description,
    resume: session.resume,
    keypoint: [...session.keypoint],
    music: [...session.music],
    pnj: [...session.pnj],
  })
}

function deleteSession(id: string) {
  sessionStore.sessionRemove(id)
}
</script>
