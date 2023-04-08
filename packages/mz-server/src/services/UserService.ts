import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../lib/token.js'

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

  async generateTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        userId,
        username,
        tokenId: 1,
      }),
      generateToken({
        type: 'refresh_token',
        tokenId: 1,
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
    const tokens = await this.generateTokens(user.id, username)
    return {
      tokens,
      user,
    }
  }

  login() {
    return 'logged in!'
  }
}

export default UserService
