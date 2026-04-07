import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FeedbackForm } from "./feedbackForm";

type FeedbackFormData = {
  rating: number;
  comment: string;
  category: string;
};

const initialData: FeedbackFormData = {
  rating: 0,
  comment: "",
  category: "general",
};

const meta = {
  title: "Organisms/FeedbackForm",
  component: FeedbackForm,
  tags: ["autodocs"],
} satisfies Meta<typeof FeedbackForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [formData, setFormData] = useState(initialData);
    const [submitted, setSubmitted] = useState(false);

    return (
      <FeedbackForm
        formData={formData}
        updateField={(field, value) =>
          setFormData((current) => ({ ...current, [field]: value }))
        }
        resetForm={() => {
          setFormData(initialData);
          setSubmitted(false);
        }}
        submitting={false}
        submitted={submitted}
        error={null}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      />
    );
  },
};

export const WithError: Story = {
  render: () => (
    <FeedbackForm
      formData={{ rating: 2, comment: "The layout felt confusing.", category: "ui" }}
      updateField={() => undefined}
      resetForm={() => undefined}
      submitting={false}
      submitted={false}
      error="Unable to submit right now."
      onSubmit={(event) => event.preventDefault()}
    />
  ),
};
