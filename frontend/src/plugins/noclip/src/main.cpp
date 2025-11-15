#include "WasmEmulator.h"
#include "NDS.h"

wasmelon::WasmEmulator *emu = nullptr;

void init_emu(long long emu_addr) {
    emu = reinterpret_cast<wasmelon::WasmEmulator *>(emu_addr);
}


void get_player_pos() {

}

int get_x() {

}

int get_y() {

}

void frame(){
    /*if (emu == nullptr) return;
    NDS* nds = emu->getNDS();

    if (nds->IsRunning()) {
        unsigned int& playerX = *(unsigned int*)&nds->MainRAM[0x143b20];
        unsigned int& playerY = *(unsigned int*)&nds->MainRAM[0x143b24];
        int speed = window->ui->speedBox->value();
        if (upPress) playerY -= speed;
        if (downPress) playerY += speed;
        if (leftPress) playerX -= speed;
        if (rightPress) playerX += speed;
        window->ui->posLabel->setText(QString::fromStdString("(" + std::to_string(playerX) + ", " + std::to_string(playerY) + ")"));
        }*/
}
