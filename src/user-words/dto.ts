import { ReviewGrade } from '@prisma/user-client';

export interface EnqueueNewDto {
    count?: number;
}

export interface SubmitReviewDto {
    result: ReviewGrade;
    durationMs?: number;
}
