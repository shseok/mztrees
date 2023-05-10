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

      return commentService.getComments(request.params.id)
    },
  )

  fastify.get<CommentsRoute['GetComment']>(
    '/:commentId',
    { schema: CommentsRouteSchema.GetComment },
    async (request) => {
      return commentService.getComment(request.params.commentId, true)
    },
  )

  fastify.get<CommentsRoute['GetSubcomments']>(
    '/:commentId/subcomments',
    { schema: CommentsRouteSchema.GetSubcomments },
    async (request) => {
      const { commentId } = request.params
      return commentService.getSubcomments(commentId)
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
    { schema: CommentsRouteSchema.LikeComment },
    async (request) => {
      const { commentId } = request.params
      const userId = request.user!.id
      const likes = await commentService.likeComment({ commentId, userId })
      return { id: commentId, likes }
    },
  )

  fastify.delete<CommentsRoute['UnlikeComment']>(
    '/:commentId/likes',
    { schema: CommentsRouteSchema.UnlikeComment },
    async (request) => {
      const { commentId } = request.params
      const userId = request.user!.id
      const likes = await commentService.unlikeComment({ commentId, userId })
      return { id: commentId, likes }
    },
  )

  fastify.delete<CommentsRoute['DeleteComment']>(
    '/:commentId',
    { schema: CommentsRouteSchema.DeleteComment },
    async (request, response) => {
      const { commentId } = request.params
      const userId = request.user!.id
      await commentService.deleteComment({ commentId, userId })
      response.status(204)
    },
  )

  fastify.patch<CommentsRoute['UpdateComment']>(
    '/:commentId',
    { schema: CommentsRouteSchema.UpdateComment },
    async (request) => {
      const { commentId } = request.params
      const { text } = request.body
      const userId = request.user!.id
      return commentService.updateComment({ commentId, text, userId })
    },
  )
})
