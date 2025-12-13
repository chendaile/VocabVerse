import { ReviewGrade, ReviewStatus } from '@prisma/user-client';

export interface ReviewHistory {
    status: ReviewStatus;
    reviewedTimes: number;
    correct: number;
    wrong: number;
    nextReviewAt?: Date | null;
}

export interface ScheduleResult {
    nextReviewAt: Date;
    status: ReviewStatus;
}

export interface ReviewStrategy {
    calc(history: ReviewHistory, grade: ReviewGrade, now: Date): ScheduleResult;
}
