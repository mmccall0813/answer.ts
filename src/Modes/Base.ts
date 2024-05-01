export type Question = {
    answers: any[];
    correctAnswers: any[];
    random: boolean;
    timeLimit: number;
    number: number;
    image: any;
    audio: any;
    qType: string;
}

interface IsLiveGame {
    isLiveGame: true;
    joinCode: string;
}

interface IsNotLiveGame {
    isLiveGame: false;
    joinCode: null;
}

export class BaseGameMode {
    questions: Question[];
    question: Question | null;
    mode: string;
    liveGame: IsLiveGame | IsNotLiveGame;
    constructor(){
        this.questions = [];
        this.mode = "";
        this.question = null;
        this.liveGame = {isLiveGame: false, joinCode: null};
    }
    getStateNode(){
        let header = document.querySelector("#header");
        let app;
        if(!header){
            app =document.querySelector("#app")?.children[0]?.children[0]
        } else {
            app = header.parentElement;
        }
        if(!app) throw "Cannot get stateNode in this context!";

        // @ts-ignore
        // silence ts, i know what im doing
        let stateNode = app[Object.keys(app)[1]].children[0]._owner.stateNode;
        return stateNode;
    }
}

export interface BaseLiveGameStateNode {
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
    }
    state: {
        question: Question | undefined;
    }
    setState(newState: Record<any, any>): void; // this doesnt ACTUALLY return void, but we dont use the returned value for anything so idc
}

export class BaseLiveGameMode extends BaseGameMode {
    constructor(){
        super();
    }
    getStateNode(): BaseLiveGameStateNode {
        return super.getStateNode();
    }
    updateBasicInfo(){
        let stateNode = this.getStateNode();
        this.liveGame = {isLiveGame: true, joinCode: stateNode.props.client.hostId};
        this.mode = stateNode.props.client.type;
        this.question = stateNode.props.client.question || stateNode.state.question || null;
        this.questions = stateNode.props.client.questions;
    }
}

