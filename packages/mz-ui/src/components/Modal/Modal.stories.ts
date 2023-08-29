import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from ".";

const meta = {
  title: "Components/System/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RegularModal: Story = {
  args: {
    visible: true,
    children: undefined,
  },
};
