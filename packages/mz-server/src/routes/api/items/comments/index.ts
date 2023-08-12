import { CommentsRouteSchema } from './schema.js'
import { createAuthorizedRoute } from '../../../../plugins/requireAuthPlugin.js'
import commentService from '../../../../services/comment.service.js'
import { FastifyPluginAsyncTypebox } from '../../../../lib/types.js'

export const commentsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    { schema: CommentsRouteSchema.GetComments },
    async (request) => {
      /**@todos 조회 후 시리얼라이징 */

      return commentService.getComments({
        itemId: request.params.id,
        userId: request.user?.id,
      }) as any
    },
  )

  fastify.get(
    '/:commentId',
    { schema: CommentsRouteSchema.GetComment },
    async (request) => {
      return commentService.getComment({
        commentId: request.params.commentId,
        userId: request.user?.id,
        withSubcomments: true,
      }) as any
    },
  )

  fastify.get(
    '/:commentId/subcomments',
    { schema: CommentsRouteSchema.GetSubcomments },
    async (request) => {
      const { commentId } = request.params
      return commentService.getSubcomments({
        commentId,
        userId: request.user?.id,
      }) as any
    },
  )

  fastify.register(authorizedItemRoute)
}

const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  fastify.post(
    '/',
    { schema: CommentsRouteSchema.CreateComment },
    async (request) => {
      const { parentCommentId, text } = request.body
      const { id } = request.params
      const userId = request.user!.id
      return commentService.createComment({
        itemId: id,
        text,
        parentCommentId: parentCommentId ?? undefined,
        userId,
      }) as any
    },
  )

  fastify.post(
    '/:commentId/likes',
    { schema: CommentsRouteSchema.LikeComment },
    async (request) => {
      const { commentId } = request.params
      const userId = request.user!.id
      const likes = await commentService.likeComment({ commentId, userId })
      return { id: commentId, likes }
    },
  )

  fastify.delete(
    '/:commentId/likes',
    { schema: CommentsRouteSchema.UnlikeComment },
    async (request) => {
      const { commentId } = request.params
      const userId = request.user!.id
      const likes = await commentService.unlikeComment({ commentId, userId })
      return { id: commentId, likes }
    },
  )

  fastify.delete(
    '/:commentId',
    { schema: CommentsRouteSchema.DeleteComment },
    async (request, response) => {
      const { commentId } = request.params
      const userId = request.user!.id
      await commentService.deleteComment({ commentId, userId })
      response.status(204)
    },
  )

  fastify.patch(
    '/:commentId',
    { schema: CommentsRouteSchema.UpdateComment },
    async (request) => {
      const { commentId } = request.params
      const { text } = request.body
      const userId = request.user!.id
      return commentService.updateComment({ commentId, text, userId }) as any
    },
  )
})
