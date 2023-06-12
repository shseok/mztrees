import { Static, Type } from '@fastify/type-provider-typebox'

export const UserSchema = Type.Object({
  id: Type.Integer(),
  username: Type.String(),
})

UserSchema.example = {
  id: '1',
  username: 'shs',
}

export type UserSchemaType = Static<typeof UserSchema>
