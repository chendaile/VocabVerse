import { PlanTag } from '@prisma/user-client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreatePlanDto {
    @IsEnum(PlanTag)
    tag!: PlanTag;

    @IsInt()
    @Min(1)
    dailyNewTarget!: number;

    @IsInt()
    @Min(1)
    dailyReviewTarget!: number;
}

export class UpdatePlanDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    dailyNewTarget?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    dailyReviewTarget?: number;
}
