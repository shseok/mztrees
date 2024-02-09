import { tagList } from '@/lib/const';

interface Pagination<T> {
  list: T[];
  totalCount: number;
  pageInfo: PageInfo;
}

export type GetItemsResult = Pagination<Item>;

export interface Item {
  id: number;
  title: string;
  body: string;
  link: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  publisher: Publisher;
  thumbnail: Thumbnail | null;
  tags: TagList;
  itemStats: ItemStats;
  isLiked: boolean;
  isBookmarked: boolean;
}

// just wanna get id and updatedAt in Item Type
export type ItemForSitemap = Pick<Item, 'id' | 'updatedAt'>;

export interface Thumbnail {
  id: number;
  key: string;
  url: string;
  ref: string;
}
export interface Publisher {
  id?: number;
  name: string;
  domain: string;
  favicon: string | null;
}

export interface User {
  id: number;
  username: string;
}
export interface PageInfo {
  nextOffset?: number | null;
  endCursor: number | null;
  hasNextPage: boolean;
}

export interface ItemStats {
  id: number;
  likes: number;
  commentsCount: number;
}

export interface LikeItemResult {
  id: number;
  itemStats: ItemStats;
  isLiked: boolean;
}

export type UnlikeItemResult = LikeItemResult;

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  subcommentsCount: number;
  subcomments?: Comment[];
  user: User;
  mentionUser: User | null;
  isDeleted: boolean;
  isLiked: boolean;
}

export interface LikeCommentResult {
  id: number;
  likes: number;
}

export type UnlikeCommentResult = LikeCommentResult;

export interface SearchItemResult {
  id: number;
  link: string;
  author: string | null;
  publisher: Publisher;
  likes: number;
  title: string;
  body: string;
  hightlight: Hightlight;
}

export interface Hightlight {
  title: string;
  body: string;
}

export type SearchItemsResult = Pagination<SearchItemResult>;

export type SortMode = 'recent' | 'trending' | 'past';
export type Size = 'small' | 'medium' | 'large';

export interface GetItemsParams {
  mode: SortMode;
  tag?: Tag;
  cursor?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface Bookmark {
  id: number;
  createdAt: string;
  item: Item;
}

export type GetBookmarksResult = Pagination<Bookmark>;

export interface ExtractedUrlsResult {
  urls: string[];
}

export type MutateItemParams = {
  title: string;
  body: string;
  link: string;
  thumbnail?: string;
} & TagType;

export type Tag = (typeof tagList)[number];
export type TagList = Tag[];

type TagType = {
  tags: TagList;
};

export type View = 'list' | 'card';

type ThumbnailType = {
  extracted: string[];
  selected?: string;
};

export type FormType = {
  link: string;
  title: string;
  body: OutputData | null;
  thumbnail: ThumbnailType;
  id?: string;
  tags: TagList;
};
