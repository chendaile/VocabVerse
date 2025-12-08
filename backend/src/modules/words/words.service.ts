import { Injectable } from '@nestjs/common'
import type { ImageRecord, LearningRecord, Level, Word } from '../../types'

@Injectable()
export class WordsService {
  private levels: Level[] = [
    {
      id: 'primary-1',
      name: '小学一年级',
      description: '基础拼写与日常问候词汇，适合启蒙阶段。',
      category: 'K12',
      wordCount: 120
    },
    {
      id: 'high-2',
      name: '高二',
      description: '覆盖课标常见阅读词与作文高频表达。',
      category: 'K12',
      wordCount: 260
    },
    {
      id: 'cet-4',
      name: '大学英语四级',
      description: '听力与阅读高频词，强化搭配与常见短语。',
      category: '大学',
      wordCount: 420
    },
    {
      id: 'cet-6',
      name: '大学英语六级',
      description: '进阶学术词汇与难句衔接表达。',
      category: '大学',
      wordCount: 520
    }
  ]

  private levelWords: Record<string, Word[]> = {
    'primary-1': [
      {
        id: 'wd-hello',
        term: 'hello',
        pronunciation: 'həˈloʊ',
        definition: 'used as a greeting or to begin a phone conversation',
        example: 'The kids waved and said hello to their teacher.',
        tags: ['greeting']
      },
      {
        id: 'wd-apple',
        term: 'apple',
        pronunciation: 'ˈæp.əl',
        definition: 'a round fruit with red, yellow, or green skin and a firm white flesh',
        example: 'She puts an apple in her lunch box every day.',
        tags: ['food']
      }
    ],
    'high-2': [
      {
        id: 'wd-analyze',
        term: 'analyze',
        pronunciation: 'ˈæn.əl.aɪz',
        definition: 'to study or examine something in detail',
        example: 'Students are asked to analyze the rhetorical devices in the passage.',
        tags: ['reading', 'exam']
      },
      {
        id: 'wd-contrast',
        term: 'contrast',
        pronunciation: 'ˈkɑːn.træst',
        definition: 'to compare two people or things in order to show the differences',
        example: 'The essay needs to contrast different viewpoints clearly.',
        tags: ['writing']
      }
    ],
    'cet-4': [
      {
        id: 'wd-resilient',
        term: 'resilient',
        pronunciation: 'rɪˈzɪliənt',
        definition: 'able to withstand or recover quickly from difficult conditions',
        example: 'A resilient mindset helps you handle exam pressure.',
        tags: ['mindset', 'CET4']
      },
      {
        id: 'wd-mandatory',
        term: 'mandatory',
        pronunciation: 'ˈmæn.də.tɔːr.i',
        definition: 'required by law or rules; compulsory',
        example: 'Attendance at the listening drills is mandatory for all students.',
        tags: ['policy', 'CET4']
      }
    ],
    'cet-6': [
      {
        id: 'wd-articulate',
        term: 'articulate',
        pronunciation: 'ɑːrˈtɪkjʊlət',
        definition: 'able to speak clearly and expressively',
        example: 'She is articulate and can explain complex ideas in simple terms.',
        tags: ['communication', 'CET6']
      },
      {
        id: 'wd-meticulous',
        term: 'meticulous',
        pronunciation: 'məˈtɪkjʊləs',
        definition: 'showing great attention to detail',
        example: 'The editor is meticulous about correcting every grammatical error.',
        tags: ['writing', 'CET6']
      }
    ]
  }

  private progressRecords: LearningRecord[] = []
  private imageRecords: ImageRecord[] = []

  findLevels(): Level[] {
    return this.levels
  }

  findWordsByLevel(levelId: string): Word[] {
    return this.levelWords[levelId] ?? []
  }

  saveProgress(entry: Omit<LearningRecord, 'id' | 'createdAt'>): LearningRecord {
    const record: LearningRecord = {
      ...entry,
      id: `rec-${this.progressRecords.length + 1}`,
      createdAt: new Date().toISOString()
    }
    this.progressRecords.push(record)
    return record
  }

  generateImage(payload: { wordId: string; term: string; levelId?: string; prompt?: string }): ImageRecord {
    const urlSafeTerm = encodeURIComponent(payload.term)
    const imageUrl = `https://dummyimage.com/640x360/111827/ffffff.png&text=${urlSafeTerm}`
    const record: ImageRecord = {
      id: `img-${this.imageRecords.length + 1}`,
      wordId: payload.wordId,
      term: payload.term,
      levelId: payload.levelId,
      prompt: payload.prompt ?? `An image that helps remember the word ${payload.term}`,
      imageUrl,
      createdAt: new Date().toISOString()
    }
    this.imageRecords.push(record)
    return record
  }
}
