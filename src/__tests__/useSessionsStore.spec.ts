import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionRepository } from '@/composables/useSessionsStore'

const storage = new Map<string, string>()

describe('SessionRepository', () => {
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      clear: () => storage.clear(),
    })
    vi.useRealTimers()
  })

  it('crée une session avec une date de modification', () => {
    const repository = new SessionRepository()
    const session = repository.create({ name: 'La forêt oubliée' })

    expect(session.name).toBe('La forêt oubliée')
    expect(session.updatedAt).toEqual(expect.any(String))
    expect(Number.isNaN(Date.parse(session.updatedAt))).toBe(false)
  })

  it('actualise updatedAt lors d une modification', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-11T10:00:00.000Z'))

    const repository = new SessionRepository()
    const session = repository.create({ name: 'Avant' })
    const initialUpdatedAt = session.updatedAt

    vi.setSystemTime(new Date('2026-09-11T11:00:00.000Z'))
    const updated = repository.update(session.id, { name: 'Après' })

    expect(updated.name).toBe('Après')
    expect(updated.updatedAt).not.toBe(initialUpdatedAt)
    expect(updated.updatedAt).toBe('2026-09-11T11:00:00.000Z')
  })

  it('ajoute une date aux sessions anciennes sans updatedAt', () => {
    localStorage.setItem(
      'jdr-organizer.sessions.v1',
      JSON.stringify([{ id: 'ancienne', name: 'Session ancienne' }]),
    )

    const repository = new SessionRepository()
    const session = repository.getById('ancienne')

    expect(session?.updatedAt).toEqual(expect.any(String))
    expect(Number.isNaN(Date.parse(session?.updatedAt ?? ''))).toBe(false)
  })
})
