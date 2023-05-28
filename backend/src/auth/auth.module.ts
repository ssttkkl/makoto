import { forwardRef, Module } from '@nestjs/common'
import AuthService from './auth.service'
import AuthController from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AppConfig } from '../config/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from 'src/users/users.module'
import { AppConfigModule } from '../config/config.module'
import { LocalStrategy } from './strategies/local.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from './refresh-token.entity'
import RefreshTokenService from './refresh-token.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    forwardRef(() => UsersModule),
    PassportModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          secret: config.jwtSecret,
          signOptions: { expiresIn: config.jwtExpiresIn }
        }
      }
    })
  ],
  providers: [AuthService, RefreshTokenService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, RefreshTokenService]
})
export class AuthModule {}
