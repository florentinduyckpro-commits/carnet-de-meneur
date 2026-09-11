import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PnjRepository } from '@/composables/usePnjLibrary'

const storage = new Map<string, string>()

describe('PnjRepository', () => {
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      clear: () => storage.clear(),
    })
  })

  it('crée et recharge un PNJ depuis le stockage', () => {
    const repository = new PnjRepository()
    const created = repository.create({
      nom: 'Elara',
      image: '/elara.png',
      personnalite: 'Calme',
      stats: [{ id: 'force', label: 'Force', value: '3' }],
    })

    const reloadedRepository = new PnjRepository()

    expect(created.id).toBeTruthy()
    expect(reloadedRepository.getById(created.id)).toEqual(created)
  })

  it('modifie un PNJ existant sans changer son identifiant', () => {
    const repository = new PnjRepository()
    const created = repository.create({ nom: 'Elara' })

    const updated = repository.update(created.id, {
      nom: 'Elara la Gardienne',
      personnalite: 'Vigilante',
    })

    expect(updated).toMatchObject({
      id: created.id,
      nom: 'Elara la Gardienne',
      personnalite: 'Vigilante',
    })
  })

  it('supprime un PNJ', () => {
    const repository = new PnjRepository()
    const created = repository.create({ nom: 'Elara' })

    repository.remove(created.id)

    expect(repository.getById(created.id)).toBeUndefined()
    expect(repository.getAll()).toHaveLength(0)
  })
})
