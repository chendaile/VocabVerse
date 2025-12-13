import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface DevLoginBody {
    userId?: string;
    externalId?: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('dev-login')
    devLogin(@Body() body: DevLoginBody) {
        return this.auth.devLogin(body);
    }
}
