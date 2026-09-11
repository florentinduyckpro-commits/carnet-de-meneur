import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SessionRepository } from '@/composables/useSessionsStore'

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

export const useSessionStore = defineStore('session', () => {
  const bibliotheque = new SessionRepository()
  const Sessions = ref<session[]>(bibliotheque.getAll())
  function sessionCreate(session: Partial<Omit<session, 'id'>>) {
    bibliotheque.create(session)
    Sessions.value = [...bibliotheque.getAll()]
  }
  function sessionRemove(id: string) {
    bibliotheque.remove(id)
    Sessions.value = [...bibliotheque.getAll()]
  }
  function sessionUpdate(id: string, patch: Partial<Omit<session, 'id'>>) {
    const updatedSession = bibliotheque.update(id, patch)
    Sessions.value = Sessions.value.map((session) =>
      session.id === id ? { ...session, ...updatedSession } : session,
    )
  }
  function getSession(id: string): session | undefined {
    return Sessions.value.find((p) => p.id === id)
  }

  return { Sessions, sessionCreate, sessionRemove, sessionUpdate, getSession }
})
