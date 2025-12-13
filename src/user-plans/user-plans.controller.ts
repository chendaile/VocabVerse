import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserPlansService } from './user-plans.service';
import type { CreatePlanDto, UpdatePlanDto } from './dto';

@Controller('me/plans')
@UseGuards(AuthGuard)
export class UserPlansController {
    constructor(private readonly plans: UserPlansService) {}

    @Post()
    create(@Req() req: any, @Body() body: CreatePlanDto) {
        return this.plans.create(req.user.id, body);
    }

    @Get()
    list(@Req() req: any) {
        return this.plans.list(req.user.id);
    }

    @Patch(':planId')
    update(
        @Req() req: any,
        @Param('planId') planId: string,
        @Body() body: UpdatePlanDto,
    ) {
        return this.plans.update(req.user.id, planId, body);
    }

    @Delete(':planId')
    remove(@Req() req: any, @Param('planId') planId: string) {
        return this.plans.remove(req.user.id, planId);
    }
}
