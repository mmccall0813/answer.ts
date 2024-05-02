import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type RacingPhase = "question" | "feedback" | "powerup" | "target" | "";

type RacingPlayer = {
    name: string,
    blook: string,
    progress: number
}

interface RacingStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question | undefined,
        phase: RacingPhase,
        isChosen: boolean,
        players: RacingPlayer[]
    }
    onAnswer(correct: boolean, answer: string): void,
    answerNext(): void,
    choosePowerUp(): void,
    usePowerUp(): void,
    targetPlayer(player: RacingPlayer): void;
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
            switch(stateNode.state.phase){
                case "powerup":
                    stateNode.state.isChosen ? stateNode.usePowerUp() : stateNode.choosePowerUp();
                break;
                case "target":
                    stateNode.targetPlayer(stateNode.state.players.sort( (a, b) => b.progress - a.progress)[0]);
                break;
            }
        }
    }
}