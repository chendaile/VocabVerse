export interface User {
  id: string
  wechatOpenId: string
  nickname: string
  avatarUrl?: string
  createdAt: string
}

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

export interface Progress {
  id: string
  userId: string
  wordId: string
  proficiency: number
  lastReviewedAt: string
  nextReviewAt: string
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

export interface LearningPlan {
  id: string
  title: string
  description: string
  dailyTarget: number
  focusTags: string[]
}

export interface ReviewStat {
  label: string
  value: number
  trend: string
}
