import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

interface CryptoHackStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question
    }
}

export class CryptoHack extends BaseLiveGameMode {

}