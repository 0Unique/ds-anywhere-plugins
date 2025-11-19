import { useState, useEffect } from "preact/hooks";

declare global {
  var entity_viewer: any;
  var EntityViewer: (a: any) => any;
  var wasmMemory: any;
  var WebMelon: any;
  var plugins: any;
  var do_zoom: boolean;
}

let self: any;

function showEntityDetails(index: number, element: HTMLDivElement) {
  // Remove highlight from all entities
  document.querySelectorAll(".entity-item").forEach((el) => {
    el.classList.remove("bg-blue-200");
  });

  // Highlight selected entity
  element.classList.add("bg-blue-200");

  // Show entity details in the details panel
  let detailsPanel = document.querySelector("#ent-details");
  if (detailsPanel != null)
    detailsPanel.innerHTML = `
    <h3 class="font-bold">Entity Details</h3>
    <p>Index: ${index}</p>
    <p>Type: ${self.get_entity_type(index)}</p>
    <p>Position: (${self.get_entity_x(index)}, ${self.get_entity_y(index)})</p>
  `;
}

export default function Noclip(): any {
  let [room, setroom] = useState(0);

  useEffect(() => {
    (async () => {
      while (!window.hasOwnProperty("EntityViewer"))
        //wait for wasm to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

      var plug = await window.EntityViewer({ wasmMemory: wasmMemory });
      plug.init_emu(window.WebMelon._internal.emulator.getEmuPtr());

      plug.perFrame = () => {
        if (self == null) return;
        let cur_room = plug.get_room();
        if (room != cur_room) {
          // room changed
          let entList = document.querySelector("#entity-list-box");
          if (entList == null) return; // shouldnt ever be null
          entList.innerHTML = "";

          let ents = plug.valid_ents();
          for (let i = 0; i < 0x40; i++) {
            if ((ents & (1 << i)) !== 0) {
              let entityElement = document.createElement("div");
              entityElement.className =
                "entity-item cursor-pointer p-1 hover:bg-gray-200";
              entityElement.textContent = `Entity ${i}`;

              // Add click handler to show entity details
              entityElement.addEventListener("click", function () {
                showEntityDetails(i, this);
              });

              entList.appendChild(entityElement);
            }
          }

          setroom(cur_room);
        }
      };

      window.plugins.push(plug);
      self = plug;
    })();
  }, []);

  return (
    <>
      <div id="entity-viewer">
        <h1>entity viewer</h1>
        <div class="flex flex-row text-base">
          <div
            id="entity-list-box"
            class="flex flex-col overflow-y-scroll w-28 h-48 border-black border-2 m-2 p-1"
          ></div>
          <div id="ent-details" class="b-2 border-black m-2 p-1 w-auto">
            <p class="text-gray-500">Select an entity to view details</p>
          </div>
        </div>
      </div>
      <script src="static/EntityViewer.js"></script>
    </>
  );
}
