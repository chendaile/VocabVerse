import { Injectable } from '@nestjs/common';
import { ReviewGrade, ReviewStatus } from '@prisma/user-client';
import {
    ReviewHistory,
    ReviewStrategy,
    ScheduleResult,
} from './review-strategy.interface';

@Injectable()
export class SimpleReviewStrategy implements ReviewStrategy {
    calc(
        history: ReviewHistory,
        grade: ReviewGrade,
        now: Date,
    ): ScheduleResult {
        const next = new Date(now);
        switch (grade) {
            case 'GOOD':
                next.setDate(next.getDate() + 1);
                break;
            case 'HARD':
                next.setHours(next.getHours() + 12);
                break;
            case 'FAIL':
            default:
                next.setHours(next.getHours() + 1);
                break;
        }

        let nextStatus: ReviewStatus = 'REVIEW';
        if (grade === 'GOOD' && history.reviewedTimes >= 3) {
            nextStatus = 'MASTERED';
        } else if (history.status === 'NEW') {
            nextStatus = 'LEARNING';
        } else {
            nextStatus = 'REVIEW';
        }

        return {
            nextReviewAt: next,
            status: nextStatus,
        };
    }
}
