import { useState, useEffect } from "preact/hooks";
import { keybindManager } from "./keybindManager";

export default function KeybindButton({ action, initialKey = "" }) {
  const [keybind, setKeybind] = useState(initialKey);
  const [isListening, setIsListening] = useState(false);

  // Initialize from keybind manager
  useEffect(() => {
    const savedKeybind = keybindManager.getKeybind(action);
    if (savedKeybind) {
      setKeybind(savedKeybind);
    } else if (initialKey) {
      keybindManager.setKeybind(action, initialKey);
    }
  }, [action, initialKey]);

  // Listen for keybind changes from other components
  useEffect(() => {
    return keybindManager.onKeybindChange(action, (newKeybind) => {
      setKeybind(newKeybind);
    });
  }, [action]);

  useEffect(() => {
    if (!isListening) return;

    const handleKeyPress = (event) => {
      event.preventDefault();

      // Ignore modifier keys alone
      if (["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
        return;
      }

      const modifiers = [];
      if (event.ctrlKey) modifiers.push("Ctrl");
      if (event.shiftKey) modifiers.push("Shift");
      if (event.altKey) modifiers.push("Alt");
      if (event.metaKey) modifiers.push("Meta");

      const newKeybind =
        modifiers.length > 0
          ? `${modifiers.join("+")}+${event.key}`
          : event.key;

      setKeybind(newKeybind);
      setIsListening(false);
      keybindManager.setKeybind(action, newKeybind);
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isListening, action]);

  const handleClick = () => {
    setIsListening(true);
  };

  return (
    <div class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
      <span class="text-sm font-medium text-gray-700 min-w-[120px]">
        {action}:
      </span>
      <button
        onClick={handleClick}
        class={`
          px-3 py-1 text-sm border rounded-md min-w-[120px] text-left transition-colors
          ${
            isListening
              ? "bg-blue-500 text-white border-blue-500 ring-2 ring-blue-200"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }
        `}
        type="button"
      >
        {isListening ? "Press any key..." : keybind || "Click to set"}
      </button>
      {keybind && !isListening && (
        <button
          onClick={() => {
            setKeybind("");
            keybindManager.setKeybind(action, "");
          }}
          class="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
          type="button"
        >
          Clear
        </button>
      )}
    </div>
  );
}
