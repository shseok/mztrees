import { FetchError } from "./client";

export function isNextError(e: any): e is NextAppError {
  return (
    e?.statusCode !== undefined &&
    e?.message !== undefined &&
    e?.name !== undefined
  );
}

export interface NextAppError {
  name:
    | "Unauthorized"
    | "Forbidden"
    | "UserExists"
    | "WrongCredentials"
    | "Unknown"
    | "BadRequest"
    | "RefreshFailure"
    | "NotFound"
    | "InvalidURL"
    | "AlreadyExists";
  statusCode: number;
  message: string;
  payload?: any;
}

export function extractNextError(e: any): NextAppError {
  if (e instanceof FetchError) {
    const data = e.data;
    if (isNextError(data)) {
      return data;
    }
  }
  return {
    statusCode: 500,
    message: "Unknown error",
    name: "Unknown",
  };
}

export function translateNextErrorMessage(e: NextAppError) {
  switch (e.name) {
    case "Unauthorized":
      return "로그인이 필요합니다.";
    case "Forbidden":
      return "권한이 없습니다.";
    case "UserExists":
      return "이미 존재하는 유저입니다.";
    case "WrongCredentials":
      return "잘못된 계정 정보입니다.";
    case "BadRequest":
      return "잘못된 요청입니다.";
    case "RefreshFailure":
      return "토큰 갱신에 실패했습니다.";
    case "NotFound":
      return "찾을 수 없습니다.";
    case "InvalidURL":
      return "잘못된 URL입니다.";
    case "AlreadyExists":
      return "이미 존재합니다.";
    default:
      return "알 수 없는 오류입니다.";
  }
}
