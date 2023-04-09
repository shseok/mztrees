import AppError, { isAppError } from '../lib/AppError.js'
import db from '../lib/db.js'
import bcrypt from 'bcrypt'
import {
  RefreshTokenPayload,
  generateToken,
  validateToken,
} from '../lib/token.js'
import { User } from '@prisma/client'

export interface AuthParams {
  username: string
  password: string
}

const SAULT_ROUNDS = 10

class UserService {
  private static instance: UserService
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async createTokenId(userId: number) {
    const token = await db.token.create({
      data: {
        userId,
      },
    })
    return token.id
  }

  async generateTokens(user: User, existingTokenId?: number) {
    const { id: userId, username } = user
    const tokenId = existingTokenId ?? (await this.createTokenId(userId))
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        userId,
        username,
        tokenId,
      }),
      generateToken({
        type: 'refresh_token',
        tokenId,
        rotationCounter: 1,
      }),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async register({ username, password }: AuthParams) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    })

    if (exists) {
      throw new AppError('UserExistsError')
    }
    const hash = await bcrypt.hash(password, SAULT_ROUNDS)
    const user = await db.user.create({
      data: {
        username,
        passwordHash: hash,
      },
    })
    const tokens = await this.generateTokens(user)
    return {
      tokens,
      user,
    }
  }

  async login({ username, password }: AuthParams) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      // 유저가 존재하지 않는다는 에러는 결국 디비의 존재유무를 알려주는것. > 그저 인증실패로 에러 표현
      throw new AppError('AuthenticationEror')
    }

    try {
      const result = await bcrypt.compare(password, user.passwordHash)
      if (!result) {
        throw new AppError('AuthenticationEror')
      }
    } catch (e) {
      if (isAppError(e)) {
        // 위에서 비밀번호가 다를경우 던져진 에러를 받음
        throw e
      }
      // 비밀번호 비교시 발생한 임의의 에러
      throw new AppError('UnknownError')
    }
    const tokens = await this.generateTokens(user)
    return {
      tokens,
      user,
    }
  }

  async refreshToken(token: string) {
    try {
      const { tokenId } = await validateToken<RefreshTokenPayload>(token)
      const tokenItem = await db.token.findUnique({
        where: {
          id: tokenId,
        },
        include: {
          user: true,
        },
      })
      if (!tokenItem) {
        throw new Error('Token not found')
      }
      return this.generateTokens(tokenItem.user, tokenId)
    } catch (e) {
      throw new AppError('RefreshTokenError')
    }
  }
}

export default UserService
