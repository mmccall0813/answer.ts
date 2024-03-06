import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

interface GoldQuestPrizeItem {
    blook: string
    type: string
    text: string
    val: number
}

type GoldQuestStage = "question" | "feedback" | "prize" | "";

interface GoldQuestStateNode extends BaseLiveGameStateNode {
    props: {
        client: {
            allowAccounts: boolean;
            blook: string;
            correct: boolean;
            corrects: Map<number, number>;
            hostId: string;
            incorrects: Map<number, number>;
            name: string;
            plus: boolean;
            question: Question | undefined;
            questions: Question[];
            randomNames: boolean;
            type: string;
            username: string;
        }
        liveGameController: {
            getDatabaseVal(value: string): Promise<{ [key: string]: {b: string, g: number}}>;
            setVal(options: any): Promise<void>; // this typing isnt all all accurate but I DONT CARE!!!!
        }
    }
    state: {
        attackerBlook: string;
        attackerMsg: string;
        choice: number;
        choiceObj: GoldQuestPrizeItem;
        choices: GoldQuestPrizeItem[];
        question: Question;
        correct: boolean;
        gold: number; // gold and gold2 are always the same... maybe some really shitty anti-cheat check?
        gold2: number;
        stage: GoldQuestStage
    }
    setState(newState: Record<any, any>): void; // this doesnt ACTUALLY return void, but we dont use the returned value for anything so idc
}

export class GoldQuest extends BaseLiveGameMode {
    choices: GoldQuestPrizeItem[];
    stage: GoldQuestStage;
    attackerPopup: boolean;
    attacker: string;
    attacktype: "steal" | "swap" | "";
    attackamount: number;
    UI: UIBuilder;
    constructor(){
        super();
        this.choices = [];
        this.stage = "";
        this.attackerPopup = false;
        this.attacker = "";
        this.attacktype = "";
        this.attackamount = 0;
        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer");
        this.UI.addCheckbox("autoprize", "Auto Claim Prizes");
        this.UI.addCheckbox("nobadprizes", "Never Auto Claim Bad Prizes");
        this.UI.addCheckbox("revengesteal", "Revenge Steal");
        this.UI.addCheckbox("revengeswap", "Revenge Swap");
    }
    getStateNode(): GoldQuestStateNode {
        return super.getStateNode() as GoldQuestStateNode;
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        let stateNode = this.getStateNode();

        this.choices = stateNode.state.choices;
        this.stage = stateNode.state.stage;
        this.attackerPopup = (stateNode.state.attackerMsg !== "");
        if(stateNode.state.attackerMsg.endsWith(" just swapped gold with you!")){
            this.attacktype = "swap";
            this.attacker = stateNode.state.attackerMsg.replace(" just swapped gold with you!", "");
        } else {
            this.attacktype = "steal";
            this.attackamount = parseInt(stateNode.state.attackerMsg.slice(stateNode.state.attackerMsg.indexOf(" just took ")+11, stateNode.state.attackerMsg.indexOf(" gold from you!")));
            this.attacker = stateNode.state.attackerMsg.slice(0, stateNode.state.attackerMsg.indexOf(` just took ${this.attackamount} gold from you!`))
        }
    }
    tick(){
        // update variables
        this.updateBasicInfo();

        // close any attacker prompts, and send out revenge steal/swap if enabled
        if(this.attackerPopup){
            let closeButton = document.querySelector("#modalOk") as HTMLElement;
            closeButton.click();
            let performRevenge = false;

            if(this.attacktype === "swap" && this.UI.checkboxRef.get("revengeswap")?.checked === true){
                performRevenge = true;
            }
            if(this.attacktype === "steal" && this.UI.checkboxRef.get("revengesteal")?.checked === true){
                performRevenge = true;
            }

            if(performRevenge){
                // how dare they use a game mechanic as its intended!
                // steal all their doubloons and leave none left!
                this.getStateNode().props.liveGameController.getDatabaseVal("c").then( (data) => {
                    this.getStateNode().props.liveGameController.setVal({
                        path: `c/${this.getStateNode().props.client.name}`,
                        val: {
                            b: this.getStateNode().props.client.blook,
                            g: this.getStateNode().state.gold + data[this.attacker].g,
                            tat: `${this.attacker}:${data[this.attacker].g}`
                        }
                    });
                    this.getStateNode().setState({gold: this.getStateNode().state.gold+data[this.attacker].g, gold2: this.getStateNode().state.gold2+data[this.attacker].g});
                })
            }
        }

        let autoAnswer = this.UI.checkboxRef.get("autoans")?.checked;
        switch(this.stage){
            case "question":
                let button = document.querySelector("#answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "feedback":

            break;
        }
    }
}
