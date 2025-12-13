import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

const header = {
    alg: 'HS256',
    typ: 'JWT',
};

function base64url(input: Buffer | string) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

@Injectable()
export class JwtService {
    private getSecret(): string {
        return process.env.JWT_SECRET || 'dev-secret';
    }

    sign(payload: Record<string, any>): string {
        const encHeader = base64url(JSON.stringify(header));
        const encPayload = base64url(JSON.stringify(payload));
        const data = `${encHeader}.${encPayload}`;
        const signature = crypto
            .createHmac('sha256', this.getSecret())
            .update(data)
            .digest();
        return `${data}.${base64url(signature)}`;
    }

    verify<T = any>(token: string): T {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token');
        }
        const [encHeader, encPayload, signature] = parts;
        const data = `${encHeader}.${encPayload}`;
        const expected = crypto
            .createHmac('sha256', this.getSecret())
            .update(data)
            .digest();
        const expectedB64 = base64url(expected);
        if (expectedB64 !== signature) {
            throw new Error('Invalid signature');
        }

        const json = Buffer.from(encPayload, 'base64').toString('utf-8');
        return JSON.parse(json) as T;
    }
}
