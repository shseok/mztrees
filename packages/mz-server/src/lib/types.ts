// re-declare
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import {
  FastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  FastifyPluginOptions,
} from 'fastify'

type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>

export type FastifyPluginAsyncTypebox<
  Options extends FastifyPluginOptions = Record<never, never>,
> = (instance: FastifyTypebox, opts: Options) => Promise<void>
