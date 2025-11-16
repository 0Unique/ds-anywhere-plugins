import "./keyBinder.css";
import { useState, useCallback, useEffect } from "preact/hooks";

// Types
export interface KeyBinding {
  id: string;
  action: string;
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export interface KeyBindingConfig {
  id: string;
  action: string;
  defaultKey?: string;
  defaultModifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
}

interface KeyBindingProps {
  bindings: KeyBindingConfig[];
  onChange: (bindings: KeyBinding[]) => void;
  disabled?: boolean;
}

interface KeyRecorderProps {
  onKeyRecord: (binding: Omit<KeyBinding, "id" | "action">) => void;
  disabled?: boolean;
}

// Utility function to format key display
const formatKeyDisplay = (
  binding: Omit<KeyBinding, "id" | "action">,
): string => {
  const parts = [];
  if (binding.ctrlKey) parts.push("Ctrl");
  if (binding.shiftKey) parts.push("Shift");
  if (binding.altKey) parts.push("Alt");
  if (binding.metaKey) parts.push("Meta");
  parts.push(binding.key.toUpperCase());
  return parts.join(" + ");
};

// Key code to key name mapping
const getKeyName = (code: string): string => {
  const keyMap: { [key: string]: string } = {
    Space: "Space",
    Escape: "Esc",
    Enter: "Enter",
    Tab: "Tab",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Backspace: "Backspace",
    Delete: "Delete",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
  };

  return (
    keyMap[code] || code.replace(/Key|Digit|Numpad|Arrow/, "").toUpperCase()
  );
};

// Key Recorder Component
const KeyRecorder = ({ onKeyRecord, disabled }: KeyRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [_, setCurrentKeys] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isRecording) return;

      event.preventDefault();
      event.stopPropagation();

      const { key, code, ctrlKey, shiftKey, altKey, metaKey } = event;

      // Ignore modifier-only key presses
      if (["Control", "Shift", "Alt", "Meta"].includes(key)) {
        return;
      }

      const keyName = getKeyName(code);

      onKeyRecord({
        key: keyName,
        code,
        ctrlKey,
        shiftKey,
        altKey,
        metaKey,
      });

      setIsRecording(false);
      setCurrentKeys([]);
    },
    [isRecording, onKeyRecord],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!isRecording) return;

      if (["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
        setCurrentKeys((prev) => prev.filter((k) => k !== event.key));
      }
    },
    [isRecording],
  );

  useEffect(() => {
    if (isRecording) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [isRecording, handleKeyDown, handleKeyUp]);

  const startRecording = () => {
    if (disabled) return;
    setIsRecording(true);
    setCurrentKeys([]);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setCurrentKeys([]);
  };

  return (
    <div className="key-recorder">
      {!isRecording ? (
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="record-button"
        >
          Record Key
        </button>
      ) : (
        <div className="recording-container">
          <div className="recording-indicator">
            Press any key combination...
          </div>
          <button
            type="button"
            onClick={cancelRecording}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Main Keyboard Binding Component
export const KeyboardBinder = ({
  bindings,
  onChange,
  disabled = false,
}: KeyBindingProps) => {
  const [keyBindings, setKeyBindings] = useState<KeyBinding[]>(() =>
    bindings.map((config) => ({
      id: config.id,
      action: config.action,
      key: config.defaultKey || "",
      code: "",
      ctrlKey: config.defaultModifiers?.ctrl || false,
      shiftKey: config.defaultModifiers?.shift || false,
      altKey: config.defaultModifiers?.alt || false,
      metaKey: config.defaultModifiers?.meta || false,
    })),
  );

  const updateBinding = useCallback(
    (id: string, newBinding: Omit<KeyBinding, "id" | "action">) => {
      setKeyBindings((prev) => {
        const updated = prev.map((binding) =>
          binding.id === id ? { ...binding, ...newBinding } : binding,
        );
        onChange(updated);
        return updated;
      });
    },
    [onChange],
  );

  const clearBinding = useCallback(
    (id: string) => {
      setKeyBindings((prev) => {
        const updated = prev.map((binding) =>
          binding.id === id
            ? {
                ...binding,
                key: "",
                code: "",
                ctrlKey: false,
                shiftKey: false,
                altKey: false,
                metaKey: false,
              }
            : binding,
        );
        onChange(updated);
        return updated;
      });
    },
    [onChange],
  );

  return (
    <div className="keyboard-binder">
      <h3>Keyboard Bindings</h3>
      <div className="bindings-list">
        {keyBindings.map((binding) => (
          <div key={binding.id} className="binding-item">
            <div className="binding-action">{binding.action}</div>
            <div className="binding-key">
              {binding.key ? formatKeyDisplay(binding) : "Not set"}
            </div>
            <div className="binding-controls">
              <KeyRecorder
                onKeyRecord={(newBinding) =>
                  updateBinding(binding.id, newBinding)
                }
                disabled={disabled}
              />
              {binding.key && (
                <button
                  type="button"
                  onClick={() => clearBinding(binding.id)}
                  disabled={disabled}
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for using key bindings in your components
export const useKeyBindings = (bindings: KeyBinding[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedBinding = bindings.find(
        (binding) =>
          binding.key &&
          binding.key === getKeyName(event.code) &&
          binding.ctrlKey === event.ctrlKey &&
          binding.shiftKey === event.shiftKey &&
          binding.altKey === event.altKey &&
          binding.metaKey === event.metaKey,
      );

      if (pressedBinding) {
        event.preventDefault();
        event.stopPropagation();

        // You can dispatch a custom event or call a callback
        const customEvent = new CustomEvent("keyBindingTriggered", {
          detail: {
            bindingId: pressedBinding.id,
            action: pressedBinding.action,
          },
        });
        window.dispatchEvent(customEvent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [bindings]);
};

// Example usage component
export const ExampleApp = () => {
  const [keyBindings, setKeyBindings] = useState<KeyBinding[]>([]);

  const bindingConfigs: KeyBindingConfig[] = [
    {
      id: "save",
      action: "Save Document",
      defaultKey: "S",
      defaultModifiers: { ctrl: true },
    },
    {
      id: "undo",
      action: "Undo",
      defaultKey: "Z",
      defaultModifiers: { ctrl: true },
    },
    {
      id: "delete",
      action: "Delete Item",
      defaultKey: "Delete",
    },
    {
      id: "escape",
      action: "Cancel Operation",
      defaultKey: "Esc",
    },
  ];

  // Use the key bindings in this component
  useKeyBindings(keyBindings);

  // Listen for key binding events
  useEffect(() => {
    const handleKeyBinding = (event: CustomEvent) => {
      console.log(`Key binding triggered: ${event.detail.action}`);
      // Handle the action based on event.detail.bindingId
      switch (event.detail.bindingId) {
        case "save":
          alert("Save action triggered!");
          break;
        case "undo":
          alert("Undo action triggered!");
          break;
        case "delete":
          alert("Delete action triggered!");
          break;
        case "escape":
          alert("Escape action triggered!");
          break;
      }
    };

    window.addEventListener(
      "keyBindingTriggered",
      handleKeyBinding as EventListener,
    );

    return () => {
      window.removeEventListener(
        "keyBindingTriggered",
        handleKeyBinding as EventListener,
      );
    };
  }, []);

  return (
    <div>
      <KeyboardBinder bindings={bindingConfigs} onChange={setKeyBindings} />

      <div
        style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5" }}
      >
        <h4>Current Bindings:</h4>
        <pre>{JSON.stringify(keyBindings, null, 2)}</pre>
      </div>
    </div>
  );
};

export default KeyboardBinder;
