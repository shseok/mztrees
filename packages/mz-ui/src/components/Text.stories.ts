import type { Meta, StoryObj } from "@storybook/react";
import Text from "./Text";

const meta = {
  title: "Components/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

const STORY_TEXT = "I love Storybook!";

export const Default: Story = {
  args: {
    children: STORY_TEXT,
    color: "green",
    isItalic: "italic",
    isUnderline: "underline",
  },
};

export const Red: Story = {
  args: {
    children: STORY_TEXT,
    color: "red",
    isItalic: "normal",
    isUnderline: "none",
  },
};

export const Italic: Story = {
  args: {
    children: STORY_TEXT,
    color: "blue",
    isItalic: "italic",
    isUnderline: "none",
  },
};

export const Underline: Story = {
  args: {
    children: STORY_TEXT,
    color: "black",
    isItalic: "normal",
    isUnderline: "underline",
  },
};
