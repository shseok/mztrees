import { Comment } from '@prisma/client'
import AppError from '../lib/AppError.js'
import db from '../lib/db.js'

class CommentService {
  private static instance: CommentService
  public static getInstance(): CommentService {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService()
    }
    return CommentService.instance
  }

  async getComments(itemId: number) {
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
    return this.groupSubComments(this.redact(comments))
  }

  redact(comments: Comment[]) {
    return comments.map((comment) => {
      if (!comment.deletedAt) return comment
      const someDate = new Date(0)
      return {
        ...comment,
        likesCount: 0,
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
      }
    })
  }

  async groupSubComments(comments: Comment[]) {
    const rootComments = comments.filter(
      (comment) => comment.parentCommentId === null,
    )
    const subcommentsMap = new Map<number, Comment[]>()
    comments.forEach((comment) => {
      if (!comment.parentCommentId) return
      const array = subcommentsMap.get(comment.parentCommentId) ?? []
      array.push(comment)
      subcommentsMap.set(comment.parentCommentId, array)
    })
    const merged = rootComments.map((rootComment) => ({
      ...rootComment,
      subcomments: subcommentsMap.get(rootComment.id) ?? [],
    }))
    return merged
  }

  /* commentId, withSubcomments(deafult=false)
   * 데이터가 없을 경우 오류작업을 위함
   */
  async getComment(commentId: number, withSubcomments: boolean = false) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })
    if (!comment || comment.deletedAt) {
      throw new AppError('NotFoundError')
    }
    if (withSubcomments) {
      const subcomments = await this.getSubcomments(commentId)
      return { ...comment, subcomments }
    }
    return comment
  }
  async getSubcomments(commentId: number) {
    return db.comment.findMany({
      where: {
        parentCommentId: commentId,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
        mentionUser: true,
      },
    })
  }
  async createComment({
    itemId,
    text,
    parentCommentId,
    userId,
  }: CreateCommentParams) {
    /** parent comment is valid */
    const parentComment = parentCommentId
      ? await this.getComment(parentCommentId)
      : null
    const rootParentCommentId = parentComment?.parentCommentId
    const targetParentCommentId = rootParentCommentId ?? parentCommentId
    // 대대댓글이면서 자신이 쓴 글이 아닌 다른 유저의 글을 멘션한 경우
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

    return { ...comment, subcomments: [] }
  }
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
  }
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
  }

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
        likesCount: count,
      },
    })
    return count
  }

  async countAndSyncComments(itemId: number) {
    const count = await db.comment.count({
      where: {
        itemId,
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
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId)
    if (comment.userId !== userId) {
      throw new AppError('ForbiddenError')
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
  }
  async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await this.getComment(commentId)
    if (comment.userId !== userId) {
      throw new AppError('ForbiddenError')
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
    return this.getComment(commentId, true)
  }
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

export default CommentService
