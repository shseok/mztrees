import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from ".";

const meta = {
  title: "Components/System/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AlertDialog: Story = {
  args: {
    mode: "alert",
    cancelText: "취소", // 원래 안적어도 되게 해야하는데.. 나중에 alert일 경우 안적어도 되게 설정하기
    confirmText: "확인",
    description: "세션이 만료되었습니다. 로그인화면으로 이동합니다..",
    title: "로그인 후 이용해 주세요",
    visible: true,
  },
};

export const ConfirmDialog: Story = {
  args: {
    mode: "confirm",
    cancelText: "취소",
    confirmText: "로그인",
    description: "당신의 의견을 적고 싶으신가요? 로그인을 해주세요.",
    title: "로그인 후 이용해 주세요",
    visible: true,
  },
};
