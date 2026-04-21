import { Card, Header, Text } from "@repo/ui";
import styles from "./About.module.scss";

const About = () => {
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Header title="About This Template" />
        <Text tone="muted">
          This workspace is designed as a decoupled professional web app scaffold, and this page highlights both the
          structure behind it and a real success-case reference.
        </Text>
      </div>

      <div className={styles.grid}>
        <Card
          description="A concise explanation of what this workspace optimizes for."
          eyebrow="Scaffold"
          title="What This Repo Demonstrates"
        >
          <div className={styles.copy}>
            <Text>Multi-package architecture with focused responsibilities.</Text>
            <Text>Shared UI, hooks, auth, state, persistence, and API abstractions.</Text>
            <Text>Component demonstrations in both the app and Storybook.</Text>
            <Text>Authentication and access control patterns that can be reused across real projects.</Text>
          </div>
        </Card>

        <Card
          description="A simple external reference section for the people and work around this repo."
          eyebrow="Profile"
          title="Links"
        >
          <div className={styles.links}>
            <a className={styles.linkCard} href="https://github.com/coffeforme" rel="noreferrer" target="_blank">
              <strong>GitHub</strong>
              <span>github.com/coffeforme</span>
            </a>
            <a
              className={styles.linkCard}
              href="https://koopstrategicadvisory.com"
              rel="noreferrer"
              target="_blank"
            >
              <strong>Success Case</strong>
              <span>koopstrategicadvisory.com</span>
            </a>
          </div>
        </Card>
      </div>

      <Card
        description="This iframe is included as a live reference for a delivered site and how the scaffold can support real outcomes."
        eyebrow="Success Case"
        title="Koop Strategic Advisory"
      >
        <div className={styles.iframeWrap}>
          <iframe
            className={styles.iframe}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://koopstrategicadvisory.com"
            title="Koop Strategic Advisory"
          />
        </div>
        <Text tone="muted">
          If the site blocks embedding in some environments, you can still open it directly through the external link
          above.
        </Text>
      </Card>
    </div>
  );
};

export default About;
