import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode } from "../Base";

interface ClassicStateNode extends BaseLiveGameStateNode {
    ready: boolean | undefined;
    onAnswer: Function | undefined;
}

export class Classic extends BaseLiveGameMode {
    readyToAnswer: boolean;
    UI: UIBuilder;
    constructor(){
        super();
        this.readyToAnswer = false;

        this.UI = new UIBuilder();
        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();
        let stateNode = this.getStateNode() as ClassicStateNode;

        this.readyToAnswer = (this.UI.checkboxRef.get("autoans")?.checked === true) && (stateNode.ready === true) && (stateNode.onAnswer !== undefined)
    }
    tick(){
        this.updateBasicInfo();

        if(this.readyToAnswer){
            let button = document.getElementById("answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
            button.click();
        }

    }
}