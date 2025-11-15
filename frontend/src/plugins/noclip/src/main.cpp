#include <emscripten/bind.h>

using namespace emscripten;

#include "WasmEmulator.h"
#include "NDS.h"

wasmelon::WasmEmulator *emu = nullptr;

void init_emu(long long emu_addr) {
    emu = reinterpret_cast<wasmelon::WasmEmulator *>(emu_addr);
}

unsigned int get_x() {
    return *(unsigned int*)&emu->nds->MainRAM[0x143b20];
}

unsigned int get_y() {
    return *(unsigned int*)&emu->nds->MainRAM[0x143b24];
}

void set_x(unsigned int  val) {
    *(unsigned int*)&emu->nds->MainRAM[0x143b20] = val;
}

void set_y(unsigned int val) {
    *(unsigned int*)&emu->nds->MainRAM[0x143b24] = val;
}



EMSCRIPTEN_BINDINGS(my_module) {
    function("init_emu", &init_emu);
    function("get_x", &get_x);
    function("get_y", &get_y);
    function("set_x", &set_x);
    function("set_y", &set_y);
}
