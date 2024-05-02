import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type FishingFrenzyStage = "" | "caught" | "lost" | "question" | "feedback";

interface FishingFrenzyStateNode extends BaseLiveGameStateNode {
    state: {
        question: Question,
        castReady: boolean,
        claimReady: boolean,
        isCast: boolean,
        isHooked: boolean,
        stage: FishingFrenzyStage
    }
    onCast(): void;
    onHook(): void;
    claimFish(): void;
    answerNext(): void;
    lureCounter: number;
}

export class FishingFrenzy extends BaseLiveGameMode {
    stage: FishingFrenzyStage;
    UI: UIBuilder;
    isCastFunctionPatched: boolean;
    constructor(){
        super();

        this.stage = "";
        this.UI = new UIBuilder();
        this.isCastFunctionPatched = false;

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
        this.UI.addCheckbox("autocast", "Auto Cast", false, "Automatically casts your fishing rod.");
        this.UI.addCheckbox("autoreel", "Auto Reel", false, "Automatically reels in hooked fish.");
        this.UI.addCheckbox("autoclaim", "Auto Claim Fish", false, "Automatically claims fish.");
        this.UI.addCheckbox("fastcast", "Instant Cast", false, "Removes the delay between casting and hooking a fish.");
        this.UI.addCheckbox("fastlure", "Lure Upgrade", false, "Guarantees a lure upgrade on your next cast.");

        
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        this.stage = this.getStateNode().state.stage;
    }
    getStateNode(): FishingFrenzyStateNode {
        return super.getStateNode() as FishingFrenzyStateNode;
    }
    getCheckboxState(name: string): boolean {
        return this.UI.checkboxRef.get(name)?.checked || false;
    }
    tick() {
        this.updateBasicInfo();
        let stateNode = this.getStateNode();
        if(this.getCheckboxState("fastlure")) stateNode.lureCounter = 99;
        if(this.getCheckboxState("autocast") && stateNode.state.castReady) stateNode.onCast();
        if(this.getCheckboxState("autoreel") && stateNode.state.isHooked) stateNode.onHook();

        if(!this.isCastFunctionPatched && stateNode.onCast != null){
            let oldCastFunction = this.getStateNode().onCast;

            this.getStateNode().onCast = () => {
                this.getCheckboxState("fastcast") ? this.getStateNode().setState({isHooked: true}) : oldCastFunction();
            }
            
            this.isCastFunctionPatched = true;
        }

        switch(this.stage){
            case "question":
                var button = document.querySelector("#answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
                if(this.getCheckboxState("autoans")) button.click();
            break;
            case "feedback":
                stateNode.answerNext();
            break;
            case "caught":
                if(this.getCheckboxState("autoclaim") && stateNode.state.claimReady) stateNode.claimFish();
            break;
        }
    }
}