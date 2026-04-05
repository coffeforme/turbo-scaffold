import typescriptLogo from "/typescript.svg";
import { Header, Counter, FeedbackForm } from "@repo/ui";
import { add } from "@repo/math/add";
import { useHome } from "@repo/hooks";

const Home = () => {
  const { counter, contactForm, feedbackForm } = useHome();

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img
          src={typescriptLogo}
          className="logo vanilla"
          alt="TypeScript logo"
        />
      </a>
      <Header title="Web" />
      <div className="card">
        <Counter value={counter.value} onIncrement={counter.increase} />
        <div>{add(1, counter.value)}</div>

        <div style={{ marginTop: "2rem" }}>
          <h2>Contact Us</h2>
          {contactForm.submitted ? (
            <div>
              <p>Thank you for your message!</p>
              <button onClick={contactForm.resetForm}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={contactForm.handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={contactForm.formData.name}
                  onChange={(e) => contactForm.updateField("name", e.target.value)}
                  required
                  disabled={contactForm.submitting}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={contactForm.formData.email}
                  onChange={(e) => contactForm.updateField("email", e.target.value)}
                  required
                  disabled={contactForm.submitting}
                />
              </div>
              <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={contactForm.formData.message}
                  onChange={(e) => contactForm.updateField("message", e.target.value)}
                  required
                  disabled={contactForm.submitting}
                  rows={4}
                />
              </div>
              <button type="submit" disabled={contactForm.submitting}>
                {contactForm.submitting ? "Sending..." : "Send Message"}
              </button>
              {contactForm.error && <p style={{ color: "red" }}>Error: {contactForm.error}</p>}
            </form>
          )}
        </div>

        <FeedbackForm
          formData={feedbackForm.formData}
          updateField={feedbackForm.updateField}
          resetForm={feedbackForm.resetForm}
          submitting={feedbackForm.submitting}
          submitted={feedbackForm.submitted}
          error={feedbackForm.error}
          onSubmit={feedbackForm.handleSubmit}
        />
      </div>
    </div>
  );
};

export default Home;
