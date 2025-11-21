#include <emscripten/bind.h>

using namespace emscripten;

#include "WasmEmulator.h"
#include "NDS.h"
#include "dqhrs.nds.h" // exported from my ghidra project

wasmelon::WasmEmulator *emu = nullptr;
Entity* entityArray = nullptr;

void init_emu(long long emu_addr) {
    emu = reinterpret_cast<wasmelon::WasmEmulator *>(emu_addr);
    entityArray = (Entity*)&emu->nds->MainRAM[0x143b20];
}

typedef struct {
    unsigned int X;
    unsigned int Y;
} Position;

Position game_to_screen_pos(unsigned int x, unsigned int y) {
    unsigned int camx = *(unsigned int*)&emu->nds->MainRAM[0x140f4c];
    unsigned int camy = *(unsigned int*)&emu->nds->MainRAM[0x140f50];

    float sx = 256 / 66046.0;
    float sy = 192 / 49662.0;

    Position out = {
        static_cast<unsigned int>((x - camx) * sx),
            static_cast<unsigned int>((y - camy) * sy)
    };

    return out;
}

unsigned int valid_ents() {
    if (emu == nullptr || entityArray == nullptr) return 0;
    unsigned int retval = 0;
    for (int i=0; i < 0x40; i++) {
        Entity* ent = &entityArray[i];
        if (ent->X != 0 && ent->Y != 0) {
            retval |= (1 << i);
        }
    }
    return retval;
}

unsigned int get_room() {
    return *(unsigned int*)&emu->nds->MainRAM[0x143b20];//[0x143c1e];
}

unsigned int get_entity_x(int i) {
    if (entityArray == nullptr) return 0;
    return entityArray[i].X;
}

unsigned int get_entity_y(int i) {
    if (entityArray == nullptr) return 0;
    return entityArray[i].Y;
}

unsigned int get_entity_type(int i) {
    if (entityArray == nullptr) return 0;
    return entityArray[i].entity_index;
}


EMSCRIPTEN_BINDINGS(EntityViewer) {
    function("init_emu", &init_emu);
    function("get_room", &get_room);
    function("get_entity_type", &get_entity_type);
    function("get_entity_x", &get_entity_x);
    function("get_entity_y", &get_entity_y);
    function("valid_ents", &valid_ents);
}
