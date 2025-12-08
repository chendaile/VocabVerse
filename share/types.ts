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

export interface Progress {
  id: string
  userId: string
  wordId: string
  proficiency: number
  lastReviewedAt: string
  nextReviewAt: string
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
