import { Request, Body, Controller, Post, Put, UseGuards, BadRequestException, Get, Query } from '@nestjs/common'
import { type UserDto } from './user.dto'
import { User } from '../data/user.entity'
import UsersService from './users.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

class RegisterRequestBody {
  readonly username: string
  readonly password: string
  readonly nickname: string
}

class UpdatePasswordRequestBody {
  readonly oldPassword: string
  readonly newPassword: string
}

class UpdateMeRequestBody implements Omit<UserDto, 'uid' | 'username'> {
  readonly nickname: string
}

@Controller('v1/users')
export class UsersController {
  constructor (private readonly usersService: UsersService) { }

  @Get()
  async get (
    @Query('uid') uid?: number,
      @Query('username') username?: string
  ): Promise<UserDto> {
    if (uid != null) {
      return (await this.usersService.findOneByUid(uid)).toDto()
    } else if (username != null) {
      return (await this.usersService.findOneByUsername(username)).toDto()
    } else {
      throw new BadRequestException()
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe (@Request() req): Promise<UserDto> {
    const { uid } = req.user
    return (await this.usersService.findOneByUid(uid)).toDto()
  }

  @Post()
  async register (@Body() body: RegisterRequestBody): Promise<UserDto> {
    let user = new User()
    user.username = body.username
    user.password = body.password
    user.nickname = body.nickname

    user = await this.usersService.addUser(user)
    return user.toDto()
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  async updatePassword (
    @Request() req,
      @Body() body: UpdatePasswordRequestBody
  ): Promise<UserDto> {
    const user = await this.usersService.updatePassword(req.user, body.oldPassword, body.newPassword)
    return user.toDto()
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe (
    @Request() req,
      @Body() body: UpdateMeRequestBody
  ): Promise<UserDto> {
    return (await this.usersService.updateProfile(req.user, body)).toDto()
  }
}
