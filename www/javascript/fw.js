const EventNames = {
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    CLICK: "click",
    MOUSE_OVER: "mouseover",
    MOUSE_OUT: "mouseout",
    INPUT: "input"
    // etc
};

class AbstractButton extends EventTarget{
    constructor(buttonDiv){
        super();

        this.buttonDiv = buttonDiv;
        // https://medium.com/@bigcatplichta/javascript-use-bind-to-dynamically-add-and-remove-event-listeners-d6b443877a73
        this.boundEventHandler = this.buttonClickHandler.bind(this);
        this.isDisable = false;
        console.log("buttonDiv", this.buttonDiv);
    }

    disable(bool = true) {
        this.isDisable = bool;
        this.buttonDiv.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            this.buttonDiv.removeEventListener(EventNames.CLICK, this.boundEventHandler);
        } else {
            this.buttonDiv.addEventListener(EventNames.CLICK, this.boundEventHandler)
        }
    }

    buttonClickHandler(){
        console.log("AbstractButton clicked.", this.buttonDiv);
    }
    
};

const AbstractGameEventNames = {
    INIT: "init",
    WIN: "win",
    LOSE: "lose"
};

class AbstractGameEvent extends CustomEvent {
    constructor(type) {
        super(type);
    }
};

class AbstractGame extends EventTarget {
    constructor() {
        super();
        console.log("Instanciation du jeu.");
        this.dataSource;
        this.points = 0;
    }

    init(dataSource) {
        this.dataSource = dataSource;
        this.dispatchEvent(new AbstractGameEvent(AbstractGameEventNames.INIT));
        console.log("Game init avec la source : " + dataSource);
    }

    increasePoints(){
        this.points += 100;
        console.log("increasePoints", this.points);
    }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDebug = urlParams.get('debug');
let debug = (window.location.protocol == "file:") || (window.location.hostname == "127.0.0.1") || (isDebug == "true");
if (isDebug == "false") {
    debug = false;
}
console.log("debug", debug);