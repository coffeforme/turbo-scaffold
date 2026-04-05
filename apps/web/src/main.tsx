import { createRoot } from "react-dom/client";
import "./styles/style.css";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "@repo/state";

createRoot(document.getElementById("app")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
