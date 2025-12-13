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
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserWordsService } from './user-words.service';
import type { EnqueueNewDto, SubmitReviewDto } from './dto';

@Controller('me')
@UseGuards(AuthGuard)
export class UserWordsController {
    constructor(private readonly words: UserWordsService) {}

    @Post('plans/:planId/enqueue-new')
    enqueue(
        @Req() req: any,
        @Param('planId') planId: string,
        @Body() body: EnqueueNewDto,
    ) {
        return this.words.enqueueNewWords(req.user.id, planId, body);
    }

    @Get('plans/:planId/new')
    listNew(@Req() req: any, @Param('planId') planId: string) {
        return this.words.listNew(req.user.id, planId);
    }

    @Get('plans/:planId/review-due')
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
        @Param('wordId') wordId: string,
        @Body() body: SubmitReviewDto,
    ) {
        return this.words.submitReview(req.user.id, Number(wordId), body);
    }
}
