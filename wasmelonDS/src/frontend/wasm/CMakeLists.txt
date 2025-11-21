project(WasmEmulator)

set(WASM_EMULATOR_SOURCES
  WasmEmulator.cpp
  WasmEmulator.h
  WasmEmuThread.cpp
  WasmEmuThread.h
  WasmFirmwareSettings.cpp
  WasmFirmwareSettings.h
  WasmNdsCart.cpp
  WasmNdsCart.h
  WasmPlatform.cpp
  WasmPlatformUtil.cpp
  WasmPlatformUtil.h
)

add_executable(wasmemulator ${WASM_EMULATOR_SOURCES})
set_target_properties(wasmemulator PROPERTIES LINK_FLAGS "-lembind -lpthread -lidbfs.js -DDISABLE_OPENGL_INCLUDES -sINITIAL_MEMORY=1024MB -sIMPORTED_MEMORY=1 -sMODULARIZE=1 -sEXPORT_NAME=WasmEmu")
target_include_directories(wasmemulator PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
target_include_directories(wasmemulator PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/..")
target_include_directories(wasmemulator PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/../..")
target_include_directories(wasmemulator PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/../../net")
target_link_libraries(wasmemulator PRIVATE core)
