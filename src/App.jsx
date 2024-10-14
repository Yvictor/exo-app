import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@tauri-apps/plugin-shell";
import "./App.css";

const Button = (props) => {
  return (
    <button
      onClick={async () => {
        console.log("installing exo");
        let command;
        if (props.command === "install exo") {
            command = Command.sidecar("binaries/uv", ["tool", "install", "./exo"]);
        } else {
            let cmd = props.command.split(" ");
            console.log(cmd);
            command = Command.sidecar("binaries/uv", ["tool", ...cmd]);
        }
        const output = await command.execute();
        // const response = output.stdout;
        // console.log(response);
        console.log(output.stderr);
      }}
    >
      tool {props.command}
    </button>
  );
};

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <Button command="install exo" />
      <Button command="run exo" />
    </div>
  );
}

export default App;
