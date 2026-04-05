import { Rating } from "../../atoms/Rating/rating";

interface FeedbackFormData {
  rating: number;
  comment: string;
  category: string;
}

interface FeedbackFormProps {
  formData: FeedbackFormData;
  updateField: (field: keyof FeedbackFormData, value: string | number) => void;
  resetForm: () => void;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  formData,
  updateField,
  resetForm,
  submitting,
  submitted,
  error,
  onSubmit,
}) => {
  if (submitted) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <h2>Rate Your Experience</h2>
        <div>
          <p>Thank you for your feedback!</p>
          <button onClick={resetForm}>Submit Another Rating</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Rate Your Experience</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            How would you rate your experience?
          </label>
          <Rating
            value={formData.rating}
            onChange={(rating) => updateField("rating", rating)}
            disabled={submitting}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => updateField("category", e.target.value)}
            disabled={submitting}
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="general">General</option>
            <option value="ui">User Interface</option>
            <option value="performance">Performance</option>
            <option value="features">Features</option>
            <option value="support">Support</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="comment">Comments (optional):</label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            disabled={submitting}
            rows={3}
            placeholder="Tell us more about your experience..."
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || formData.rating === 0}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </form>
    </div>
  );
};