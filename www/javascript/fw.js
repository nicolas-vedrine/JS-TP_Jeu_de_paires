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
        this.boundEventHandler = this.buttonClickHandler.bind(this);
        // console.log("buttonDiv", this.buttonDiv);
    }

    disable(bool = true) {
        this.buttonDiv.disabled = bool;
        this.buttonDiv.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            // this.buttonDiv.removeEventListener(EventNames.CLICK, () => this.buttonClickHandler());

            this.removeListener();

            // this.buttonDiv.removeEventListener(EventNames.CLICK, this.buttonClickHandler);
            // this.buttonDiv.removeEventListener(EventNames.CLICK, function () {
            //     this.buttonClickHandler();
            // }.bind(this));
        } else {
            // this.buttonDiv.addEventListener(EventNames.CLICK, function () {
            //     this.buttonClickHandler();
            // }.bind(this));
            // this.buttonDiv.addEventListener(EventNames.CLICK, this.buttonClickHandler);

            // this.buttonDiv.addEventListener(EventNames.CLICK, () => this.buttonClickHandler());
            this.buttonDiv.addEventListener(EventNames.CLICK, this.boundEventHandler)
        }
    }

    // eventHandler() {
    //     console.log(this);
    // }

    removeListener() {
        this.buttonDiv.removeEventListener(EventNames.CLICK, this.boundEventHandler);
     }

    buttonClickHandler(){
        console.log("AbstractButton clicked.");
    }
}

const AbstractGameEventNames = {
    INIT: "init",
    WIN: "win",
    LOSE: "lose"
};

class AbstractGameEvent extends CustomEvent {
    constructor(type) {
        super(type);
    }
}

class AbstractGame extends EventTarget {
    constructor() {
        super();
        console.log("Instanciation du jeu.");
        this.dataSource;
    }

    init(dataSource) {
        this.dataSource = dataSource;
        this.dispatchEvent(new AbstractGameEvent(AbstractGameEventNames.INIT));
        console.log("Game init avec la source : " + dataSource);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDebug = urlParams.get('debug');
let debug = (window.location.protocol == "file:") || (window.location.hostname == "127.0.0.1") || (isDebug == "true");
if (isDebug == "false") {
    debug = false;
}
console.log("debug", debug);