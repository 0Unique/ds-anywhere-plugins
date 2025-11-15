import "./pluginContainer.css";

import Noclip from "../plugins/noclip/src/main";

export default function pluginContainer(): any {
  return (
    <>
      <div id="plugin-container">
        <Noclip />
      </div>

      <script src="static/plugins-loaded.js"></script>
    </>
  );
}
