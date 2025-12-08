import type { ImageRecord, LearningRecord, Level, Word } from '../../../share/types'
import { apiClient } from './apiClient'

export async function fetchLevels(): Promise<Level[]> {
  const { data } = await apiClient.get<Level[]>('/words/levels')
  return data
}

export async function fetchWordsByLevel(levelId: string): Promise<Word[]> {
  const { data } = await apiClient.get<Word[]>(`/words/levels/${levelId}/words`)
  return data
}

export async function saveLearningRecord(payload: Omit<LearningRecord, 'id' | 'createdAt'>): Promise<LearningRecord> {
  const { data } = await apiClient.post<LearningRecord>('/words/progress', payload)
  return data
}

export async function generateImageForWord(payload: {
  wordId: string
  term: string
  levelId?: string
  prompt?: string
}): Promise<ImageRecord> {
  const { data } = await apiClient.post<ImageRecord>('/words/image', payload)
  return data
}
