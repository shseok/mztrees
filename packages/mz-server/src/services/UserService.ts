import AppError from '../lib/AppError.js'
import db from '../lib/db.js'
import bcrypt from 'bcrypt'

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
    console.log(hash)
    const user = await db.user.create({
      data: {
        username,
        passwordHash: hash,
      },
    })
    return user
  }

  login() {
    return 'logged in!'
  }
}

export default UserService
