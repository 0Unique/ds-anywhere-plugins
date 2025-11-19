import "./main.css";
import { useState, useEffect } from "preact/hooks";
import {
  KeyboardBinder,
  useKeyBindings,
  KeyBindingConfig,
  KeyBinding,
} from "../common/KeyboardBinder";

declare global {
  var noclip: any;
  var Noclip: (a: any) => any;
  var wasmMemory: any;
  var WebMelon: any;
  var plugins: any;
}

export default function Noclip(): any {
  const [bindings, setBindings] = useState<KeyBinding[]>([]);
  const [speed, setSpeed] = useState(200);

  useKeyBindings(bindings);

  const bindingConfigs: KeyBindingConfig[] = [
    { id: "move-up", action: "Move Up", defaultKey: "I" },
    { id: "move-right", action: "Move Right", defaultKey: "L" },
    { id: "move-left", action: "Move Left", defaultKey: "J" },
    { id: "move-down", action: "Move Down", defaultKey: "K" },
  ];

  useEffect(() => {
    (async () => {
      while (!window.hasOwnProperty("Noclip"))
        //wait for wasm to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

      var plug = await window.Noclip({ wasmMemory: wasmMemory });
      plug.init_emu(window.WebMelon._internal.emulator.getEmuPtr());

      plug.perFrame = () => {
        const posElem = document.querySelector("#pos");
        if (posElem) posElem.textContent = `(${plug.get_x()}, ${plug.get_y()})`;
      };

      window.plugins.push(plug);
      window.noclip = plug;
    })();
  }, []);

  useEffect(() => {
    const handleKeyAction = (event: CustomEvent) => {
      const { bindingId } = event.detail;

      const x = window.noclip.get_x();
      const y = window.noclip.get_y();

      switch (bindingId) {
        case "move-up":
          window.noclip.set_y(y - speed);
          break;
        case "move-down":
          window.noclip.set_y(y + speed);
          break;
        case "move-left":
          window.noclip.set_x(x - speed);
          break;
        case "move-right":
          window.noclip.set_x(x + speed);
          break;
      }
    };

    window.addEventListener(
      "keyBindingTriggered",
      handleKeyAction as EventListener,
    );
    return () =>
      window.removeEventListener(
        "keyBindingTriggered",
        handleKeyAction as EventListener,
      );
  }, [speed]); // Add speed as dependency

  const handleSpeedChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSpeed(Number(target.value));
  };

  return (
    <>
      <div id="noclip">
        <h1>noclip plugin</h1>
        <h3 id="pos"></h3>
        <KeyboardBinder bindings={bindingConfigs} onChange={setBindings} />
        <span class="m-1">
          speed:&nbsp;
          <input type="number" value={speed} onInput={handleSpeedChange} />
        </span>
      </div>
      <script src="static/Noclip.js"></script>
    </>
  );
}
