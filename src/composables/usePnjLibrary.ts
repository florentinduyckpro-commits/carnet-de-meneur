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

type PnjCreation = Partial<Omit<Pnj, 'id'>>
type PnjMiseAJour = Partial<Omit<Pnj, 'id'>>

const STORAGE_KEY = 'jdr-organizer.pnjs.v1'

function genererId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function chargerDepuisStockage(): Pnj[] {
  try {
    const brut = localStorage.getItem(STORAGE_KEY)
    return brut ? (JSON.parse(brut) as Pnj[]) : []
  } catch (erreur) {
    console.error('Lecture de la bibliothèque de PNJ impossible, liste vide utilisée.', erreur)
    return []
  }
}

function sauvegarder(pnjs: Pnj[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pnjs))
}

class PnjIntrouvableError extends Error {
  constructor(id: string) {
    super(`Aucun PNJ avec l'id "${id}"`)
    this.name = 'PnjIntrouvableError'
  }
}

export class PnjRepository {
  private pnjs: Pnj[]

  constructor() {
    this.pnjs = chargerDepuisStockage()
  }

  // --- Create ---
  create(partiel: PnjCreation = {}): Pnj {
    const pnj: Pnj = {
      id: genererId(),
      nom: partiel.nom ?? 'Nouveau PNJ',
      image: partiel.image ?? '',
      personnalite: partiel.personnalite ?? '',
      stats: partiel.stats ?? [],
    }
    this.pnjs.push(pnj)
    sauvegarder(this.pnjs)
    return pnj
  }

  // --- Read ---
  getAll(): Pnj[] {
    return this.pnjs
  }

  getById(id: string): Pnj | undefined {
    return this.pnjs.find((p) => p.id === id)
  }

  // --- Update ---
  update(id: string, patch: PnjMiseAJour): Pnj {
    const pnj = this.getById(id)
    if (!pnj) throw new PnjIntrouvableError(id)
    Object.assign(pnj, patch)
    sauvegarder(this.pnjs)
    return pnj
  }

  // --- Delete ---
  remove(id: string): void {
    const index = this.pnjs.findIndex((p) => p.id === id)
    if (index === -1) throw new PnjIntrouvableError(id)
    this.pnjs.splice(index, 1)
    sauvegarder(this.pnjs)
  }
}
