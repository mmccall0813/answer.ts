import { GameModeDetector } from "./Modes/DetectMode";
import { Classic } from "./Modes/Live/Classic";
import { TowerDefense2 } from "./Modes/Live/Defense2";
import { FishingFrenzy } from "./Modes/Live/Fish";
import { GoldQuest } from "./Modes/Live/Gold";
import { CryptoHack } from "./Modes/Live/Hack";
import { Racing } from "./Modes/Live/Racing";
import { BattleRoyale } from "./Modes/Live/Royale";

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
    case "Royale":
        controller = new BattleRoyale();
    case "Racing":
        controller = new Racing();
    case "Defense2":
        controller = new TowerDefense2();
}


let tickrate = 100;
if(controller) setInterval( () => {controller?.tick()}, tickrate);

// remove this when releasing
// @ts-ignore
window.Debug = controller;