import typescriptLogo from "/typescript.svg";
import { Header, Counter } from "@repo/ui";
import { add } from "@repo/math/add";
import { useCounter } from "@repo/hooks";

const Home = () => {
  const { value, increase } = useCounter();
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
        <Counter value={value} onIncrement={increase} />
        <div>{add(1, value)}</div>
      </div>
    </div>
  );
};

export default Home;
