import "./pluginContainer.css";

import Panzoom from "@panzoom/panzoom";

import Noclip from "../plugins/noclip/main";
import { useEffect } from "preact/hooks";

export default function PluginContainer(): any {
  useEffect(() => {
    let pluginContainer = document.querySelector("#plugin-container");

    var elem: HTMLElement | SVGElement | null =
      document.querySelector(".full-container");
    if (elem != null && pluginContainer != null) {
      Panzoom(elem, {
        zoomDoubleClickSpeed: 1, // disables zoom on double click
        beforeMouseDown: function (e: Event) {
          // allow mouse-down panning only if altKey is down. Otherwise - ignore
          var shouldIgnore = !(e as PointerEvent).ctrlKey;
          return shouldIgnore;
        },
      });

      var selectedWindow: HTMLElement | null = null;
      var prevX = 0;
      var prevY = 0;

      pluginContainer.addEventListener("pointerdown", (evt: Event) => {
        let event = evt as PointerEvent;
        if (event.ctrlKey) {
          selectedWindow = event.target as HTMLElement | null;
          console.log("selected elem: " + selectedWindow);
        }
      });
      pluginContainer.addEventListener("pointermove", (evt) => {
        let event = evt as PointerEvent;
        if (event.ctrlKey && selectedWindow != null) {
          const mouseX = event.clientX;
          const mouseY = event.clientY;
          if (prevX != 0 && prevY != 0) {
            console.log("change X: " + (mouseX - prevX));
            console.log("change Y: " + (mouseY - prevY));
            const currentLeft = parseInt(selectedWindow.style.left) || 0;
            const newLeft = currentLeft + mouseX - prevX;
            selectedWindow.style.left = `${newLeft}px`;
            const currentTop = parseInt(selectedWindow.style.top) || 0;
            const newTop = currentTop + mouseY - prevY;
            selectedWindow.style.top = `${newTop}px`;
          }
          prevX = mouseX;
          prevY = mouseY;
        }
      });
      pluginContainer.addEventListener("pointerup", (_) => {
        selectedWindow = null;
      });
    }
  }, []);

  return (
    <>
      <div id="plugin-container">
        <Noclip />
      </div>

      <script src="static/plugins-loaded.js"></script>
    </>
  );
}
