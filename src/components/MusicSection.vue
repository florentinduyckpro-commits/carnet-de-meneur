<template>
  <div class="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
    <div
      class="flex min-w-0 flex-col gap-2 bg-component-background border border-secondary-button-background p-4 sm:p-8"
    >
      <h1 class="font-mono text-xs uppercase text-text-alert pb-3">Ajouter une musique</h1>
      <p class="font-body text-xs text-text-detail uppercase">titre</p>
      <input
        type="text"
        id=""
        v-model="newMusic.label"
        class="border border-secondary-button-background font-body text-text-primary bg-background text-sm p-3 col-span-4 mb-5"
      />
      <p class="font-body text-xs text-text-detail uppercase">moment de jeu</p>
      <ul class="flex flex-wrap gap-2 mb-5">
        <li v-for="categorie in categories" :key="categorie.id">
          <button
            type="button"
            class="border border-text-detail p-2 font-body text-xs uppercase tracking-wide transition-colors"
            :class="
              activeCategorie === categorie.id
                ? 'border-primary-button-background bg-primary-button-background text-component-background'
                : 'text-text-secondary'
            "
            :aria-selected="activeCategorie === categorie.id"
            role="tab"
            @click="activeCategorie = categorie.id"
          >
            {{ categorie.label }}
          </button>
        </li>
      </ul>
      <p class="font-body text-xs text-text-detail uppercase">Lien externe</p>
      <input
        type="text"
        id=""
        v-model="newMusic.link"
        placeholder="https://..."
        class="border border-secondary-button-background font-body text-text-primary bg-background text-sm p-3 col-span-4 mb-5"
      />
      <button
        class="bg-primary-button-background text-primary-button-background-text px-5 py-3 font-bold font-body text-sm hover:bg-primary-button-background-hover"
        @click="addMusic()"
      >
        Ajouter à la playlist
      </button>
    </div>
    <div class="min-w-0 lg:col-span-2">
      <div v-for="categorie in categories" :key="categorie.id">
        <div class="flex justify-between">
          <h1 class="font-mono text-xs uppercase text-text-alert">{{ categorie.label }}</h1>
          <hr class="font-mono text-text-detail text-xs" />
          <p class="font-mono text-text-detail text-xs">{{ getMusicCount(categorie.id) }} titres</p>
        </div>
        <div v-for="(music, index) in session.music" :key="music.id">
          <div
            v-if="music.categorie === categorie.id"
            class="flex flex-col items-stretch gap-3 bg-component-background border border-secondary-button-background p-4 my-1 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-3">
              <p class="font-mono text-xs text-text-detail">{{ index }}</p>
              <p class="min-w-0 break-words text-text-primary font-body text-base">
                {{ music.label }}
              </p>
            </div>
            <div class="flex min-w-0 flex-wrap items-center gap-3 sm:justify-end">
              <a
                class="max-w-full break-all text-text-secondary font-mono text-xs hover:text-text-alert"
                :href="music.link"
                >{{ music.link }}</a
              >
              <button
                class="font-body text-xs text-text-delete hover:text-text-delete ml-2"
                @click="deleteMusic(music.id)"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSessionStore } from '@/stores/sessions'
import { useRoute } from 'vue-router'

const route = useRoute()
const sessionStore = useSessionStore()
const activeCategorie = ref<'exploration' | 'tension' | 'combat' | 'repos' | 'revelation'>(
  'exploration',
)
const categories = [
  { id: 'exploration', label: 'exploration' },
  { id: 'tension', label: 'tension' },
  { id: 'combat', label: 'combat' },
  { id: 'repos', label: 'repos' },
  { id: 'revelation', label: 'révélation' },
] as const

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

const newMusic = ref({
  id: Math.random().toString(36).slice(2, 10),
  label: '',
  categorie: activeCategorie,
  link: '',
})

function getMusicCount(categoryId: string) {
  const count = props.session.music.filter((music) => music.categorie === categoryId).length
  return count === 0 ? 0 : count - 1
}

function addMusic() {
  const session = props.session
  session.music.push(newMusic.value)
  sessionStore.sessionUpdate(String(route.params.id), { music: session.music })
  newMusic.value = {
    id: Math.random().toString(36).slice(2, 10),
    label: '',
    categorie: activeCategorie,
    link: '',
  }
}

function deleteMusic(idMusic: string) {
  const session = props.session
  const musicIndex = session.music.findIndex((music) => music.id === idMusic)

  if (musicIndex !== -1) {
    session.music.splice(musicIndex, 1)
  }

  sessionStore.sessionUpdate(String(route.params.id), { music: session.music })
}
</script>
