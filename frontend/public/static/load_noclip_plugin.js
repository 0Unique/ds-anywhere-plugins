(async () => {
  while (!window.hasOwnProperty("Noclip"))
    //wait for wasm to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

  var plug = await Noclip({ wasmMemory: wasmMemory });
  plug.init_emu(window.WebMelon._internal.emulator.getEmuPtr());

  plug.perFrame = () => {
    const posElem = document.querySelector("#pos");
    posElem.textContent = `(${plug.get_x()}, ${plug.get_y()})`;
  };

  window.plugins.push(plug);
})();
