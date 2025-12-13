import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'] as
            | string
            | undefined;
        const defaultUser = process.env.DEFAULT_USER_ID;

        if (!authHeader) {
            if (defaultUser) {
                request.user = { id: defaultUser };
                return true;
            }
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [scheme, token] = authHeader.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
            throw new UnauthorizedException('Invalid Authorization header');
        }

        try {
            const payload = this.jwt.verify<{ sub: string }>(token);
            request.user = { id: payload.sub };
            return true;
        } catch (err) {
            throw new UnauthorizedException(
                err instanceof Error ? err.message : 'Invalid token',
            );
        }
    }
}
