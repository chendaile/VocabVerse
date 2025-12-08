import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { WordsService } from './words.service'
import type { LearningRecord } from '../../../../share/types'

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('levels')
  findLevels() {
    return this.wordsService.findLevels()
  }

  @Get('levels/:levelId/words')
  findWordsByLevel(@Param('levelId') levelId: string) {
    return this.wordsService.findWordsByLevel(levelId)
  }

  @Post('progress')
  saveProgress(@Body() payload: Omit<LearningRecord, 'id' | 'createdAt'>) {
    return this.wordsService.saveProgress(payload)
  }

  @Post('image')
  generateImage(
    @Body()
    payload: {
      wordId: string
      term: string
      levelId?: string
      prompt?: string
    }
  ) {
    return this.wordsService.generateImage(payload)
  }
}
