import { PlanTag } from '@prisma/user-client';

export interface CreatePlanDto {
    tag: PlanTag;
    dailyNewTarget: number;
    dailyReviewTarget: number;
}

export interface UpdatePlanDto {
    dailyNewTarget?: number;
    dailyReviewTarget?: number;
}
