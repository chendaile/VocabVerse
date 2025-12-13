import { UserWordsService } from './user-words.service';
import { ReviewStatus } from '@prisma/user-client';

describe('UserWordsService', () => {
    const mockPlan = {
        id: 'plan1',
        userId: 'u1',
        tag: 'cet4',
        dailyNewTarget: 3,
        dailyReviewTarget: 10,
    };

    const mockUserPrisma: any = {
        userPlan: {
            findFirst: jest.fn().mockResolvedValue(mockPlan),
        },
        userWord: {
            count: jest.fn().mockResolvedValue(0),
            findMany: jest.fn().mockResolvedValue([]),
            createMany: jest.fn().mockResolvedValue({ count: 1 }),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        userWordLog: {
            create: jest.fn(),
        },
    };

    const mockWordPrisma: any = {
        stardict: {
            findMany: jest
                .fn()
                .mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
        },
    };

    const mockStrategy = {
        calc: jest.fn(),
    };

    let service: UserWordsService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UserWordsService(
            mockUserPrisma,
            mockWordPrisma,
            mockStrategy as any,
        );
    });

    it('enforces daily quota when enqueueing', async () => {
        mockUserPrisma.userWord.count.mockResolvedValue(2); // already added today
        const res = await service.enqueueNewWords('u1', 'plan1', { count: 5 });
        expect(mockWordPrisma.stardict.findMany).toHaveBeenCalled();
        expect(mockUserPrisma.userWord.createMany).toHaveBeenCalled();
        expect(res.added).toBe(1); // quota = 1 (3 target - 2 existing)
        expect(res.remaining).toBe(0);
    });

    it('returns empty when quota is exhausted', async () => {
        mockUserPrisma.userWord.count.mockResolvedValue(5);
        const res = await service.enqueueNewWords('u1', 'plan1', { count: 2 });
        expect(res.added).toBe(0);
        expect(res.remaining).toBe(0);
    });

    it('passes result to strategy and updates review stats', async () => {
        mockUserPrisma.userWord.findFirst.mockResolvedValue({
            id: 'uw1',
            userId: 'u1',
            planId: 'plan1',
            wordId: 1,
            status: ReviewStatus.NEW,
            reviewedTimes: 0,
            correct: 0,
            wrong: 0,
            nextReviewAt: null,
        });
        mockStrategy.calc.mockReturnValue({
            nextReviewAt: new Date(),
            status: ReviewStatus.REVIEW,
        });
        await service.submitReview('u1', 1, { result: 'GOOD' });
        expect(mockStrategy.calc).toHaveBeenCalled();
        expect(mockUserPrisma.userWord.update).toHaveBeenCalled();
        expect(mockUserPrisma.userWordLog.create).toHaveBeenCalled();
    });

    it('skips review if not due yet', async () => {
        mockUserPrisma.userWord.findFirst.mockResolvedValue({
            id: 'uw1',
            userId: 'u1',
            planId: 'plan1',
            wordId: 1,
            status: ReviewStatus.REVIEW,
            reviewedTimes: 1,
            correct: 1,
            wrong: 0,
            nextReviewAt: new Date(Date.now() + 60 * 60 * 1000),
        });
        const res = await service.submitReview('u1', 1, { result: 'GOOD' });
        expect(res.skipped).toBe(true);
        expect(mockStrategy.calc).not.toHaveBeenCalled();
        expect(mockUserPrisma.userWord.update).not.toHaveBeenCalled();
        expect(mockUserPrisma.userWordLog.create).not.toHaveBeenCalled();
    });
});
