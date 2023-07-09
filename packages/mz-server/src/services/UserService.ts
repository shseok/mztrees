import AppError, { isAppError } from '../lib/AppError.js'
import db from '../lib/db.js'
import bcrypt from 'bcrypt'
import {
  RefreshTokenPayload,
  generateToken,
  validateToken,
} from '../lib/token.js'
import { Token, User } from '@prisma/client'
import { validate } from '../lib/validate.js'

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
    return token
  }

  async generateTokens(user: User, existingToken?: Token) {
    const { id: userId, username } = user
    const token = existingToken ?? (await this.createTokenId(userId))
    const tokenId = token.id
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
        rotationCounter: token.rotationCounter,
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
      throw new AppError('AlreadyExists')
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
      throw new AppError('WrongCredentials')
    }

    try {
      const result = await bcrypt.compare(password, user.passwordHash)
      if (!result) {
        throw new AppError('WrongCredentials')
      }
    } catch (e) {
      if (isAppError(e)) {
        // 위에서 비밀번호가 다를경우 던져진 에러를 받음
        throw e
      }
      // 비밀번호 비교시 발생한 임의의 에러
      throw new AppError('Unknown')
    }
    const tokens = await this.generateTokens(user)
    return {
      tokens,
      user,
    }
  }

  async refreshToken(token: string) {
    try {
      const { tokenId, rotationCounter } =
        await validateToken<RefreshTokenPayload>(token)
      const tokenItem = await db.token.findUnique({
        where: {
          id: tokenId,
        },
        include: {
          user: true,
        },
      })
      console.log(tokenItem, rotationCounter)
      if (!tokenItem) {
        throw new Error('Token not found')
      }
      if (tokenItem.blocked) {
        // 아래의 에러((tokenItem.rotationCounter !== rotationCounter)로 블락된 후 rotationCnt이 일치한 토큰으로 접근하더라도 에러
        throw new Error('Token is blocked')
      }
      // refresh토큰으로 전달받은 것(rotationCnt)과 디비에 있는 것(rotationCnt)이 다르다면 에러처리
      if (tokenItem.rotationCounter !== rotationCounter) {
        await db.token.update({
          where: {
            id: tokenId,
          },
          data: {
            blocked: true,
          },
        })
        throw new Error('Rotation counter does not match')
      }
      tokenItem.rotationCounter += 1
      await db.token.update({
        where: {
          id: tokenId,
        },
        data: {
          rotationCounter: tokenItem.rotationCounter,
        },
      })

      return this.generateTokens(tokenItem.user, tokenItem)
    } catch (e) {
      console.error(e)
      throw new AppError('RefreshFailure')
    }
  }

  async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: number
    oldPassword: string
    newPassword: string
  }) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    try {
      if (!user) {
        // 유저가 존재하지 않는다는 에러는 결국 디비의 존재유무를 알려주는것. > 그저 인증실패로 에러 표현
        throw new Error()
      }
      const result = await bcrypt.compare(oldPassword, user.passwordHash)
      if (!result) {
        // 비밀번호 불일치
        throw new Error()
      }
    } catch (e) {
      // 비밀번호 비교시 발생한 임의의 에러
      throw new AppError('Forbidden', {
        message: 'Password does not match',
      })
    }

    if (!validate.password(newPassword)) {
      throw new AppError('BadRequest', { message: 'Password is invalid' })
    }

    const passwordHash = await bcrypt.hash(newPassword, SAULT_ROUNDS)
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    })

    return true
  }

  async unregister(userId: number) {
    await db.user.delete({
      where: {
        id: userId,
      },
    })
    return true
  }
}

export default UserService
