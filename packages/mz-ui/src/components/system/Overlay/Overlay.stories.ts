import type { Meta, StoryObj } from "@storybook/react";
import { Overlay } from ".";

const meta = {
  title: "Components/System/Overlay",
  component: Overlay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Overlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const isOverlay: Story = {
  args: {
    visible: true,
  },
};

export const isNotOverlay: Story = {
  args: {
    visible: false,
  },
};
