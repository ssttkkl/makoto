import { Request, Controller, Post, UseGuards, Body } from '@nestjs/common'
import { type Token } from './auth.dto'
import AuthService from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

// class LoginRequest {
//   readonly username: string
//   readonly password: string
// }

class RefreshRequestBody {
  readonly refreshToken: string
}

@Controller('v1/auth')
export default class AuthController {
  constructor (private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (@Request() req): Promise<Token> {
    return await this.authService.login(req.user)
  }

  @Post('refresh')
  async refresh (@Body() body: RefreshRequestBody): Promise<Token> {
    return await this.authService.refresh(body.refreshToken)
  }
}
