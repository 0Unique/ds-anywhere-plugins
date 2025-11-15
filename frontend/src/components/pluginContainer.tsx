import "./pluginContainer.css";

import Panzoom from "@panzoom/panzoom";

//import Noclip from "../plugins/noclip/main";
import { useEffect } from "preact/hooks";

export default function PluginContainer(): any {
  useEffect(() => {
    //let pluginContainer = document.querySelector("#plugin-container");

    var elem: HTMLElement | SVGElement | null =
      document.querySelector(".testc");
    if (elem != null) {
      var pz = Panzoom(elem, {
        zoomDoubleClickSpeed: 1, // disables zoom on double click
        noBind: true,
      });

      var selectedWindow: HTMLElement | null = null;
      var prevX = 0;
      var prevY = 0;

      elem.addEventListener("pointerdown", (evt: Event) => {
        let event = evt as PointerEvent;
        if (event.ctrlKey) {
          selectedWindow = event.target as HTMLElement | null;
          console.log("selected elem: " + selectedWindow);
        } else {
          pz.handleDown(event);
        }
      });
      document.addEventListener("pointermove", (event) => {
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
        } else {
          pz.handleMove(event);
        }
      });
      document.addEventListener("pointerup", (event) => {
        selectedWindow = null;
        pz.handleUp(event);
      });
    }
  }, []);

  return (
    <>
      <div id="plugin-container"></div>

      <script src="static/plugins-loaded.js"></script>
    </>
  );
}
