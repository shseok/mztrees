import db from '../lib/db.js'
import PQueue from 'p-queue'
import { calculateScore } from '../lib/ranking.js'

export async function findRecalculateTargets() {
  const data = await db.itemStats.findMany({
    where: {
      // score: {
      //   lte: 0.001,
      // },
    },
    select: {
      itemId: true,
      likes: true,
      item: {
        select: {
          createdAt: true,
        },
      },
    },
  })

  return data
}

export async function recalculate() {
  // 동시에 실행할 수 있는 task 개수
  const queue = new PQueue({ concurrency: 10 })
  const targets = await findRecalculateTargets()
  const curTime = new Date().getTime()
  targets.forEach(async (itemStat) => {
    const hourAge =
      (curTime - new Date(itemStat.item.createdAt).getTime()) / 1000 / 60 / 60
    const score = calculateScore(itemStat.likes, hourAge)
    await queue.add(
      async () =>
        await db.itemStats.update({
          where: {
            itemId: itemStat.itemId,
          },
          data: {
            score,
          },
        }),
    )
  })
  return queue.onIdle()
}

// register crons
