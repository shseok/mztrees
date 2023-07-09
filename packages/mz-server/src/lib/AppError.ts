import { Type, TSchema } from '@fastify/type-provider-typebox'

const errors = {
  BadRequest: {
    statusCode: 400,
    message: 'Bad request',
  },
  WrongCredentials: {
    statusCode: 401,
    message: 'Invalid username or password',
  },
  Unauthorized: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  RefreshFailure: {
    statusCode: 401,
    message: 'Failed to refresh token',
  },
  Forbidden: {
    statusCode: 403,
    message: 'Forbidden',
  },
  NotFound: {
    statusCode: 404,
    message: 'Not Found',
  },
  AlreadyExists: {
    statusCode: 409,
    message: 'Already exists',
  },
  UserExists: {
    statusCode: 409,
    message: 'User already exists',
  },
  InvalidURL: {
    statusCode: 422,
    message: 'Invalid URL',
  },
  Unknown: {
    statusCode: 500,
    message: 'Unknown error',
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
    public payload?: ErrorPayloadsWithDefault[ErrorName] | { message?: string },
  ) {
    const errorInfo = errors[name]
    super(payload?.message ?? errorInfo.message)
    // if (payload?.message) {
    //   delete payload.message
    // }
    this.statusCode = errorInfo.statusCode
  }
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError
}

export function createAppErrorSchema<T, P extends TSchema>(
  name: ErrorName,
  examplePayload?: ErrorPayloadsWithDefault[ErrorName],
  payloadSchema?: P,
) {
  const example = { ...errors[name], payload: examplePayload }
  const schema = Type.Object({
    name: Type.String(),
    message: Type.String(),
    statusCode: Type.Number(),
    ...(payloadSchema ? { payload: payloadSchema } : {}),
  })
  schema.example = example
  return schema
}
