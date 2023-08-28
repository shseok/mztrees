import type { Meta, StoryObj } from "@storybook/react";
import { LikeButton } from ".";

const meta = {
  title: "Components/System/LikeButton",
  component: LikeButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LikeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Like: Story = {
  args: {
    isLiked: true,
  },
};

export const UnLike: Story = {
  args: {
    isLiked: false,
  },
};
