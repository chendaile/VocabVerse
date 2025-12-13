import { Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserPrismaService } from '../database';

interface DevLoginDto {
    userId?: string;
    externalId?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly userPrisma: UserPrismaService,
    ) {}

    async devLogin(dto: DevLoginDto) {
        let userId = dto.userId;

        if (userId) {
            const existing = await this.userPrisma.user.findUnique({
                where: { id: userId },
            });
            if (!existing) {
                await this.userPrisma.user.create({
                    data: {
                        id: userId,
                        externalId: dto.externalId,
                    },
                });
            }
        } else {
            const created = await this.userPrisma.user.create({
                data: {
                    externalId: dto.externalId,
                },
            });
            userId = created.id;
        }

        const token = this.jwt.sign({ sub: userId });
        return { token, userId };
    }
}
