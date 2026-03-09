import { createRoot } from "react-dom/client";
import "./style.css";
import typescriptLogo from "/typescript.svg";
import { Header, Counter } from "@repo/ui";
import { add } from "@repo/math/add";

const App = () => (
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
      <Counter />
      <div>{add(1, 2)}</div>
    </div>
  </div>
);

createRoot(document.getElementById("app")!).render(<App />);
