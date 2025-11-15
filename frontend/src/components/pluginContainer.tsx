import "./pluginContainer.css";

import panzoom from "panzoom";

import Noclip from "../plugins/noclip/main";
import { useEffect } from "preact/hooks";

export default function PluginContainer(): any {
  useEffect(() => {
    let pluginContainer = document.querySelector("#plugin-container");

    var elem: HTMLElement | SVGElement | null =
      document.querySelector(".full-container");
    if (elem != null && pluginContainer != null) {
      panzoom(elem, {
        zoomDoubleClickSpeed: 1, // disables zoom on double click
        beforeMouseDown: function (e: Event) {
          var shouldIgnore = (e as PointerEvent).ctrlKey;
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
        }
      });
      pluginContainer.addEventListener("pointermove", (evt) => {
        let event = evt as PointerEvent;
        if (event.ctrlKey && selectedWindow != null) {
          const mouseX = event.clientX;
          const mouseY = event.clientY;
          if (prevX != 0 && prevY != 0) {
            const currentLeft = parseInt(selectedWindow.style.left) || 0;
            var scaleX =
              selectedWindow.getBoundingClientRect().width /
              selectedWindow.offsetWidth;
            const newLeft = currentLeft + (mouseX - prevX) * scaleX;
            selectedWindow.style.left = `${newLeft * scaleX}px`;
            const currentTop = parseInt(selectedWindow.style.top) || 0;
            var scaleY =
              selectedWindow.getBoundingClientRect().height /
              selectedWindow.offsetHeight;
            const newTop = currentTop + (mouseY - prevY) * scaleY;
            selectedWindow.style.top = `${newTop}px`;
          }
          prevX = mouseX;
          prevY = mouseY;
        }
      });
      document.addEventListener("pointerup", (_) => {
        selectedWindow = null;
        prevX = 0;
        prevY = 0;
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
