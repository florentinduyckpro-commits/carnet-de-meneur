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

type SessionCreation = Partial<Omit<session, 'id'>>
type SessionMiseAJour = Partial<Omit<session, 'id'>>

const STORAGE_KEY = 'jdr-organizer.sessions.v1'

function genererId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function chargerDepuisStockage(): session[] {
  try {
    const brut = localStorage.getItem(STORAGE_KEY)
    const sessions = brut ? (JSON.parse(brut) as Partial<session>[]) : []
    return sessions.map((session) => ({
      id: session.id ?? genererId(),
      name: session.name ?? 'Nouvelle session',
      description: session.description ?? '',
      resume: session.resume ?? '',
      keypoint: session.keypoint ?? [],
      music: session.music ?? [],
      pnj: session.pnj ?? [],
      updatedAt: session.updatedAt ?? new Date().toISOString(),
    }))
  } catch (erreur) {
    console.error('Lecture des sessions impossible, liste vide utilisée.', erreur)
    return []
  }
}

function sauvegarder(pnjs: session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pnjs))
}

class SessionIntrouvableError extends Error {
  constructor(id: string) {
    super(`Aucune session avec l'id "${id}"`)
    this.name = 'SessionIntrouvableError'
  }
}

export class SessionRepository {
  private sessions: session[]

  constructor() {
    this.sessions = chargerDepuisStockage()
  }

  // --- Create ---
  create(partiel: SessionCreation = {}): session {
    const session: session = {
      id: genererId(),
      name: partiel.name ?? 'Nouvelle session',
      description: partiel.description ?? '',
      resume: partiel.resume ?? '',
      keypoint: partiel.keypoint ?? [],
      music: partiel.music ?? [],
      pnj: partiel.pnj ?? [],
      updatedAt: new Date().toISOString(),
    }
    this.sessions.push(session)
    sauvegarder(this.sessions)
    return session
  }

  // --- Read ---
  getAll(): session[] {
    return this.sessions
  }

  getById(id: string): session | undefined {
    return this.sessions.find((p) => p.id === id)
  }

  // --- Update ---
  update(id: string, patch: SessionMiseAJour): session {
    const session = this.getById(id)
    if (!session) throw new SessionIntrouvableError(id)
    Object.assign(session, patch, { updatedAt: new Date().toISOString() })
    sauvegarder(this.sessions)
    return session
  }

  // --- Delete ---
  remove(id: string): void {
    const index = this.sessions.findIndex((p) => p.id === id)
    if (index === -1) throw new SessionIntrouvableError(id)
    this.sessions.splice(index, 1)
    sauvegarder(this.sessions)
  }
}
