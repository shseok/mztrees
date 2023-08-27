// 1. 먼저 TypeScript 스토리의 유형 안전성과 자동 완성을 위해 Meta 및 StoryObj를 가져옵니다. 다음으로 구성 요소를 가져옵니다. 이 경우에는 Button 구성 요소입니다.
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// 2. 기본 내보내기인 Meta에는 이 구성 요소의 스토리에 대한 메타데이터가 포함되어 있습니다. 제목 필드(선택 사항)는 사이드바에 스토리가 표시되는 위치를 제어합니다.
const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} satisfies Meta<typeof Button>;

export default meta;

// 3. 각각의 명명된 수출(named export)은 이야기입니다. 해당 내용은 다른 구성 옵션 외에도 스토리가 렌더링되는 방법을 지정합니다.
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  // 4. Args는 컴포넌트에 전달되는 입력으로, Storybook은 컴포넌트를 다양한 상태로 렌더링하는 데 사용합니다. React에서는 args = props입니다. 또한 스토리의 초기 제어 값을 지정합니다.
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    label: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Button",
  },
};
// 5.test
export const Warning: Story = {
  args: {
    primary: true,
    label: "Delete now",
    backgroundColor: "red",
  },
};
