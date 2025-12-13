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
        const requested = dto.count ?? plan.dailyNewTarget;
        if (!requested || requested <= 0) {
            throw new BadRequestException('Invalid count');
        }

        const now = new Date();
        const startOfDay = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
        );
        const todayNewCount = await this.userPrisma.userWord.count({
            where: {
                userId,
                planId,
                status: ReviewStatus.NEW,
                createdAt: {
                    gte: startOfDay,
                },
            },
        });
        const quota = Math.max(plan.dailyNewTarget - todayNewCount, 0);
        if (quota <= 0) {
            return { added: 0, wordIds: [], quota: 0, remaining: 0 };
        }
        const count = Math.min(requested, quota);
        const remainingAfterRequest = Math.max(quota - count, 0);

        // 先查出未学过的 wordId 集合，避免样本不足
        const existing = await this.userPrisma.userWord.findMany({
            where: { userId },
            select: { wordId: true },
        });
        const owned = new Set(existing.map((e) => e.wordId));

        const needed = count;
        const picked: number[] = [];
        let page = 0;
        const pageSize = Math.max(needed * 5, 50); // 每页扩大样本，至少 50 个

        while (picked.length < needed) {
            const batch = await this.wordPrisma.stardict.findMany({
                where: {
                    tag: {
                        contains: plan.tag,
                    },
                },
                orderBy: [{ frq: 'desc' }],
                skip: page * pageSize,
                take: pageSize,
            });

            if (batch.length === 0) {
                break; // 没有更多词了
            }

            for (const w of batch) {
                if (!owned.has(w.id)) {
                    picked.push(w.id);
                    if (picked.length >= needed) {
                        break;
                    }
                }
            }

            page += 1;
        }

        if (picked.length === 0) {
            return {
                added: 0,
                wordIds: [],
                quota,
                remaining: remainingAfterRequest,
            };
        }

        await this.userPrisma.userWord.createMany({
            data: picked.slice(0, needed).map((id) => ({
                userId,
                planId,
                wordId: id,
                status: ReviewStatus.NEW,
            })),
            skipDuplicates: true,
        });

        return {
            added: Math.min(picked.length, needed),
            wordIds: picked.slice(0, needed),
            quota,
            remaining: remainingAfterRequest,
        };
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
        if (userWord.nextReviewAt && now < userWord.nextReviewAt) {
            return {
                skipped: true,
                nextReviewAt: userWord.nextReviewAt,
            };
        }

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
            },
        });

        return updated;
    }
}
