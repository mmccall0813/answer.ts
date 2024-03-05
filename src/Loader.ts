import { GameModeDetector } from "./Modes/DetectMode";
import { Classic } from "./Modes/Live/Classic";

interface ModeController {
    tick(): void;
}

// attept to detect the game the user is playing
// if no game is detected, do nothing

let mode = GameModeDetector();
let controller: ModeController | null = null;

switch(mode.mode){
    case "Classic":
        controller = new Classic();
}

// at some point there will be a gui to configure these things
let tickrate = 100;

if(controller) setInterval( () => {controller?.tick()}, tickrate);