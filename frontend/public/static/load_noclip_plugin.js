let plug = await Noclip({ wasmMemory: wasmMemory });
plug.init_emu(window.WebMelon._internal.emulator.getEmuPtr());
