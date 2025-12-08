import { Injectable } from '@nestjs/common'
import type { Word } from '../../../../share/types'

@Injectable()
export class WordsService {
  private sampleWords: Word[] = [
    {
      id: 'wd-1',
      term: 'articulate',
      pronunciation: 'ɑːrˈtɪkjʊlət',
      definition: 'able to speak clearly and expressively',
      example: 'She is articulate and can explain complex ideas in simple terms.'
    }
  ]

  findAll(): Word[] {
    return this.sampleWords
  }
}
