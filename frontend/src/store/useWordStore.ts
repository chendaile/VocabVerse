import { create } from 'zustand'
import type { Word } from '../../../share/types'
import { featuredWords } from '../constants/mockData'

interface WordState {
  words: Word[]
  favorites: Set<string>
  toggleFavorite: (id: string) => void
}

export const useWordStore = create<WordState>((set) => ({
  words: featuredWords,
  favorites: new Set(),
  toggleFavorite: (id: string) =>
    set((state) => {
      const next = new Set(state.favorites)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { favorites: next }
    })
}))
