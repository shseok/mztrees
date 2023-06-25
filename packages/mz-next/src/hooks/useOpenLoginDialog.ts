"use client";

import { useCallback } from "react";
import { useDialog } from "@/context/DialogContext";
import { useLogout } from "./useLogout";
import { usePathname, useRouter } from "next/navigation";

const messageMap = {
  itemLike:
    "이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.",
  comment: "당신의 의견을 적고 싶으신가요? 로그인을 해주세요.",
  commentLike: "이 댓글이 마음에 드세요? 로그인을 해주세요",
  itemBookmark:
    "나중에 이 글을 또 보고 싶으신가요? 로그인하고 북마크를 추가해보세요.",
  logout: "접속중인 기기에서 로그아웃 하시겠습니까?",
  deleteAccount: "계정에 관련된 정보를 모두 삭제합니다. 계속할까요?",
};

export const useOpenLoginDialog = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useDialog();

  const openLoginDialog = useCallback(
    (type: keyof typeof messageMap) => {
      const description = messageMap[type];
      open({
        title: "로그인 후 이용해 주세요.",
        description,
        confirmText: "로그인",
        onConfirm: () => {
          /**@todos refactor like useProtectedRoute or use useProtectedRoute */
          router.push(`/login?next=${pathname}`);
        },
        mode: "confirm",
      });
    },
    [router, open]
  );

  return openLoginDialog;
};

export const useOpenLogoutDialog = () => {
  const { open } = useDialog();
  const logout = useLogout();

  const openLoginDialog = useCallback(
    (type: keyof typeof messageMap) => {
      const description = messageMap[type];
      open({
        title: "로그아웃을 진행합니다.",
        description,
        confirmText: "로그아웃",
        onConfirm: () => {
          logout();
        },
        mode: "confirm",
        cancelText: "취소",
      });
    },
    [open]
  );

  return openLoginDialog;
};
