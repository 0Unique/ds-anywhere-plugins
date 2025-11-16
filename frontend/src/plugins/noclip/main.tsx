import "./main.css";

import { useState } from "preact/hooks";
import {
  KeyboardBinder,
  useKeyBindings,
  KeyBindingConfig,
  KeyBinding,
} from "../common/KeyboardBinder";

declare global {
  var Noclip: any;
}

export default function Noclip(): any {
  const [bindings, setBindings] = useState<KeyBinding[]>([]);

  useKeyBindings(bindings);

  const bindingConfigs: KeyBindingConfig[] = [
    { id: "move-up", action: "Move Up", defaultKey: "I" },
    { id: "move-right", action: "Move Right", defaultKey: "L" },
    { id: "move-left", action: "Move Left", defaultKey: "J" },
    { id: "move-down", action: "Move DOwn", defaultKey: "K" },
  ];

  useState(() => {
    const handleKeyAction = (event: CustomEvent) => {
      const { bindingId } = event.detail;

      const x = window.Noclip.get_x();
      const y = window.Noclip.get_y();

      switch (bindingId) {
        case "move-up":
          window.Noclip.set_y(y - 100);
          break;
        case "move-down":
          window.Noclip.set_y(y + 100);
          break;
        case "move-left":
          window.Noclip.set_x(x - 100);
          break;
        case "move-right":
          window.Noclip.set_x(x + 100);
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
  });

  return (
    <>
      <div id="noclip">
        <h1>test plugin</h1>
        <h3>player pos</h3>
        <h3 id="pos"></h3>
        <KeyboardBinder
          bindings={[{ id: "right", action: "right" }]}
          onChange={setBindings}
        />
      </div>
      <script src="static/test.js"></script>
      <script src="static/load_noclip_plugin.js"></script>
    </>
  );
}
