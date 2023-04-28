const errors = {
  UserExists: {
    statusCode: 409,
    message: 'User already exists',
  },
  WrongCredentials: {
    statusCode: 401,
    message: 'Invalid username or password',
  },
  Unauthorized: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  Unknown: {
    statusCode: 500,
    message: 'Unknown error',
  },
  BadRequest: {
    statusCode: 400,
    message: 'Bad request',
  },
  RefreshFailure: {
    statusCode: 401,
    message: 'Failed to refresh token',
  },
  NotFound: {
    statusCode: 404,
    message: 'Not Found',
  },
  Forbidden: {
    statusCode: 403,
    message: 'Forbidden',
  },
}

type ErrorName = keyof typeof errors

type ErrorPayloads = {
  Unauthorized: {
    isExpiredToken: boolean
  }
  BadRequest: any
}

// type ErrorPayloads {
//   UserExistsError: undefined
//   AuthenticationError: undefined
//   UnknownError: undefined
//   BadRequestError: undefined
//   RefreshTokenError: undefined
//   UnauthorizedError: {
//     isExpiredToken: boolean
//   }
//   NotFoundError: undefined
//   ForbiddenError: undefined
// }
// -> ErrorPayloadsWithDefault
type ErrorPayloadsWithDefault = Omit<
  Record<ErrorName, undefined>,
  keyof ErrorPayloads
> &
  ErrorPayloads

export default class AppError extends Error {
  public statusCode: number

  constructor(
    public name: ErrorName,
    public payload?: ErrorPayloadsWithDefault[ErrorName],
  ) {
    const errorInfo = errors[name]
    super(errorInfo.message)
    this.statusCode = errorInfo.statusCode
  }
}
