import type { Meta, StoryObj } from "@storybook/react";
import { FlipContainer } from "./flipContainer";

const meta = {
  title: "Mechanisms/FlipContainer",
  component: FlipContainer,
  args: {
    title: "Implementation View",
    description: "Flip between a rendered preview and a code-oriented explanation.",
    frontLabel: "Preview",
    backLabel: "Code",
    front: (
      <div>
        <h3>Live preview</h3>
        <p>This side renders the UI that the user interacts with.</p>
      </div>
    ),
    back: (
      <pre>{`<FlipContainer
  title="Implementation View"
  front={<Preview />}
  back={<CodeBlock />}
/>`}</pre>
    ),
  },
} satisfies Meta<typeof FlipContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
