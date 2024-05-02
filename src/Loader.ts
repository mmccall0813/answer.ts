import { GameModeDetector } from "./Modes/DetectMode";
import { Classic } from "./Modes/Live/Classic";
import { FishingFrenzy } from "./Modes/Live/Fish";
import { GoldQuest } from "./Modes/Live/Gold";
import { CryptoHack } from "./Modes/Live/Hack";

interface ModeController {
    tick(): void;
}

// attempt to detect the game the user is playing
// if no game is detected, do nothing

let mode = GameModeDetector();
let controller: ModeController | null = null;

switch(mode.mode){
    case "Classic":
        controller = new Classic();
    case "Gold":
        controller = new GoldQuest();
    case "Hack":
        controller = new CryptoHack();
    case "Fish":
        controller = new FishingFrenzy();
}


let tickrate = 100;
if(controller) setInterval( () => {controller?.tick()}, tickrate);

// remove this when releasing
// @ts-ignore
window.Debug = controller;