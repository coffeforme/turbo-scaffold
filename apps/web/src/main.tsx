import { createRoot } from "react-dom/client";
import "./styles/style.css";
import App from "./App";
import { StateProvider } from "./components/StateProvider";

createRoot(document.getElementById("app")!).render(
  <StateProvider>
    <App />
  </StateProvider>,
);
