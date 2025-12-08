import { BadRequestException, Controller, Get, Query, Redirect } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('wechat/authorize')
  @Redirect()
  authorize() {
    const state = this.authService.createState()
    const url = this.authService.buildAuthorizeUrl(state)
    return { url }
  }

  @Get('wechat/callback')
  async callback(@Query('code') code?: string, @Query('state') state?: string) {
    if (!code || !state) {
      throw new BadRequestException('Missing code or state')
    }
    this.authService.validateAndConsumeState(state)
    const wechatToken = await this.authService.exchangeCode(code)
    const appToken = this.authService.issueAppToken(wechatToken.openid)
    return {
      openid: wechatToken.openid,
      token: appToken,
      scope: wechatToken.scope,
      expires_in: wechatToken.expires_in
    }
  }
}
