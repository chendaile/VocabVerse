import { SimpleReviewStrategy } from './simple-review-strategy';

describe('SimpleReviewStrategy', () => {
    const strategy = new SimpleReviewStrategy();
    const baseHistory = {
        status: 'NEW' as const,
        reviewedTimes: 0,
        correct: 0,
        wrong: 0,
        nextReviewAt: null,
    };

    it('sets nextReviewAt based on grade', () => {
        const now = new Date('2024-01-01T00:00:00Z');
        const hard = strategy.calc(baseHistory, 'HARD', now);
        const fail = strategy.calc(baseHistory, 'FAIL', now);
        const good = strategy.calc(baseHistory, 'GOOD', now);

        expect(hard.nextReviewAt.getTime()).toBe(
            new Date('2024-01-01T12:00:00Z').getTime(),
        );
        expect(fail.nextReviewAt.getTime()).toBe(
            new Date('2024-01-01T01:00:00Z').getTime(),
        );
        expect(good.nextReviewAt.getTime()).toBe(
            new Date('2024-01-02T00:00:00Z').getTime(),
        );
    });

    it('promotes to MASTERED after multiple GOOD', () => {
        const history = {
            ...baseHistory,
            status: 'REVIEW' as const,
            reviewedTimes: 3,
        };
        const res = strategy.calc(history, 'GOOD', new Date());
        expect(res.status).toBe('MASTERED');
    });
});
