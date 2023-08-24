import { RegionType, areaList } from "@/lib/const";

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
  regionCategory: RegionCategory;
  area: Area;
  itemStats: ItemStats;
  isLiked: boolean;
  isBookmarked: boolean;
}

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

export type ListMode = "recent" | "trending" | "past";
export type Size = "small" | "medium" | "large";

export interface Bookmark {
  id: number;
  createdAt: string;
  item: Item;
}

export type GetBookmarksResult = Pagination<Bookmark>;

export interface ExtractedUrlsResult {
  urls: string[];
}

export type RegionCategoryType = keyof typeof areaList;
// type RegionType = {
//   [category in RegionCategoryType]: (typeof areaList)[category];
// };

export type RegionType = {
  regionCategory: RegionCategoryType;
  area: string;
};

// export type AreaType = {
//   region: RegionCategoryType;
//   area: (typeof areaList)[RegionCategoryType][number]; // areaList의 값 추론
// };

type RegionCategory = {
  id: number;
  name: RegionCategoryType;
};

type Area = {
  id: number;
  name: string;
};

export type MutateItemParams = {
  title: string;
  body: string;
  link: string;
  thumbnail?: string;
} & RegionType;
