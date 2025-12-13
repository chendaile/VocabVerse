import { ReviewGrade } from '@prisma/user-client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class EnqueueNewDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    count?: number;
}

export class SubmitReviewDto {
    @IsEnum(ReviewGrade)
    result!: ReviewGrade;
}
