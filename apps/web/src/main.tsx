import { AuthSessionProvider } from "@repo/auth";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.scss";
import App from "./App";
import { StateProvider } from "./components/StateProvider";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <AuthSessionProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </AuthSessionProvider>
  </BrowserRouter>,
);
