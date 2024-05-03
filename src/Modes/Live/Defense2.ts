import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";

type TowerDefense2Stage = "question" | "feedback" | "";

interface TowerDefense2StateNode extends BaseLiveGameStateNode {
    state: {
        coins: number,
        question: Question,
        previewTower: string,
        selectedTower: null, // TODO: make a tower type
        mShopOpen: boolean,
        stage: TowerDefense2Stage
    }
}

export class TowerDefense2 extends BaseLiveGameMode {
    UI: UIBuilder;
    constructor(){
        super();

        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
        this.UI.addCheckbox("freeitems", "All Items Free", false, "Makes all towers and upgrades free.");
        this.UI.addButton("killall", "Kill All Enemies");

        let originalItems: any = null;
        let stateNode = this.getStateNode();
        let restore = false;

        Object.defineProperty(Object.prototype, "hello please give me your shoplist (this is a robbery)", {
            get: function(){
                if(originalItems == null) originalItems = structuredClone(this);
                
                if(!restore){
                    Object.keys(this).forEach( (key) => { 
                        this[key].baseStats.price = 0; 
                        this[key].upgrades.forEach( (u: {price: number}) => {
                            u.price = 0;
                        })
                    });
                } else { Object.assign(this, originalItems); originalItems = null; }
                
                stateNode.setState({previewTower: null, selectedTower: null, mShopOpen: false});
                return this[Object.keys(this)[0]]; // prevents a crash i think
            }
        })

        this.UI.checkboxRef.get("freeitems")?.addEventListener("change", (e) => {
            let checked = this.UI.checkboxRef.get("freeitems")?.checked;
            restore = !checked;

            // toggle free items
            this.getStateNode().setState({previewTower: "hello please give me your shoplist (this is a robbery)"});
        })

        this.UI.buttonRef.get("killall")?.addEventListener("click", () => {
            
        })
    }
    tick(){

    }
}