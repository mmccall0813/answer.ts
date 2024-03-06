interface GameModeDetectorStateNode {
    props: {
        client: {
            type: string | undefined;
        }
        setDefense: Function | undefined;
        setDefense2: Function | undefined;
        setupCafe: Function | undefined;
        createTower: Function | undefined;
    }
}

function getStateNode(): GameModeDetectorStateNode {
    let header = document.querySelector("#header");
    if(!header) throw "Cannot get state node in this context!";
    let app = header!.parentElement;

    // @ts-ignore
    // silence ts, i know what im doing
    let stateNode = app[Object.keys(app)[1]].children[0]._owner.stateNode;
    return stateNode;
}

export function GameModeDetector(): { live: boolean, mode: string } {
    let live = false;
    let mode = "";
    let found = false;
    let stateNode;
    try {
        stateNode = getStateNode();
    } catch(err){
        return {live: false, mode: "unknown"};
    }

    if(stateNode.props.client?.type && !found){
        live = true;
        mode = stateNode.props.client.type;
        found = true;
    }

    if(typeof stateNode.props.setDefense === "function" && !found){
        live = false;
        mode = "TowerDefense"
        found = true;
    }

    if(typeof stateNode.props.setDefense2 === "function" && !found){
        live = false;
        mode = "TowerDefense2";
        found = true;
    }

    if(typeof stateNode.props.setupCafe === "function" && !found){
        live = false;
        mode = "Cafe";
        found = true;
    }

    if(typeof stateNode.props.createTower === "function" && !found){
        live = false;
        mode = "TowerOfDoom";
        found = true;
    }

    if(found) return {live: live, mode: mode};
    else return {live:false, mode: "unknown"};
}