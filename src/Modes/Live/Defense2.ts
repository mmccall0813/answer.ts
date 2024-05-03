import { UIBuilder } from "../../UI/UIBuilder";
import { BaseLiveGameMode, BaseLiveGameStateNode, Question } from "../Base";
import { Game, GameObjects } from "phaser"; // this single import adds 2 seconds to compile time :(

type TowerDefense2Stage = "question" | "feedback" | "";

interface TowerDefense2StateNode extends BaseLiveGameStateNode {
    state: {
        coins: number,
        question: Question,
        previewTower: string,
        selectedTower: null, // TODO: make a tower type
        mShopOpen: boolean,
        stage: TowerDefense2Stage,
        totalDmg: number
    },
    game: {
        current: Game   
    }
    onAnswer(correct: boolean, answer: string): void,
    answerNext(): void
}

interface EnemyGameObject extends GameObjects.GameObject {
    hp: number,
    dmg: number,
    speed: number,
    receiveDamage(s: number, t: number): void,
    setHP(newHP: number): void
} 

export class TowerDefense2 extends BaseLiveGameMode {
    UI: UIBuilder;
    stage: TowerDefense2Stage;
    constructor(){
        super();

        this.UI = new UIBuilder();

        this.UI.addCheckbox("autoans", "Auto Answer", false, "Automatically answers questions.");
        this.UI.addCheckbox("freeitems", "All Items Free", false, "Makes all towers and upgrades free.");
        this.UI.addCheckbox("fasttowers", "Faster Towers", false, "Makes the attack speed of all towers 10x faster.");
        this.UI.addCheckbox("slowenemies", "Super Slow Enemies", false, "Significantly reduces speed of enemies.");
        this.UI.addButton("killall", "Kill All Enemies");

        this.stage = "";

        let originalItems: any = null;
        let stateNode = this.getStateNode();
        let freeItems = {enabled: false};
        let fastTowers = {enabled: false};
        let makeChanges = true;

        // prevents duplicate instances of answer.ts from breaking eachother
        let shoplistGrabberName = crypto.randomUUID();

        Object.defineProperty(Object.prototype, shoplistGrabberName, {
            get: function(){
                if(!makeChanges) return Object.values(this)[0];
                if(originalItems == null) originalItems = structuredClone(this);

                // restore original before making any changes
                Object.assign(this, structuredClone(originalItems));
                    
                if(freeItems.enabled || fastTowers.enabled){
                    Object.keys(this).forEach( (key) => { 
                        if(freeItems.enabled) this[key].baseStats.price = 0; 
                        if(fastTowers.enabled) this[key].baseStats.fireRate /= 10;

                        this[key].upgrades.forEach( (u: {price: number, fireRate?: number}) => {
                            if(freeItems.enabled) u.price = 0;
                            if(fastTowers.enabled && u.fireRate) u.fireRate /= 10;
                        })
                    });
                }
                
                makeChanges = false;
                stateNode.game.current.events.emit("deselect-tower");
                return Object.values(this)[0] // prevents a crash i think
            }
        })

        this.UI.checkboxRef.get("freeitems")?.addEventListener("change", (e) => {
            let checked = this.getCheckboxState("freeitems");
            freeItems.enabled = checked;
            makeChanges = true;
            
            /*
               make the game attempt to access the "trap" we set up earlier,
               when the game calls that getter function, we gain access to the
               internal tower stats, and we can make changes to it from there
            */
            stateNode.game.current.events.emit("preview-tower", shoplistGrabberName);
            stateNode.setState({}); // force a re-render
        })

        this.UI.checkboxRef.get("fasttowers")?.addEventListener("change", (e) => {
            let checked = this.getCheckboxState("fasttowers");
            fastTowers.enabled = checked;
            makeChanges = true;

            stateNode.game.current.events.emit("preview-tower", shoplistGrabberName);
            stateNode.setState({});
        })

        this.UI.buttonRef.get("killall")?.addEventListener("click", () => {
            stateNode.game.current.scene.scenes[0].physics.world.bodies.entries.filter( (e) => e.gameObject.active).forEach( (enemyBody) => {
                let enemy = enemyBody.gameObject as EnemyGameObject;
                stateNode.setState({totalDmg: stateNode.state.totalDmg+enemy.hp});
                enemy.receiveDamage(enemy.hp, 1);
            });
        })
    }
    getStateNode(): TowerDefense2StateNode {
        return super.getStateNode() as TowerDefense2StateNode;
    }
    updateBasicInfo(): void {
        super.updateBasicInfo();

        let stateNode = this.getStateNode();

        this.stage = stateNode.state.stage;
    }
    getCheckboxState(name: string): boolean {
        return this.UI.checkboxRef.get(name)?.checked || false;
    }
    tick(){
        this.updateBasicInfo();
        let stateNode = this.getStateNode();

        if(this.getCheckboxState("autoans")) switch(this.stage) {
            case "question":
                stateNode.onAnswer(true, this.question?.correctAnswers[0]);
            break;
            case "feedback":
                stateNode.answerNext();
            break;
        }
    }
}