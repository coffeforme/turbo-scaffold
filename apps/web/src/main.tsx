import { createRoot } from "react-dom/client";
import "./styles/globals.scss";
import App from "./App";
import { SystemProviders } from "./components/SystemProviders";

createRoot(document.getElementById("app")!).render(
  <SystemProviders>
    <App />
  </SystemProviders>,
);
