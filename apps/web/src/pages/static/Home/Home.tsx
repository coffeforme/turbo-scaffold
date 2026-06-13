import {
  Button,
  FeedbackForm,
  Header,
  Input,
  Label,
  Textarea,
} from "@repo/ui";
import { useHomeViewModel } from "./useHomeViewModel";
import styles from "./Home.module.scss";

const Home = () => {
  const viteLogo = `${import.meta.env.BASE_URL}vite.svg`;
  const typescriptLogo = `${import.meta.env.BASE_URL}typescript.svg`;
  const {
    providerType,
    handleProviderChange,
    currentManagerType,
    agnosticCounter,
    agnosticContact,
    agnosticFeedback,
    handleAgnosticContactSubmit,
    handleAgnosticFeedbackSubmit,
  } = useHomeViewModel();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.logos}>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank">
            <img
              src={typescriptLogo}
              className="logo vanilla"
              alt="TypeScript logo"
            />
          </a>
        </div>
        <Header title="Web" />
      </div>

      <div className={`${styles.panel} ${styles.togglePanel}`}>
        <h3 className={styles.panelTitle}>State Management Provider</h3>
        <div className={styles.toggleGroup}>
          <Label className={styles.toggleOption}>
            <Input
              type="radio"
              value="redux"
              checked={providerType === "redux"}
              onChange={(e) => handleProviderChange(e.target.value as "redux" | "zustand")}
            />
            Redux Toolkit
          </Label>
          <Label className={styles.toggleOption}>
            <Input
              type="radio"
              value="zustand"
              checked={providerType === "zustand"}
              onChange={(e) => handleProviderChange(e.target.value as "redux" | "zustand")}
            />
            Zustand
          </Label>
        </div>
        <p className={styles.muted}>
          Currently using: <strong>{providerType === "redux" ? "Redux Toolkit" : "Zustand"}</strong>{" "}
          (Agnostic: <strong>{currentManagerType === "redux" ? "Redux" : "Zustand"}</strong>)
        </p>
      </div>

      <div className={styles.agnosticPanel}>
        <h3 className={styles.panelTitle}>Agnostic State Management</h3>
        <p className={styles.muted}>
          These components use the agnostic hooks and are completely unaware of whether Redux or Zustand is being used.
          They automatically switch when you change the provider above.
        </p>

        <div className={styles.contactWrap}>
          <h4>Agnostic Counter</h4>
          <div className={styles.counterRow}>
            <Button onClick={agnosticCounter.increment}>Increase</Button>
            <Button onClick={agnosticCounter.decrement}>Decrease</Button>
            <span className={styles.valueBadge}>{agnosticCounter.value}</span>
          </div>
        </div>

        <div className={styles.contactWrap}>
          <h4>Agnostic Contact Form</h4>
          {agnosticContact.submitted ? (
            <div>
              <p className={styles.success}>Thank you! (Agnostic)</p>
              <Button onClick={agnosticContact.resetForm}>Reset</Button>
            </div>
          ) : (
            <form className={styles.contactForm} onSubmit={handleAgnosticContactSubmit}>
              <div className={styles.field}>
                <Label htmlFor="agnostic-name">Name</Label>
                <Input
                  id="agnostic-name"
                  type="text"
                  placeholder="Name"
                  value={agnosticContact.formData.name}
                  onChange={(e) => agnosticContact.updateField("name", e.target.value)}
                  disabled={agnosticContact.submitting}
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="agnostic-email">Email</Label>
                <Input
                  id="agnostic-email"
                  type="email"
                  placeholder="Email"
                  value={agnosticContact.formData.email}
                  onChange={(e) => agnosticContact.updateField("email", e.target.value)}
                  disabled={agnosticContact.submitting}
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="agnostic-message">Message</Label>
                <Textarea
                  id="agnostic-message"
                  placeholder="How can we help?"
                  value={agnosticContact.formData.message}
                  onChange={(e) => agnosticContact.updateField("message", e.target.value)}
                  disabled={agnosticContact.submitting}
                  rows={4}
                />
              </div>
              <div className={styles.inlineActions}>
                <Button type="submit" disabled={agnosticContact.submitting}>
                  {agnosticContact.submitting ? "Submitting..." : "Submit (Agnostic)"}
                </Button>
                {agnosticContact.error && <p className={styles.error}>{agnosticContact.error}</p>}
              </div>
            </form>
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
    </div>
  );
};

export default Home;
