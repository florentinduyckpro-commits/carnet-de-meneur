import { ref } from 'vue'
import { defineStore } from 'pinia'
import { PnjRepository } from '@/composables/usePnjLibrary'

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

export const usePnjStore = defineStore('pnj', () => {
  const bibliotheque = new PnjRepository()
  const Pnjs = ref<Pnj[]>(bibliotheque.getAll())
  function pnjCreate(pnj: Pnj) {
    bibliotheque.create(pnj)
    Pnjs.value = [...bibliotheque.getAll()]
  }
  function pnjRemove(id: string) {
    bibliotheque.remove(id)
    Pnjs.value = [...bibliotheque.getAll()]
  }
  function pnjUpdate(id: string, patch: Pnj) {
    bibliotheque.update(id, patch)
    Pnjs.value = Pnjs.value.map((pnj) => (pnj.id === id ? { ...pnj, ...patch } : pnj))
  }
  function getPnj(id: string): Pnj | undefined {
    return Pnjs.value.find((p) => p.id === id)
  }

  return { Pnjs, pnjCreate, pnjRemove, pnjUpdate, getPnj }
})
