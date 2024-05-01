export class UIBuilder {
    rootElement: HTMLElement;
    checkboxRef: Map<string, HTMLInputElement>;
    sliderRef: Map<string, HTMLInputElement>;
    buttonRef: Map<string, HTMLDivElement>;
    constructor(){
        this.checkboxRef = new Map();
        this.sliderRef = new Map();
        this.buttonRef = new Map();

        let elem = document.createElement("div");
        this.rootElement = elem;
        let x = window.screen.availWidth/100;
        let y = window.screen.availHeight/20;
        elem.style.zIndex = "999";
        elem.style.position = "absolute";
        elem.style.left = x.toString()+"px";
        elem.style.top = y.toString()+"px";
        elem.style.backgroundColor = "#52297a";
        elem.style.padding = "5px";
        elem.style.minWidth = "300px";
        elem.style.maxWidth = "550px";
        elem.style.minHeight = "200px";
        elem.style.paddingTop = "23px";

        let header = document.createElement("div");
        header.style.width = "100%";
        header.style.position = "absolute";
        header.style.left = "0px";
        header.style.top = "0px";
        header.style.height = "17px";
        header.style.backgroundColor = "rgba(0, 0, 0, 0.2)";

        let headertext = document.createElement("span");
        headertext.style.fontSize = "15px"
        headertext.style.color = "white";
        headertext.style.fontFamily = "Courier New";
        headertext.style.paddingLeft = "5px";
        headertext.style.userSelect = "none";
        headertext.style.position = "absolute";
        headertext.innerText = "answer.ts";

        let minimizeButton = document.createElement("div");
        minimizeButton.style.width = "17px";
        minimizeButton.style.height = "17px";
        minimizeButton.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        minimizeButton.style.position = "absolute";
        minimizeButton.style.right = "0px";
        minimizeButton.style.top = "0px";
        minimizeButton.style.textAlign = "center";
        minimizeButton.style.verticalAlign = "middle";
        minimizeButton.style.lineHeight = "17px";
        minimizeButton.style.fontSize = "15px";
        minimizeButton.style.color = "white";
        minimizeButton.style.userSelect = "none";
        minimizeButton.innerText = "-";

        header.appendChild(headertext);
        header.appendChild(minimizeButton);
        elem.appendChild(header);

        let dragging = false;
        window.addEventListener("mousedown", (ev) => {
            if((ev.target === header || ev.target === headertext) && ev.button === 0){
                dragging = true;
            }
        })
        window.addEventListener("mousemove", (ev) => {
            if(dragging){
                x+=ev.movementX;
                y+=ev.movementY;
                elem.style.left = x.toString()+"px";
                elem.style.top = y.toString()+"px";
            }
        });
        window.addEventListener("mouseup", (ev) => {
            dragging = false;
        })
        window.addEventListener("mouseleave", (ev) => {
            dragging = false;
        })


        let subtext = document.createElement("div");
        subtext.style.fontSize = "13px";
        subtext.style.color = "white";
        subtext.style.fontFamily = "Courier New";
        subtext.innerText = "made with <3 by mmccall0813";

        //elem.appendChild(subtext);

        document.body.appendChild(elem);
    }
    addCheckbox(id: string, label: string, state?: boolean, description?: string){
        if(this.checkboxRef.get(id) !== undefined){
            throw new Error("Tried to create a duplicate checkbox!");
        }

        let container = document.createElement("div");
        description == undefined ? container.style.height = "20px" : container.style.height = "auto";
        description == undefined ? container.style.lineHeight = "20px" : container.style.lineHeight = "auto";
        container.style.verticalAlign = "middle";
        container.style.backgroundColor = "rgba(0, 0, 0, 0.15)";

        let labelElement = document.createElement("label");
        labelElement.htmlFor = `answerts-checkbox-${id}`;
        labelElement.style.fontFamily = "Courier New";
        labelElement.style.fontSize = "15px";
        labelElement.style.color = "white";
        labelElement.style.userSelect = "none";
        labelElement.innerText = label;

        let checkbox = document.createElement("input");
        checkbox.id = `answerts-checkbox-${id}`
        checkbox.type = "checkbox";
        checkbox.checked = state || false;
        
        let descriptionElement = document.createElement("label");
        descriptionElement.htmlFor = `answerts-checkbox-${id}`;
        descriptionElement.style.fontFamily = "Courier New";
        descriptionElement.style.fontSize = "10px";
        descriptionElement.style.color = "white";
        descriptionElement.style.userSelect = "none";
        descriptionElement.style.display = "block";
        descriptionElement.style.marginLeft = "23px";
        descriptionElement.style.paddingBottom = "2px";
        if(description != undefined) descriptionElement.innerText = description;
        

        container.appendChild(checkbox);
        container.appendChild(labelElement);
        if(description != undefined) container.appendChild(descriptionElement);

        this.rootElement.appendChild(container);

        this.checkboxRef.set(id, checkbox);
        return checkbox;
    }
}