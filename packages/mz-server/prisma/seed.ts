import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // tag 초기 데이터 추가
  await prisma.tag.createMany({
    data: [
      { name: '요리' },
      { name: '스포츠' },
      { name: '디자인' },
      { name: '쇼핑' },
      { name: '블로그' },
      { name: '기사' },
      { name: 'IT' },
      { name: '농업' },
      { name: '날씨' },
      { name: '데이터' },
      { name: '검색' },
      { name: '문서' },
      { name: '부동산' },
      { name: '뉴스' },
      { name: '게임' },
      { name: '여행' },
      { name: '건강' },
      { name: '음식' },
      { name: '기술' },
      { name: '자동차' },
      { name: '지도' },
      { name: '예술' },
      { name: '동물' },
      { name: '환경' },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
