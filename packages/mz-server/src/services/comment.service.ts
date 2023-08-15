import { Comment, CommentLike } from '@prisma/client'
import AppError from '../lib/AppError.js'
import db from '../lib/db.js'

const commentService = {
  async getComments({
    itemId,
    userId = null,
  }: {
    itemId: number
    userId?: number | null
  }) {
    const comments = await db.comment.findMany({
      where: {
        itemId,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })
    // TODO: refactor
    const commentLikedMap = userId
      ? await this.getCommentLikedMap({
          commentIds: comments.map((c) => c.id),
          userId,
        })
      : {}

    const commentsWithIsLiked = comments.map((comment) => ({
      ...comment,
      isLiked: !!commentLikedMap[comment.id],
    }))
    return this.groupSubComments(this.redact(commentsWithIsLiked))
  },
  /** TODO: rename to serialize (정확히 x) */
  redact(comments: Comment[]) {
    return comments.map((comment) => {
      if (!comment.deletedAt) {
        return { ...comment, isDeleted: false }
      }
      const someDate = new Date(0)
      return {
        ...comment,
        likes: 0,
        createdAt: someDate,
        updatedAt: someDate,
        subcommentsCount: 0,
        text: '',
        user: {
          id: -1,
          username: 'deleted',
        },
        mentionUser: null,
        subcomments: [],
        isDeleted: true,
      }
    })
  },

  async groupSubComments<T extends Comment>(comments: T[]) {
    const rootComments = comments.filter(
      (comment) => comment.parentCommentId === null,
    )
    const subcommentsMap = new Map<number, T[]>()
    comments.forEach((comment) => {
      if (!comment.parentCommentId) return
      if (comment.deletedAt !== null) return
      const array = subcommentsMap.get(comment.parentCommentId) ?? []
      array.push(comment)
      subcommentsMap.set(comment.parentCommentId, array)
    })
    const merged = rootComments.map((rootComment) => ({
      ...rootComment,
      subcomments: subcommentsMap.get(rootComment.id) ?? [],
    }))
    return merged.filter(
      (comments) =>
        comments.deletedAt === null || comments.subcomments.length !== 0,
    )
  },

  /* commentId, withSubcomments(deafult=false)
   * 데이터가 없을 경우 오류작업을 위함
   */
  async getComment({
    commentId,
    withSubcomments = false,
    userId = null,
  }: {
    commentId: number
    withSubcomments?: boolean
    userId?: number | null
  }) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })
    const commentLike = userId
      ? await db.commentLike.findUnique({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        })
      : null

    if (!comment || comment.deletedAt) {
      throw new AppError('NotFound')
    }
    if (withSubcomments) {
      const subcomments = await this.getSubcomments({ commentId, userId })
      return {
        ...comment,
        isLiked: !!commentLike,
        subcomments,
        isDeleted: false,
      }
    }
    return { ...comment, isLiked: !!commentLike, isDeleted: false }
  },
  async getSubcomments({
    commentId,
    userId = null,
  }: {
    commentId: number
    userId?: number | null
  }) {
    const subcomments = await db.comment.findMany({
      where: {
        parentCommentId: commentId,
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })

    const subcommentLikedMap = userId
      ? await this.getCommentLikedMap({
          commentIds: subcomments.map((sc) => sc.id),
          userId,
        })
      : {}

    return subcomments.map((sc) => ({
      ...sc,
      isLiked: !!subcommentLikedMap[sc.id],
      isDeleted: false,
    }))
  },
  async createComment({
    itemId,
    text,
    parentCommentId,
    userId,
  }: CreateCommentParams) {
    if (text.length > 300 || text.length === 0) {
      throw new AppError('BadRequest', {
        message: 'comment length is invalid',
      })
    }

    /** parent comment is valid */
    const parentComment = parentCommentId
      ? await this.getComment({ commentId: parentCommentId })
      : null
    const rootParentCommentId = parentComment?.parentCommentId
    const targetParentCommentId = rootParentCommentId ?? parentCommentId
    // 대대댓글이면서 자신이 쓴 글이 아닌 다른 유저의 글을 멘션한 경우 (댓글의 경우 멘션 적용 x)
    const shouldMention =
      !!rootParentCommentId && userId !== parentComment?.userId
    /** handle mention user id */
    const comment = await db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId: targetParentCommentId,
        mentionUserId: shouldMention ? parentComment?.userId : null,
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })
    /** update subcomment count */
    if (parentCommentId) {
      const subcommentsCount = await db.comment.count({
        where: {
          parentCommentId: targetParentCommentId,
        },
      })
      await db.comment.update({
        where: {
          id: targetParentCommentId,
        },
        data: {
          subcommentsCount,
        },
      })
    }
    await this.countAndSyncComments(itemId)

    return { ...comment, isDeleted: false, subcomments: [], isLiked: false }
  },

  async likeComment({ commentId, userId }: CommentParams) {
    try {
      await db.commentLike.create({
        data: {
          userId,
          commentId,
        },
      })
    } catch (e) {
      console.error(e)
    }
    /**count likes and update */
    const count = await this.countAndSyncCommentLikes(commentId)
    return count
  },

  async unlikeComment({ commentId, userId }: CommentParams) {
    try {
      await db.commentLike.delete({
        where: {
          commentId_userId: {
            userId,
            commentId,
          },
        },
      })
    } catch (e) {}
    /** count likes and update */
    const count = await this.countAndSyncCommentLikes(commentId)
    return count
  },

  async countAndSyncCommentLikes(commentId: number) {
    const count = await db.commentLike.count({
      where: {
        commentId,
      },
    })
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: count,
      },
    })
    return count
  },

  async countAndSyncComments(itemId: number) {
    const count = await db.comment.count({
      where: {
        itemId,
        deletedAt: null,
      },
    })

    await db.itemStats.update({
      where: {
        itemId,
      },
      data: {
        commentsCount: count,
      },
    })
    return count
  },

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment({ commentId })
    if (comment.userId !== userId) {
      throw new AppError('Forbidden')
    }
    // await db.comment.delete({
    //   where: {
    //     id: commentId,
    //   },
    // })
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    this.countAndSyncComments(comment.itemId)
  },

  async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await this.getComment({ commentId })
    if (comment.userId !== userId) {
      throw new AppError('Forbidden')
    }
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
      include: {
        user: true,
      },
    })
    return this.getComment({ commentId, withSubcomments: true })
  },

  async getCommentLikedMap({
    commentIds,
    userId,
  }: {
    commentIds: number[]
    userId: number
  }) {
    const list = await db.commentLike.findMany({
      where: {
        userId,
        commentId: {
          in: commentIds,
        },
      },
    })
    // for find easelly with commentId
    return list.reduce((acc, cur) => {
      acc[cur.commentId] = cur
      return acc
    }, {} as Record<number, CommentLike>)
  },
}

interface CreateCommentParams {
  itemId: number
  text: string
  parentCommentId?: number
  userId: number
}

interface CommentParams {
  commentId: number
  userId: number
}

interface UpdateCommentParams extends CommentParams {
  text: string
}

export default commentService
