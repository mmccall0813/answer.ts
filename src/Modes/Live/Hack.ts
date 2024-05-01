import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type CryptoHackStage = "question" | "feedback" | "prize" | "";

interface CryptoHackStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question,
        crypto: number,
        crypto2: number,
        stage: CryptoHackStage;
    }
}


export class CryptoHack extends BaseLiveGameMode {
    stage: CryptoHackStage;
    prizePhase = -1 | 0;
    UI: UIBuilder;
    constructor(){
        super();

        this.stage = "";
        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.")
    }
    getStateNode(): CryptoHackStateNode {
        return super.getStateNode() as CryptoHackStateNode;
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        let stateNode = this.getStateNode();

        this.stage = stateNode.state.stage;
    }
    tick(): void {
        // update vars
        this.updateBasicInfo();

        let autoAnswer = this.UI.checkboxRef.get("autoans")?.checked;
        switch(this.stage){
            case "question":
                var button = document.querySelector("#answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "feedback":
                var button = document.querySelector("#header + div > div") as HTMLElement;
                if(autoAnswer) button.click();
            break;
        }
    }
}