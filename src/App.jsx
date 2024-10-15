import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@tauri-apps/plugin-shell";
import { resolveResource } from '@tauri-apps/api/path';

import "./App.css";

const listPythonButton = () => {
  return (
    <button
      onClick={async () => {
        console.log("listing python");
      }}
    >
      list python
    </button>
  )
}
const InstallButton = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [commandMsg, setCommandMsg] = useState("");
  return (
    <div>
      <button
        onClick={async () => {
          console.log("installing exo");
          setIsInstalling(true);
          const exoPath = await resolveResource("exo");
          const command = Command.sidecar("binaries/uv", ["tool", "install", exoPath]);
          const output = await command.execute();
          console.log(output.stderr);
          setIsInstalling(false);
          setIsInstalled(true);
          setCommandMsg(output.stderr);
        }}
      >
        {isInstalled ? "Installed exo" : isInstalling ? "Installing..." : "Install exo"}
      </button>
      <p>
        {commandMsg}
      </p>
    </div>
  )
}

const RunButton = (props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [commandMsg, setCommandMsg] = useState("");
  const [child, setChild] = useState(null);
  return (
    <div>
      <button
        onClick={async () => {
          console.log("running exo");
          if (isRunning) {
            child.kill();
            setIsRunning(false);
            return;
          }
          setIsRunning(true);
          const command = Command.create("exo");
          // const command = Command.sidecar("binaries/uv", ["tool", "run", "exo"]);
          command.stdout.on("data", (data) => {
            console.log(data);
            let msg = commandMsg + data;
            setCommandMsg(msg);
          });
          command.stderr.on("data", (data) => {
            console.log(data);
            let msg = commandMsg + data;
            setCommandMsg(msg);
          });
          const ch = await command.spawn();
          setChild(ch);
        }}
      >
        {isRunning ? "Running... Click to stop" : "Run exo"}
      </button>
      <p>
        {commandMsg}
      </p>
    </div>
  )
}

const Button = (props) => {

  return (
    <button
      onClick={async () => {
        console.log("installing exo");

        let command;
        if (props.command === "install exo") {
          setIsInstalling(true);
          command = Command.sidecar("binaries/uv", ["tool", "install", "./exo"]);
          setIsInstalling(false);
          setIsInstalled(true);
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

      {/* <Button command="install exo" /> */}
      <InstallButton />
      <RunButton />
      {/* <Button command="run exo" /> */}
    </div>
  );
}

export default App;
