<template>
  <div class="flex flex-col gap-4 p-4">
    <h1 class="font-title text-text-primary text-4xl font-bold">Bibliothèque de PNJ</h1>
    <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
      <p class="text-text-secondary font-body text-sm">
        Fiches indépendantes des sessions. Le but d'un PNJ se définit séance par séance, il
        n'apparaît donc pas ici.
      </p>
      <button
        @click="openNewPnjModal"
        class="bg-primary-button-background text-primary-button-background-text px-5 py-3 font-bold font-body text-sm sm:ml-auto hover:bg-primary-button-background-hover"
      >
        + Nouveau PNJ
      </button>
    </div>

    <div class="grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
      <PnjCards v-for="pnj in pnjStore.Pnjs" :key="pnj.id" :pnj="pnj" @edit="openEditPnjModal" />
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
          <h1 class="font-title text-text-primary text-lg">
            {{ isEditingPnj ? 'Modifier le PNJ' : 'Nouveau PNJ' }}
          </h1>
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
            @click="savePnj"
          >
            {{ isEditingPnj ? 'Modifier' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import PnjCards from '@/components/PnjCards.vue'
import { usePnjStore } from '@/stores/pnjs'
import { ref } from 'vue'

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

const isNewPnjModalOpen = ref(false)
const isEditingPnj = ref(false)
const pnjStore = usePnjStore()

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

function openNewPnjModal() {
  resetNewPnj()
  isEditingPnj.value = false
  isNewPnjModalOpen.value = true
}

function openEditPnjModal(pnj: Pnj) {
  newPnj.value = {
    ...pnj,
    stats: pnj.stats.map((stat) => ({ ...stat })),
  }
  isEditingPnj.value = true
  isNewPnjModalOpen.value = true
}

function addStat() {
  newPnj.value.stats.push(createStat())
}

function removeStat(id: string) {
  newPnj.value.stats = newPnj.value.stats.filter((stat) => stat.id !== id)
}

function savePnj() {
  const pnj = {
    ...newPnj.value,
    stats: newPnj.value.stats.filter((stat) => stat.label.trim() || stat.value.trim()),
  }

  if (isEditingPnj.value) {
    pnjStore.pnjUpdate(pnj.id, pnj)
  } else {
    pnjStore.pnjCreate(pnj)
  }

  resetNewPnj()
  isEditingPnj.value = false
  isNewPnjModalOpen.value = false
}
</script>
