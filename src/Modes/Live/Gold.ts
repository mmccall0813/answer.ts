import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

interface GoldQuestPrizeItem {
    blook: string
    type: string
    text: string
    val: number
}

type GoldQuestStage = "question" | "feedback" | "prize" | "";

interface GoldQuestStateNode extends BaseLiveGameStateNode {
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
}

class GoldQuest extends BaseLiveGameMode {
    choices: GoldQuestPrizeItem[];
    stage: GoldQuestStage;
    attackerMessage: boolean;
    constructor(){
        super();
        this.choices = [];
        this.stage = "";
        this.attackerMessage = false;
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        let stateNode = this.getStateNode() as GoldQuestStateNode;

        this.choices = stateNode.state.choices;
        this.stage = stateNode.state.stage;
    }
    tick(){
        // close any attacker prompts

    }
}