import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserWordsService } from './user-words.service';
import * as UserWordsDto from './dto';

@Controller('me')
@UseGuards(AuthGuard)
export class UserWordsController {
    constructor(private readonly words: UserWordsService) {}

    @Post('plans/:planId/makewordtask')
    makeWordTask(
        @Req() req: any,
        @Param('planId') planId: string,
        @Body() body: UserWordsDto.EnqueueNewDto,
    ) {
        return this.words.enqueueNewWords(req.user.id, planId, body);
    }

    @Get('plans/:planId/tobecompleted')
    listPending(@Req() req: any, @Param('planId') planId: string) {
        return this.words.listNew(req.user.id, planId);
    }

    @Get('plans/:planId/reviewdue')
    reviewDue(
        @Req() req: any,
        @Param('planId') planId: string,
        @Query('limit') limit?: string,
    ) {
        const parsed = limit ? Number(limit) : undefined;
        return this.words.listReviewDue(req.user.id, planId, parsed);
    }

    @Patch('words/:wordId')
    submit(
        @Req() req: any,
        @Param('wordId', ParseIntPipe) wordId: number,
        @Body() body: UserWordsDto.SubmitReviewDto,
    ) {
        return this.words.submitReview(req.user.id, wordId, body);
    }
}
