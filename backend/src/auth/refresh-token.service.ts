import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID
} from 'crypto'
import { Repository } from 'typeorm'
import { InvalidRefreshTokenException } from './auth.exception'
import { AppConfig } from '../config/config'
import { RefreshToken } from './refresh-token.entity'

const IV_LENGTH = 12

function sha256 (content: string): Buffer {
  return createHash('sha256').update(content).digest()
}

@Injectable()
export default class RefreshTokenService {
  private readonly key: Buffer

  constructor (
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    private readonly config: AppConfig
  ) {
    this.key = sha256(this.config.refreshTokenSecret)
  }

  private encrypt (plaintext: string): string {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv('aes-256-gcm', this.key, iv)
    const ciphertext = cipher.update(plaintext, 'utf8', 'hex')
    return ciphertext + iv.toString('hex')
  }

  private decrypt (ciphertext: string): string {
    const iv = Buffer.from(
      ciphertext.slice(ciphertext.length - IV_LENGTH * 2, ciphertext.length),
      'hex'
    )
    ciphertext = ciphertext.slice(0, ciphertext.length - IV_LENGTH * 2)

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv)
    const plaintext = decipher.update(ciphertext, 'hex', 'utf8')
    return plaintext
  }

  async get (user: { uid: number }): Promise<string> {
    let token = await this.refreshTokensRepository.findOne({
      where: { uid: user.uid }
    })
    if (token === null) {
      token = new RefreshToken()
      token.uid = user.uid
      token.refreshToken = randomUUID()
      await this.refreshTokensRepository.save(token)
    }
    const cipher = this.encrypt(token.refreshToken)
    return cipher
  }

  async verify (refreshToken: string): Promise<number> {
    const plain = this.decrypt(refreshToken)
    const token = await this.refreshTokensRepository.findOne({
      where: { refreshToken: plain }
    })
    if (token !== null) {
      return token.uid
    } else {
      throw new InvalidRefreshTokenException()
    }
  }

  async invalidate (user: { uid: number }): Promise<void> {
    await this.refreshTokensRepository.delete({ uid: user.uid })
  }
}
