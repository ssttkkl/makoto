import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'

@Injectable()
export class AppConfig {
  public port: number

  public databaseHost: string
  public databasePort: number
  public databaseUser: string
  public databasePassword: string
  public databaseName: string

  public jwtExpiresIn: number
  public jwtSecret: string

  public refreshTokenSecret: string

  public assetStoreLocation: string

  constructor(private readonly config: ConfigService) {
    this.port = this.get('PORT', 3000, { integer: true })

    this.databaseHost = this.getOrThrow('DATABASE_HOST')
    this.databasePort = this.getOrThrow('DATABASE_PORT', { integer: true })
    this.databaseUser = this.getOrThrow('DATABASE_USER')
    this.databaseName = this.getOrThrow('DATABASE_NAME')

    const databasePasswordFile = this.getOrThrow('DATABASE_PASSWORD_FILE')
    this.databasePassword = fs.readFileSync(databasePasswordFile, { encoding: 'utf8', flag: 'r' })

    this.jwtExpiresIn = this.get('JWT_EXPIRES_IN', 3600, { integer: true })

    const jwtSecretFile = this.getOrThrow('JWT_SECRET_FILE')
    this.jwtSecret = fs.readFileSync(jwtSecretFile, { encoding: 'utf8', flag: 'r' })

    const refreshTokenSecretFile = this.getOrThrow('REFRESH_TOKEN_SECRET_FILE')
    this.refreshTokenSecret = fs.readFileSync(refreshTokenSecretFile, { encoding: 'utf8', flag: 'r' })

    this.assetStoreLocation = this.get('ASSET_STORE_LOCATION', '')
  }

  private getOrThrow(key: string, opts?: { integer?: boolean }): any {
    const value = this.config.getOrThrow(key)
    if (opts?.integer === true) {
      return Number.parseInt(value)
    } else {
      return value
    }
  }

  private get<T>(key: string, defaultValue: T, opts?: { integer?: boolean }): any {
    const value = this.config.get(key, defaultValue)
    if (opts?.integer === true) {
      return Number.parseInt(value)
    } else {
      return value
    }
  }
}
