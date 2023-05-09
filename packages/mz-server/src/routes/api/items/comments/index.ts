import { FastifyPluginAsync } from 'fastify'
import { CommentsRoute, CommentsRouteSchema } from './schema.js'
import { createAuthorizedRoute } from '../../../../plugins/requireAuthPlugin.js'
import CommentService from '../../../../services/CommentService.js'

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  const commentService = CommentService.getInstance()
  fastify.get<CommentsRoute['GetComments']>(
    '/',
    { schema: CommentsRouteSchema.GetComments },
    async (request) => {
      /**@todos 조회 후 시리얼라이징 */
      return await commentService.getComments(request.params.id)
    },
  )

  fastify.get<CommentsRoute['GetSubcomments']>(
    '/:commentId/subcomments',
    async (request) => {
      return await commentService.getSubcomments(request.params.commentId)
    },
  )

  fastify.register(authorizedItemRoute)
}

const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const commentService = CommentService.getInstance()
  fastify.post<CommentsRoute['CreateComment']>(
    '/',
    { schema: CommentsRouteSchema.CreateComment },
    async (request) => {
      const { parentCommentId, text } = request.body
      const { id } = request.params
      const userId = request.user!.id
      return await commentService.createComment({
        itemId: id,
        text,
        parentCommentId: parentCommentId ?? undefined,
        userId,
      })
    },
  )

  fastify.post<CommentsRoute['LikeComment']>(
    '/:commentId/likes',
    async (request) => {
      const { id } = request.params
      const userId = request.user!.id
      return commentService.likeComment({ commentId: id, userId })
    },
  )

  fastify.delete<CommentsRoute['UnlikeComment']>(
    '/:commentId/likes',
    async (request) => {
      const { id } = request.params
      const userId = request.user!.id
      return commentService.unlikeComment({ commentId: id, userId })
    },
  )

  fastify.delete<CommentsRoute['DeleteComment']>(
    '/:commentId',
    async (request) => {
      const { id } = request.params
      const userId = request.user!.id
      await commentService.deleteComment({ commentId: id, userId })
    },
  )

  fastify.patch<CommentsRoute['UpdateComment']>(
    '/:commentId',
    async (request) => {
      const { id } = request.params
      const { text } = request.body
      const userId = request.user!.id
      await commentService.updateComment({ commentId: id, text, userId })
      /**@todos return updated comment */
    },
  )
})
