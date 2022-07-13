class AbstractButton extends EventTarget{
    constructor(buttonDiv){
        super();

        this.buttonDiv = buttonDiv;
        console.log("buttonDiv", this.buttonDiv);
        
    }

    disable(bool = true) {
        this.buttonDiv.disabled = bool;
        this.buttonDiv.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            this.buttonDiv.removeEventListener(EventNames.CLICK, this.buttonClickHandler);
        } else {
            this.buttonDiv.addEventListener(EventNames.CLICK, function () {
                this.buttonClickHandler();
            }.bind(this));
        }
    }

    buttonClickHandler(){
        console.log("AbstractButton clicked.");
    }
}