import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type CryptoHackStage = "question" | "feedback" | "prize" | "hack" | "";

type CryptoHackPrize = {
    type: "crypto" | "hack";
}

interface CryptoHackStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question,
        crypto: number,
        crypto2: number,
        choice: number,
        stage: CryptoHackStage;
        correctPassword: string;
        hackPasswords: string[];
        ready: boolean;
        hack: string;
    }
    choosePrize(choice: number): void;
    claimPrize(): void;
}


export class CryptoHack extends BaseLiveGameMode {
    stage: CryptoHackStage;
    prizePhase = -1 | 0 | 1;
    UI: UIBuilder;
    constructor(){
        super();

        this.stage = "";
        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
        this.UI.addCheckbox("autoprize", "Auto Claim Prizes", false, "Automatically claims question rewards.");
        this.UI.addCheckbox("autohack", "Auto Guess Password", false, "Automatically guesses the player passwords. Will always pick the correct choice.");
    }
    getStateNode(): CryptoHackStateNode {
        return super.getStateNode() as CryptoHackStateNode;
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        let stateNode = this.getStateNode();

        this.stage = stateNode.state.stage;

        this.prizePhase = -1;
        if(this.stage === "prize" && stateNode.state.choice === -1) this.prizePhase = 0;
        if(this.stage === "prize" && stateNode.state.choice > -1 && stateNode.state.ready) this.prizePhase = 1;
    }
    tick(): void {
        // update vars
        this.updateBasicInfo();

        if(this.getStateNode().state.hack != "") this.getStateNode().setState({hack: ""}); // clear any incoming hacks off of the screen

        let autoAnswer = this.UI.checkboxRef.get("autoans")?.checked;
        let autoPrize = this.UI.checkboxRef.get("autoprize")?.checked;
        switch(this.stage){
            case "question":
                var button = document.querySelector("#answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "feedback":
                var button = document.querySelector("#feedbackButton") as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "prize":
                switch(this.prizePhase){
                    case 0:
                        this.getStateNode().choosePrize(0); // theres only 1 prize, illusion of choice. not the case for gold quest for some reason...
                    break;
                    case 1:
                        this.getStateNode().claimPrize();
                    break;
                }
            break;
        }
    }
}