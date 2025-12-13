import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ReviewGrade,
    ReviewStatus,
    UserPlan,
} from '@prisma/user-client';
import { UserPrismaService, WordPrismaService } from '../database';
import { EnqueueNewDto, SubmitReviewDto } from './dto';
import { REVIEW_STRATEGY } from '../review-strategy/constants';
import { Inject } from '@nestjs/common';
import type { ReviewStrategy } from '../review-strategy/review-strategy.interface';

@Injectable()
export class UserWordsService {
    constructor(
        private readonly userPrisma: UserPrismaService,
        private readonly wordPrisma: WordPrismaService,
        @Inject(REVIEW_STRATEGY)
        private readonly strategy: ReviewStrategy,
    ) {}

    private async getPlan(userId: string, planId: string): Promise<UserPlan> {
        const plan = await this.userPrisma.userPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        return plan;
    }

    async enqueueNewWords(
        userId: string,
        planId: string,
        dto: EnqueueNewDto,
    ) {
        const plan = await this.getPlan(userId, planId);
        const count = dto.count ?? plan.dailyNewTarget;
        if (!count || count <= 0) {
            throw new BadRequestException('Invalid count');
        }

        const existing = await this.userPrisma.userWord.findMany({
            where: { userId },
            select: { wordId: true },
        });
        const owned = new Set(existing.map((e) => e.wordId));

        const candidates = await this.wordPrisma.stardict.findMany({
            where: {
                tag: {
                    contains: plan.tag,
                },
            },
            take: count * 5, // 加大取样，过滤掉已拥有的
            orderBy: {
                frq: 'desc',
            },
        });

        const picked = candidates
            .filter((c) => !owned.has(c.id))
            .slice(0, count);

        if (picked.length === 0) {
            return { added: 0, wordIds: [] };
        }

        await this.userPrisma.userWord.createMany({
            data: picked.map((w) => ({
                userId,
                planId,
                wordId: w.id,
                status: ReviewStatus.NEW,
            })),
            skipDuplicates: true,
        });

        return { added: picked.length, wordIds: picked.map((p) => p.id) };
    }

    async listNew(userId: string, planId: string) {
        await this.getPlan(userId, planId);
        return this.userPrisma.userWord.findMany({
            where: { userId, planId, status: ReviewStatus.NEW },
            select: {
                wordId: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async listReviewDue(userId: string, planId: string, limit?: number) {
        const plan = await this.getPlan(userId, planId);
        const take = limit ?? plan.dailyReviewTarget ?? 50;
        const now = new Date();
        return this.userPrisma.userWord.findMany({
            where: {
                userId,
                planId,
                nextReviewAt: {
                    lte: now,
                },
            },
            orderBy: [{ nextReviewAt: 'asc' }],
            take,
            select: {
                wordId: true,
                status: true,
                nextReviewAt: true,
            },
        });
    }

    async submitReview(
        userId: string,
        wordId: number,
        dto: SubmitReviewDto,
    ) {
        const userWord = await this.userPrisma.userWord.findFirst({
            where: {
                userId,
                wordId,
            },
        });
        if (!userWord) {
            throw new NotFoundException('User word not found');
        }

        const now = new Date();
        const schedule = this.strategy.calc(
            {
                status: userWord.status,
                reviewedTimes: userWord.reviewedTimes,
                correct: userWord.correct,
                wrong: userWord.wrong,
                nextReviewAt: userWord.nextReviewAt,
            },
            dto.result,
            now,
        );

        const correctDelta = dto.result === 'GOOD' ? 1 : 0;
        const wrongDelta = dto.result === 'FAIL' ? 1 : 0;

        const updated = await this.userPrisma.userWord.update({
            where: { id: userWord.id },
            data: {
                status: schedule.status,
                nextReviewAt: schedule.nextReviewAt,
                lastResult: dto.result,
                reviewedTimes: userWord.reviewedTimes + 1,
                correct: userWord.correct + correctDelta,
                wrong: userWord.wrong + wrongDelta,
            },
        });

        await this.userPrisma.userWordLog.create({
            data: {
                userId,
                planId: userWord.planId,
                userWordId: userWord.id,
                wordId,
                result: dto.result,
                durationMs: dto.durationMs,
            },
        });

        return updated;
    }
}
