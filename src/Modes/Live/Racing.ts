import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type RacingPhase = "question" | "feedback" | "powerup" | "";

interface RacingStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question | undefined,
        phase: RacingPhase,
        isChosen: boolean
    }
    onAnswer(correct: boolean, answer: string): void,
    answerNext(): void
}

export class Racing extends BaseLiveGameMode {
    UI: UIBuilder
    constructor(){
        super();

        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.")
        this.UI.addCheckbox("autopowerup", "Auto Use Powerups", false, "Automatically claims and uses powerups.");
    }
    getStateNode(): RacingStateNode {
        return super.getStateNode() as RacingStateNode;
    }
    tick(){
        this.updateBasicInfo();
        let stateNode = this.getStateNode();

        if(this.UI.checkboxRef.get("autoans")?.checked){
            switch(stateNode.state.phase){
                case "question":
                    stateNode.onAnswer(true, this.question?.correctAnswers[0]);
                break;
                case "feedback":
                    stateNode.answerNext();
                break;
            }
        }
        if(this.UI.checkboxRef.get("autopowerup")?.checked){
            // TODO
        }
    }
}