import db from '../lib/db.js'
import PQueue from 'p-queue'
import { calculateScore } from '../lib/ranking.js'
import cron from 'node-cron'

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
  // TODO: postresql로 전환 후 동시성 증가시키기 (동시성 증가시 에러)
  const queue = new PQueue({ concurrency: 1 })
  const targets = await findRecalculateTargets()
  const curTime = new Date().getTime()
  console.log(`Recalculating ${targets.length} items`)
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
  console.log('Successsfully recalculated!')
  await queue.onIdle()
}

recalculate()

if (process.env.NODE_ENV === 'development') {
  cron.schedule('*/5 * * * *', recalculate)
}
