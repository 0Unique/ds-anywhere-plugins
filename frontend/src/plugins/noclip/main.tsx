import "./main.css";

import { useEffect } from "preact/hooks";
import KeybindButton from "../common/KeybindButton";
import { keybindManager } from "../common/keybindManager";

declare global {
  var Noclip: any;
}

export default function Noclip() {
  useEffect(() => {
    const handleKeyPress = (event: Event) => {
      if (keybindManager.checkEvent(event as KeyboardEvent, "up")) {
        event.preventDefault();
        window.Noclip.set_y(window.Noclip.get_y() - 100);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Or subscribe to keybind changes
  useEffect(() => {
    const unsubscribe = keybindManager.onKeybindChange("up", (newKeybind) => {
      console.log(`up keybind changed to: ${newKeybind}`);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <div id="noclip">
        <h1>test plugin</h1>
        <h3>player pos</h3>
        <h3 id="pos"></h3>
        <KeybindButton action="up" initialKey="Up" />
        <KeybindButton action="down" initialKey="Down" />
        <KeybindButton action="left" initialKey="Left" />
        <KeybindButton action="right" initialKey="Right" />
      </div>
      <script src="static/test.js"></script>
      <script src="static/load_noclip_plugin.js"></script>
    </>
  );
}
