import { createRoot } from "react-dom/client";
import "./styles/globals.scss";
import App from "./App";
import { StateProvider } from "./components/StateProvider";

createRoot(document.getElementById("app")!).render(
  <StateProvider>
    <App />
  </StateProvider>,
);
