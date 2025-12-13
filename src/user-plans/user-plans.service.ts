import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { UserPrismaService } from '../database';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { PlanTag } from '@prisma/user-client';

@Injectable()
export class UserPlansService {
    constructor(private readonly prisma: UserPrismaService) {}

    private validateTag(tag: PlanTag) {
        const allowed: PlanTag[] = [
            'cet4',
            'cet6',
            'gre',
            'ielts',
            'toefl',
            'ky',
        ];
        if (!allowed.includes(tag)) {
            throw new BadRequestException('Invalid tag');
        }
    }

    async create(userId: string, dto: CreatePlanDto) {
        this.validateTag(dto.tag);
        return this.prisma.userPlan.create({
            data: {
                userId,
                tag: dto.tag,
                dailyNewTarget: dto.dailyNewTarget,
                dailyReviewTarget: dto.dailyReviewTarget,
            },
        });
    }

    async list(userId: string) {
        return this.prisma.userPlan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(userId: string, planId: string, dto: UpdatePlanDto) {
        const plan = await this.prisma.userPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        return this.prisma.userPlan.update({
            where: { id: planId },
            data: {
                dailyNewTarget:
                    dto.dailyNewTarget ?? plan.dailyNewTarget,
                dailyReviewTarget:
                    dto.dailyReviewTarget ?? plan.dailyReviewTarget,
            },
        });
    }

    async remove(userId: string, planId: string) {
        const plan = await this.prisma.userPlan.findFirst({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        return this.prisma.userPlan.delete({
            where: { id: planId },
        });
    }
}
