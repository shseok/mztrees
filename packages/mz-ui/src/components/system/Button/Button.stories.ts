import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const STORY_TEXT = "테스트";

const meta = {
  title: "Components/System/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    layoutmode: { defaultValue: "inline", control: "select" },
    variant: { defaultValue: "primary" },
    size: { defaultValue: "medium" },
    children: { defaultValue: STORY_TEXT, control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    layoutmode: "fullWidth",
    variant: "primary",
    size: "medium",
    children: STORY_TEXT,
  },
};
export const Secondary: Story = {
  args: {
    layoutmode: "fullWidth",
    variant: "secondary",
    size: "medium",
    children: STORY_TEXT,
  },
};
export const Tertiary: Story = {
  args: {
    layoutmode: "fullWidth",
    variant: "tertiary",
    size: "medium",
    children: STORY_TEXT,
  },
};
export const Visit: Story = {
  args: {
    layoutmode: "fullWidth",
    variant: "visit",
    size: "medium",
    children: STORY_TEXT,
  },
};
export const Warning: Story = {
  args: {
    layoutmode: "fullWidth",
    variant: "warning",
    size: "medium",
    children: STORY_TEXT,
  },
};
