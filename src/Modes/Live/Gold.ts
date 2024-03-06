import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

interface GoldQuestPrizeItem {
    blook: string
    type: string
    text: string
    val: number
}

type GoldQuestStage = "question" | "feedback" | "prize" | "";

interface GoldQuestPlayer {
    name: string;
    blook: string;
    gold: number;
}

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
        stage: GoldQuestStage;
        players: GoldQuestPlayer[];
        ready: boolean;
        phaseTwo: boolean;
    }
    setState(newState: Record<any, any>): void; // this doesnt ACTUALLY return void, but we dont use the returned value for anything so idc
    choosePrize(prize: number): void;
    claimPrize(): void;
    randomQ(): void;
    selectPlayer(player: number): void;
}

export class GoldQuest extends BaseLiveGameMode {
    choices: GoldQuestPrizeItem[];
    stage: GoldQuestStage;
    prizePhase: -1 | 0 | 1 | 2; // -1: not on prize screen, // 0: picking prize // 1: prize picked // 2: picking player to steal from
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
        this.prizePhase = -1;
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

        this.prizePhase = -1;
        if(this.stage === "prize" && stateNode.state.choice === -1) this.prizePhase = 0;
        if(this.stage === "prize" && stateNode.state.choice > -1 && stateNode.state.ready && stateNode.state.phaseTwo === false) this.prizePhase = 1;
        if(this.stage === "prize" && stateNode.state.phaseTwo === true) this.prizePhase = 2;
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
        let autoPrize = this.UI.checkboxRef.get("autoprize")?.checked;
        let noBadPrizes = this.UI.checkboxRef.get("nobadprizes")?.checked;
        switch(this.stage){
            case "question":
                var button = document.querySelector("#answer"+this.question?.answers.indexOf(this.question.correctAnswers[0]))?.children[0] as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "feedback":
                var button = document.querySelector("#header + div > div") as HTMLElement;
                if(autoAnswer) button.click();
            break;
            case "prize":
                if(autoPrize){
                    switch(this.prizePhase){
                        case 0:
                            let choice = Math.floor(Math.random() * 3);

                            if(noBadPrizes){
                                while(this.choices[choice].type === "divide"){
                                    choice = Math.floor(Math.random() * 3);
                                }
                            }

                            
                            this.getStateNode().choosePrize(choice);
                        break;
                        case 1:
                            this.getStateNode().claimPrize();
                        break;
                        case 2:
                            if(
                                (this.getStateNode().state.players.length === 0) ||
                                (this.getStateNode().state.gold > this.getStateNode().state.players[0].gold 
                                && this.getStateNode().state.choiceObj.type === "swap")
                                ){
                                this.getStateNode().randomQ();
                                break;

                            }
                            this.getStateNode().selectPlayer(0);
                            
                        break;
                    }
                }
            break;
        }
    }
}
