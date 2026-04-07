import typescriptLogo from "/typescript.svg";
import { Header, Counter, FeedbackForm } from "@repo/ui";
import { add } from "@repo/math/add";
import { useHome } from "@repo/hooks";
import { useStateProvider } from "../../../components/StateProvider";
import {
  useAgnosticCounter,
  useAgnosticContactForm,
  useAgnosticFeedbackForm,
  setStateManagerType,
  getCurrentManagerType,
} from "@repo/state";

const Home = () => {
  const { providerType, setProviderType } = useStateProvider();
  const { counter, contactForm, feedbackForm } = useHome(providerType === 'zustand');

  // Agnostic hooks - completely unaware of the state management implementation
  const agnosticCounter = useAgnosticCounter();
  const agnosticContact = useAgnosticContactForm();
  const agnosticFeedback = useAgnosticFeedbackForm();

  // Sync the agnostic state manager with the provider toggle
  const handleProviderChange = (type: 'redux' | 'zustand') => {
    setProviderType(type);
    setStateManagerType(type);
  };

  const handleAgnosticFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agnosticFeedback.submitForm();
  };

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

      {/* State Provider Toggle */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>State Management Provider</h3>
        <div>
          <label>
            <input
              type="radio"
              value="redux"
              checked={providerType === 'redux'}
              onChange={(e) => handleProviderChange(e.target.value as 'redux' | 'zustand')}
            />
            Redux Toolkit
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              value="zustand"
              checked={providerType === 'zustand'}
              onChange={(e) => handleProviderChange(e.target.value as 'redux' | 'zustand')}
            />
            Zustand
          </label>
        </div>
        <p style={{ fontSize: "0.9em", color: "#666", marginTop: "0.5rem" }}>
          Currently using: <strong>{providerType === 'redux' ? 'Redux Toolkit' : 'Zustand'}</strong>
          (Agnostic: <strong>{getCurrentManagerType() === 'redux' ? 'Redux' : 'Zustand'}</strong>)
        </p>
      </div>

      {/* Agnostic State Management Demo */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #4CAF50", borderRadius: "8px", backgroundColor: "#f8fff8" }}>
        <h3>🔄 Agnostic State Management</h3>
        <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "1rem" }}>
          These components use the agnostic hooks and are completely unaware of whether Redux or Zustand is being used.
          They automatically switch when you change the provider above.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <h4>Agnostic Counter: {agnosticCounter.value}</h4>
          <button onClick={agnosticCounter.increment}>+</button>
          <button onClick={agnosticCounter.decrement} style={{ marginLeft: "0.5rem" }}>-</button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h4>Agnostic Contact Form</h4>
          {agnosticContact.submitted ? (
            <div>
              <p style={{ color: "green" }}>✅ Thank you! (Agnostic)</p>
              <button onClick={agnosticContact.resetForm}>Reset</button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Name"
                value={agnosticContact.formData.name}
                onChange={(e) => agnosticContact.updateField('name', e.target.value)}
                disabled={agnosticContact.submitting}
              />
              <button
                onClick={agnosticContact.submitForm}
                disabled={agnosticContact.submitting}
                style={{ marginLeft: "0.5rem" }}
              >
                {agnosticContact.submitting ? 'Submitting...' : 'Submit (Agnostic)'}
              </button>
              {agnosticContact.error && <p style={{ color: "red" }}>{agnosticContact.error}</p>}
            </div>
          )}
        </div>

        <FeedbackForm
          formData={agnosticFeedback.formData}
          updateField={agnosticFeedback.updateField}
          resetForm={agnosticFeedback.resetForm}
          submitting={agnosticFeedback.submitting}
          submitted={agnosticFeedback.submitted}
          error={agnosticFeedback.error}
          onSubmit={handleAgnosticFeedbackSubmit}
        />
      </div>

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
