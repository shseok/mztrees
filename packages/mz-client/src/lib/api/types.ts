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
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  publisher: Publisher;
  itemStats: ItemStats;
  isLiked: boolean;
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

export type ListMode = 'recent' | 'trending' | 'past';
