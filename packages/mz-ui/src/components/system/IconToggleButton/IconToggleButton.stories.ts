import type { Meta, StoryObj } from "@storybook/react";
import { IconToggleButton } from ".";

const meta = {
  title: "Components/System/IconToggleButton",
  component: IconToggleButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    activeIcon: {
      defaultValue: undefined,
    },
  },
} satisfies Meta<typeof IconToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ActiveIcon: Story = {
  args: {
    isActive: true,
    size: "medium",
    activeIcon: undefined,
    inactiveIcon: undefined,
  },
};
export const InActiveIcon: Story = {
  args: {
    isActive: false,
    size: "medium",
    activeIcon: undefined,
    inactiveIcon: undefined,
  },
};
