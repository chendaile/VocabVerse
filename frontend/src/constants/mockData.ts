import type { LearningPlan, ReviewStat, Word } from '../../../share/types'

export const featuredWords: Word[] = [
  {
    id: 'wd-1',
    term: 'articulate',
    pronunciation: 'ɑːrˈtɪkjʊlət',
    definition: 'able to speak clearly and expressively',
    example: 'She is articulate and can explain complex ideas in simple terms.',
    tags: ['communication', 'IELTS']
  },
  {
    id: 'wd-2',
    term: 'meticulous',
    pronunciation: 'məˈtɪkjʊləs',
    definition: 'showing great attention to detail',
    example: 'The editor is meticulous about correcting every grammatical error.',
    tags: ['writing', 'TOEFL']
  },
  {
    id: 'wd-3',
    term: 'resilient',
    pronunciation: 'rɪˈzɪliənt',
    definition: 'able to withstand or recover quickly from difficult conditions',
    example: 'Language learners need a resilient mindset to keep practicing.',
    tags: ['mindset', 'daily']
  }
]

export const learningPlans: LearningPlan[] = [
  {
    id: 'plan-1',
    title: '雅思冲刺',
    description: '28 天覆盖 500 个高频学术单词，搭配听说写练习。',
    dailyTarget: 20,
    focusTags: ['IELTS', 'speaking', 'writing']
  },
  {
    id: 'plan-2',
    title: '托福口语专项',
    description: '强化表达与句型，结合例句影子跟读与即兴表达。',
    dailyTarget: 15,
    focusTags: ['TOEFL', 'communication']
  },
  {
    id: 'plan-3',
    title: '日常表达巩固',
    description: '每天 10 词轻量复习，适合碎片化时间快速巩固。',
    dailyTarget: 10,
    focusTags: ['daily', 'listening']
  }
]

export const reviewStats: ReviewStat[] = [
  { label: '今日新词', value: 18, trend: '+3 vs 昨日' },
  { label: '复习完成', value: 42, trend: '保持稳定' },
  { label: '熟练度提升', value: 12, trend: '+5% 周环比' },
  { label: '连续打卡', value: 7, trend: '目标 14 天' }
]
