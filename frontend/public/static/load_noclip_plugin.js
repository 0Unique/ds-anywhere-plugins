(async () => {
  while (!window.hasOwnProperty("Noclip"))
    //wait for wasm to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

  var plug = await Noclip({ wasmMemory: wasmMemory });
  plug.init_emu(window.WebMelon._internal.emulator.getEmuPtr());

  window.plugins.push(plug);
})();
