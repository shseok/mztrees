import type { Item } from '@/types/db';
import type { OpenGraphType } from 'next/dist/lib/metadata/types/opengraph-types';

export const tagList = [
  '요리',
  '스포츠',
  '디자인',
  '쇼핑',
  '블로그',
  '기사',
  'IT',
  '농업',
  '날씨',
  '데이터',
  '검색',
  '문서',
  '부동산',
  '뉴스',
  '게임',
  '여행',
  '건강',
  '음식',
  '기술',
  '자동차',
  '지도',
  '예술',
  '동물',
  '환경',
] as const;

export const siteConfig = {
  mainDomain: process.env.NEXT_PUBLIC_DOMAIN!,
  imageDomain: process.env.NEXT_PUBLIC_IMAGE_DOMAIN!,
  creator: '@shseok',
  site: '@mztrees',
  type: 'website' as OpenGraphType,
  root: {
    title: 'Mztrees, 웹 사이트 공유의 장 | 엠제트리',
    description:
      '인터넷에 흩어져있는 트렌디하거나 유용한 사이트들을 엠제트리에서 확인하고 공유해보세요.',
    imageUrl: '/og-image.png',
    iconUrl: {
      favicon: '/favicon/favicon.ico',
      appleTouchIcon: '/favicon/apple-touch-icon.png',
    },
    manifestUrl: '/favicon/site.webmanifest',
  },
  post: function (item: Item) {
    const shortenDescription = item.body
      .slice(0, 300)
      .concat(item.body.length > 300 ? '...' : '');

    return {
      title: item.title,
      description: shortenDescription,
      imageUrl:
        item.thumbnail?.url ?? `${this.imageDomain}/not-fount-image.svg}`,
      type: 'article' as OpenGraphType,
      authors: item.author,
      tags: item.tags,
      path: `${this.mainDomain}/items/${item.id}`,
      publishedTime: item.createdAt,
      modifiedTime: item.updatedAt,
      section: item.tags[0] ?? '기타',
    };
  },
  auth: {
    login: {
      title: '로그인 | 엠제트리',
    },
    register: {
      title: '회원가입 | 엠제트리',
    },
  },
  bookmark: {
    title: '북마크 | 엠제트리',
  },
  setting: {
    title: '설정 | 엠제트리',
  },
  write: {
    title: '새 글 작성 | 엠제트리',
  },
  robotsNoIndex: {
    index: false,
    follow: false,
  },
} as const;
