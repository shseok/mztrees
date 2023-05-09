import { Static, Type } from '@sinclair/typebox'
import { ItemParamsSchema, ItemParamsType, ItemSchema } from '../schema.js'
import { Nullable } from '../../../../lib/typebox.js'
import { createRouteSchema } from '../../../../lib/routeSchema.js'

const CreateCommentBodySchema = Type.Object({
  text: Type.String(),
  parentCommentId: Nullable(Type.Integer()),
})

type CreateCommentBodyType = Static<typeof CreateCommentBodySchema>

// 대댓글 작성, 대댓글 리스팅, 좋아요에 사용
const CommentsParamsSchema = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

type CommentsParamsType = Static<typeof CommentsParamsSchema>

const UpdateCommentSchema = Type.Object({
  text: Type.String(),
})

type UpdateCommentType = Static<typeof UpdateCommentSchema>

/*
export const GetCommentSchema: FastifySchema = {
  params: ItemParamsSchema,
}
아래 와 같이 타입 확장을 통해 리팩토링
*/

export const CommentsRouteSchema = createRouteSchema({
  GetComments: {
    params: ItemParamsSchema,
  },
  CreateComment: {
    params: ItemParamsSchema,
    body: CreateCommentBodySchema,
  },
  GetSubcomments: {
    params: CommentsParamsSchema,
  },
  LikeComment: {
    params: CommentsParamsSchema,
  },
  UnlikeComment: {
    params: CommentsParamsSchema,
  },
  DeleteComment: {
    params: CommentsParamsSchema,
  },
  UpdateComment: {
    params: CommentsParamsSchema,
    body: UpdateCommentSchema,
  },
})

export type CommentsRoute = {
  GetComments: {
    Params: ItemParamsType
  }
  CreateComment: {
    Params: ItemParamsType
    Body: CreateCommentBodyType
  }
  GetSubcomments: {
    Params: CommentsParamsType
  }
  LikeComment: {
    Params: CommentsParamsType
  }
  UnlikeComment: {
    Params: CommentsParamsType
  }
  DeleteComment: {
    Params: CommentsParamsType
  }
  UpdateComment: {
    Params: CommentsParamsType
    Body: UpdateCommentType
  }
}
