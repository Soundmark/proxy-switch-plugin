import "./App.css";
import Select from "../../../src/ProxySelect";
import { useEffect } from "react";
import "../../../src/ProxySelect.css";

function App() {
  useEffect(() => {
    const head = document.querySelector(".App-header");
    head.appendChild(Select);
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
