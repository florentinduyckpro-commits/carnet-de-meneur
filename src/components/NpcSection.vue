<template>
  <div class="flex w-full min-w-0 flex-col gap-4">
    <div
      class="flex flex-col gap-3 bg-component-background px-4 py-3 sm:flex-row sm:items-center sm:gap-5 sm:px-5"
    >
      <p class="font-mono text-xs uppercase text-text-secondary">Lier un PNJ de la bibliothèque</p>
      <label for="pnj-sort" class="sr-only">PNJ à lier</label>
      <select
        id="pnj-sort"
        v-model="selectPnj"
        class="min-w-0 border border-text-detail bg-background p-2 text-sm capitalize font-body text-text-primary sm:min-w-40"
      >
        <option v-for="pnj in pnjs" :key="pnj.id" :value="pnj">
          {{ pnj.nom }}
        </option>
      </select>
      <button
        class="bg-secondary-button-background border text-text-primary border-secondary-button-border font-body text-sm px-4 py-2 hover:border-primary-button-background"
        @click="linkPnj()"
      >
        Lier
      </button>
      <button
        class="text-text-alert font-body text-sm border border-primary-button-border border-dashed py-2 px-4 hover:border-primary-button-background"
        @click="isNewPnjModalOpen = true"
      >
        + Créer un PNJ à la volée
      </button>
    </div>
    <div v-for="pnj in pnjsSession" :key="pnj.id">
      <PnjSessionCards :pnj="pnj" @unlink="unlinkPnj" @but="updateBut" />
    </div>
    <dialog
      v-if="isNewPnjModalOpen"
      open
      class="fixed inset-0 z-50 flex items-center h-screen w-screen justify-center bg-black/60 p-4"
      @click.self="isNewPnjModalOpen = false"
      @keydown.esc="isNewPnjModalOpen = false"
    >
      <div
        class="max-h-[calc(100vh-2rem)] min-h-50 w-full max-w-lg overflow-y-auto border border-secondary-button-background bg-component-background p-5 flex flex-col gap-2 rounded"
        aria-label="Nouvelle session"
      >
        <div class="flex justify-between">
          <h1 class="font-title text-text-primary text-lg">Nouveau PNJ</h1>
          <button
            type="button"
            @click="isNewPnjModalOpen = false"
            class="text-text-secondary px-4 py-2 font-body rounded text-sm hover:text-primary-button-background-hover"
          >
            X
          </button>
        </div>
        <div class="grid gap-2 grid-cols-4">
          <img
            class="w-[76px] h-[76px] border border-secondary-button-background bg-secondary-button-background rounded-lg"
            :src="newPnj.image"
            alt="?"
          />
          <div class="flex flex-col col-span-3">
            <label for="nameNPC" class="text-xs font-body text-text-secondary"
              >URL du portrait</label
            >
            <input
              id="nameNPC"
              type="text"
              class="w-full bg-background border border-secondary-button-background text-text-primary rounded-sm px-4 py-2"
              v-model="newPnj.image"
            />
          </div>
        </div>

        <label for="npc-name" class="text-xs font-body text-text-secondary">Nom</label>
        <input
          id="npc-name"
          type="text"
          class="w-full bg-background border border-secondary-button-background rounded-sm px-4 py-2 text-text-primary"
          v-model="newPnj.nom"
        />
        <label for="npc-personality" class="text-xs font-body text-text-secondary"
          >Personnalité</label
        >
        <textarea
          id="npc-personality"
          class="w-full bg-background border border-secondary-button-background rounded-sm text-text-primary"
          v-model="newPnj.personnalite"
        ></textarea>
        <fieldset class="flex flex-col gap-2 pb-5">
          <legend class="text-xs font-body text-text-secondary">Statistiques</legend>
          <div class="flex flex-col gap-2">
            <div
              v-for="(stat, index) in newPnj.stats"
              :key="stat.id"
              class="grid min-w-0 gap-2"
              :class="
                newPnj.stats.length > 1
                  ? 'grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto]'
                  : 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
              "
            >
              <button
                v-if="newPnj.stats.length > 1"
                type="button"
                :aria-label="`Supprimer la statistique ${index + 1}`"
                class="shrink-0 px-2 text-text-delete"
                @click="removeStat(stat.id)"
              >
                X
              </button>
              <input
                :id="`stat-label-${stat.id}`"
                type="text"
                aria-label="Nom de la statistique"
                class="w-full min-w-0 bg-background border border-secondary-button-background rounded-sm px-4 py-2 text-text-primary"
                placeholder="Nom"
                v-model="stat.label"
              />
              <input
                :id="`stat-value-${stat.id}`"
                type="text"
                aria-label="Valeur de la statistique"
                class="w-full min-w-0 bg-background border border-secondary-button-background rounded-sm px-4 py-2 text-text-primary"
                placeholder="Valeur"
                v-model="stat.value"
              />
              <button
                v-if="index === newPnj.stats.length - 1"
                type="button"
                aria-label="Ajouter une statistique"
                @click="addStat"
                class="shrink-0 text-text-secondary border border-text-detail px-4 py-2 font-body rounded text-sm hover:text-primary-button-background-hover hover:border-primary-button-background-hover"
              >
                +
              </button>
            </div>
          </div>
        </fieldset>
        <div class="flex justify-end gap-5 border-t border-secondary-button-background pt-5">
          <button
            type="button"
            @click="isNewPnjModalOpen = false"
            class="text-text-secondary border border-text-detail px-4 py-2 font-body rounded text-sm hover:text-primary-button-background-hover hover:border-primary-button-background-hover"
          >
            Annuler
          </button>
          <button
            type="button"
            class="bg-primary-button-background text-primary-button-background-text px-4 py-2 font-body rounded text-sm hover:bg-primary-button-background-hover"
            @click="createPnj"
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
import PnjSessionCards from './PnjSessionCards.vue'
import { usePnjStore } from '@/stores/pnjs'
import { useSessionStore } from '@/stores/sessions'
import { useRoute } from 'vue-router'

interface PnjStat {
  id: string
  label: string
  value: string
}

interface Pnj {
  id: string
  nom: string
  image: string
  personnalite: string
  stats: PnjStat[]
}

const pnjStore = usePnjStore()
const sessionStore = useSessionStore()
const route = useRoute()
const selectPnj = ref()
const isNewPnjModalOpen = ref(false)

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

const pnjs = ref(pnjStore.Pnjs)

const pnjsSession = computed(() =>
  pnjs.value
    .filter((pnj) => props.session.pnj.some(({ pnjId }) => pnjId === pnj.id))
    .map((pnj) => ({
      ...pnj,
      but: props.session.pnj.find(({ pnjId }) => pnjId === pnj.id)?.but ?? '',
    })),
)

function linkPnj() {
  const session = props.session
  session.pnj.push({ pnjId: selectPnj.value.id, but: '' })
  sessionStore.sessionUpdate(String(route.params.id), { pnj: session.pnj })
}

function unlinkPnj(pnjId: string) {
  const session = props.session
  session.pnj = session.pnj.filter((pnj) => pnj.pnjId !== pnjId)
  sessionStore.sessionUpdate(String(route.params.id), { pnj: session.pnj })
}

function updateBut(pnjId: string, but: string) {
  const session = props.session
  const pnj = session.pnj.find((linkedPnj) => linkedPnj.pnjId === pnjId)

  if (!pnj) return

  pnj.but = but
  sessionStore.sessionUpdate(String(route.params.id), { pnj: session.pnj })
}

function createStat(): PnjStat {
  return { id: crypto.randomUUID(), label: '', value: '' }
}

const newPnj = ref<Pnj>({
  id: '',
  nom: '',
  image: '',
  personnalite: '',
  stats: [createStat()],
})

function resetNewPnj() {
  newPnj.value = {
    id: '',
    nom: '',
    image: '',
    personnalite: '',
    stats: [createStat()],
  }
}

function addStat() {
  newPnj.value.stats.push(createStat())
}

function removeStat(id: string) {
  newPnj.value.stats = newPnj.value.stats.filter((stat) => stat.id !== id)
}

function createPnj() {
  pnjStore.pnjCreate({
    ...newPnj.value,
    stats: newPnj.value.stats.filter((stat) => stat.label.trim() || stat.value.trim()),
  })
  const session = props.session
  session.pnj.push({ pnjId: String(pnjs.value[pnjs.value.length - 1]?.id), but: '' })
  sessionStore.sessionUpdate(String(route.params.id), { pnj: session.pnj })
  resetNewPnj()
  isNewPnjModalOpen.value = false
}
</script>
