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
        <h1>test plugin</h1>
        <h3>player pos</h3>
        <h3 id="pos"></h3>
        <KeyboardBinder bindings={bindingConfigs} onChange={setBindings} />
        <input type="number" value={speed} onInput={handleSpeedChange} />
      </div>
      <script src="static/test.js"></script>
      <script src="static/load_noclip_plugin.js"></script>
    </>
  );
}
