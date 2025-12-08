export interface Word {
  id: string
  term: string
  pronunciation?: string
  definition: string
  example?: string
  tags?: string[]
}

export interface Level {
  id: string
  name: string
  description: string
  category: string
  wordCount: number
}

export interface LearningRecord {
  id: string
  userId: string
  wordId: string
  levelId: string
  action: 'view' | 'remembered' | 'hard'
  note?: string
  createdAt: string
}

export interface ImageRecord {
  id: string
  wordId: string
  term: string
  levelId?: string
  prompt: string
  imageUrl: string
  createdAt: string
}
