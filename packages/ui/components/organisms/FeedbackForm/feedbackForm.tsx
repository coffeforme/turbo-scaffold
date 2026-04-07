import { Button } from "../../atoms/Button/button";
import { Label } from "../../atoms/Label/label";
import { Rating } from "../../atoms/Rating/rating";
import { Select } from "../../atoms/Select/select";
import { Textarea } from "../../atoms/Textarea/textarea";
import styles from "./feedbackForm.module.scss";

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
      <div className={styles.wrap}>
        <h2 className={styles.title}>Rate Your Experience</h2>
        <div className={styles.confirmation}>
          <p>Thank you for your feedback!</p>
          <Button onClick={resetForm}>Submit Another Rating</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Rate Your Experience</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <Label className={styles.label}>
            How would you rate your experience?
          </Label>
          <Rating
            value={formData.rating}
            onChange={(rating) => updateField("rating", rating)}
            disabled={submitting}
          />
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor="category">
            Category:
          </Label>
          <Select
            className={styles.select}
            id="category"
            value={formData.category}
            onChange={(e) => updateField("category", e.target.value)}
            disabled={submitting}
          >
            <option value="general">General</option>
            <option value="ui">User Interface</option>
            <option value="performance">Performance</option>
            <option value="features">Features</option>
            <option value="support">Support</option>
          </Select>
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor="comment">
            Comments (optional):
          </Label>
          <Textarea
            className={styles.textarea}
            id="comment"
            value={formData.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            disabled={submitting}
            rows={3}
            placeholder="Tell us more about your experience..."
          />
        </div>
        <div className={styles.actions}>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={submitting || formData.rating === 0}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
          {error && <p className={styles.error}>Error: {error}</p>}
        </div>
      </form>
    </div>
  );
};
