import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'

interface WeChatTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
  unionid?: string
  errcode?: number
  errmsg?: string
}

@Injectable()
export class AuthService {
  private readonly stateStore = new Map<string, number>()
  private readonly stateTtlMs = 5 * 60 * 1000

  constructor(private readonly config: ConfigService) {}

  createState(): string {
    const state = crypto.randomBytes(12).toString('hex')
    this.stateStore.set(state, Date.now())
    return state
  }

  validateAndConsumeState(state: string): void {
    const issuedAt = this.stateStore.get(state)
    if (!issuedAt) {
      throw new BadRequestException('Invalid state')
    }
    this.stateStore.delete(state)
    if (Date.now() - issuedAt > this.stateTtlMs) {
      throw new BadRequestException('State expired')
    }
  }

  buildAuthorizeUrl(state: string): string {
    const appId = this.config.get<string>('WECHAT_APP_ID')
    const redirect = this.config.get<string>('WECHAT_REDIRECT_URI')
    const scope = this.config.get<string>('WECHAT_SCOPE') ?? 'snsapi_base'
    if (!appId || !redirect) {
      throw new BadRequestException('WECHAT_APP_ID or WECHAT_REDIRECT_URI is missing')
    }
    const params = new URLSearchParams({
      appid: appId,
      redirect_uri: redirect,
      response_type: 'code',
      scope,
      state
    })
    return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`
  }

  async exchangeCode(code: string): Promise<WeChatTokenResponse> {
    const appId = this.config.get<string>('WECHAT_APP_ID')
    const appSecret = this.config.get<string>('WECHAT_APP_SECRET')
    if (!appId || !appSecret) {
      throw new BadRequestException('WECHAT_APP_ID or WECHAT_APP_SECRET is missing')
    }
    const tokenParams = new URLSearchParams({
      appid: appId,
      secret: appSecret,
      code,
      grant_type: 'authorization_code'
    })
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?${tokenParams.toString()}`
    const res = await fetch(url)
    const data = (await res.json()) as WeChatTokenResponse
    if (data.errcode) {
      throw new BadRequestException(`WeChat error: ${data.errmsg ?? data.errcode}`)
    }
    return data
  }

  issueAppToken(openid: string): string {
    const secret = this.config.get<string>('JWT_SECRET') ?? 'dev-secret'
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const now = Math.floor(Date.now() / 1000)
    const payload = Buffer.from(JSON.stringify({ sub: openid, iat: now, exp: now + 2 * 60 * 60 })).toString('base64url')
    const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
    return `${header}.${payload}.${signature}`
  }
}
