import { create } from 'zustand'
import type { ImageRecord, Level, Word } from '../../../share/types'
import { fetchLevels, fetchWordsByLevel, generateImageForWord, saveLearningRecord } from '../services/learningApi'

interface WordState {
  levels: Level[]
  currentLevelId?: string
  words: Word[]
  favorites: Set<string>
  generatedImages: Record<string, ImageRecord>
  loading: boolean
  initLevels: () => Promise<void>
  selectLevel: (levelId: string) => Promise<void>
  toggleFavorite: (id: string) => void
  markProgress: (wordId: string, levelId: string, action: 'view' | 'remembered' | 'hard') => Promise<void>
  requestImage: (word: Word, levelId?: string, prompt?: string) => Promise<ImageRecord | undefined>
}

export const useWordStore = create<WordState>((set) => ({
  levels: [],
  currentLevelId: undefined,
  words: [],
  favorites: new Set(),
  generatedImages: {},
  loading: false,
  initLevels: async () => {
    set({ loading: true })
    try {
      const levels = await fetchLevels()
      const defaultLevel = levels[0]?.id
      set({ levels, currentLevelId: defaultLevel })
      if (defaultLevel) {
        const words = await fetchWordsByLevel(defaultLevel)
        set({ words })
      }
    } finally {
      set({ loading: false })
    }
  },
  selectLevel: async (levelId: string) => {
    set({ loading: true, currentLevelId: levelId })
    try {
      const words = await fetchWordsByLevel(levelId)
      set({ words })
    } finally {
      set({ loading: false })
    }
  },
  toggleFavorite: (id: string) =>
    set((state) => {
      const next = new Set(state.favorites)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { favorites: next }
    }),
  markProgress: async (wordId, levelId, action) => {
    const userId = 'guest'
    await saveLearningRecord({ userId, wordId, levelId, action })
  },
  requestImage: async (word, levelId, prompt) => {
    const record = await generateImageForWord({ wordId: word.id, term: word.term, levelId, prompt })
    set((state) => ({ generatedImages: { ...state.generatedImages, [word.id]: record } }))
    return record
  }
}))
