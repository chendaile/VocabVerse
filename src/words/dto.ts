import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PlanTag } from '@prisma/user-client';

export class BatchWordsDto {
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    ids!: number[];
}

export class SearchWordsDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsEnum(PlanTag)
    tag?: PlanTag;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}
