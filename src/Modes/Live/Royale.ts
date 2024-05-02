import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

interface BattleRoyaleStateNode extends BaseLiveGameStateNode {
    state: {
        question: undefined,
        timer: number | undefined
    }
    ready: boolean | undefined;
    onAnswer(correct: boolean, ans: string): void;
}

export class BattleRoyale extends BaseLiveGameMode {
    UI: UIBuilder;
    constructor(){
        super();

        this.UI = new UIBuilder();
        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
    }
    getStateNode(): BattleRoyaleStateNode {
        return super.getStateNode() as BattleRoyaleStateNode;
    }
    tick(){
        this.updateBasicInfo();

        let stateNode = this.getStateNode();

        if(stateNode.ready === true && this.UI.checkboxRef.get("autoans")?.checked){
            stateNode.onAnswer(true, this.question?.correctAnswers[0]);
        }
    }
}