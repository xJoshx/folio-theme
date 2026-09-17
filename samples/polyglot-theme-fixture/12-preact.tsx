import { render } from "preact";
import { useMemo } from "preact/hooks";

const App = () => <h1>{useMemo(() => "Preact", [])}</h1>;
render(<App />, document.querySelector("#app")!);
