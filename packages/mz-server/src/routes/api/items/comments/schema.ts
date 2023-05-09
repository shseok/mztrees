import { Type } from '@sinclair/typebox'
import { ItemParamsSchema } from '../schema.js'
import { Nullable } from '../../../../lib/typebox.js'
import { RoutesType, createRouteSchema } from '../../../../lib/routeSchema.js'

const CreateCommentBodySchema = Type.Object({
  text: Type.String(),
  parentCommentId: Nullable(Type.Integer()),
})

// 대댓글 작성, 대댓글 리스팅, 좋아요에 사용
const CommentsParamsSchema = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

const UpdateCommentSchema = Type.Object({
  text: Type.String(),
})

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

export type CommentsRoute = RoutesType<typeof CommentsRouteSchema>

// 리팩토링: 아래의 여러 코드 > 위의 한줄 코드

// type CreateCommentBodyType = Static<typeof CreateCommentBodySchema>
// type CommentsParamsType = Static<typeof CommentsParamsSchema>
// type UpdateCommentType = Static<typeof UpdateCommentSchema>

// export type CommentsRoute = {
//   GetComments: {
//     Params: ItemParamsType
//   }
//   CreateComment: {
//     Params: ItemParamsType
//     Body: CreateCommentBodyType
//   }
//   GetSubcomments: {
//     Params: CommentsParamsType
//   }
//   LikeComment: {
//     Params: CommentsParamsType
//   }
//   UnlikeComment: {
//     Params: CommentsParamsType
//   }
//   DeleteComment: {
//     Params: CommentsParamsType
//   }
//   UpdateComment: {
//     Params: CommentsParamsType
//     Body: UpdateCommentType
//   }
// }
