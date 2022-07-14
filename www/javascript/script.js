const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const States = {
    GOOD: "✅",
    WRONG: "❌"
}

const Delays = {
    FLIP: 1500
}

class Line {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
}

const PairGameEventNames = {
    GOOD: "good",
    WRONG: "wrong",
    FLIP: "flip",
};

class PairGameEvent extends AbstractGameEvent {
    constructor(type) {
        super(type);
    }
}

class PairGame extends AbstractGame {
    constructor() {
        super();

        this.cards = [];
        this.allCouples = [];
        this.firstCard;
        this.secondCard;
        this.locked = false;
        this.flippedCard = false;

        this.linesDiv = document.querySelectorAll(".ligne");
        this.lines = [];

        for (const lineDiv of this.linesDiv) {
            const line = new Line(lineDiv);
            this.lines.push(line);
        }
    }

    cardClickHandler(card) {
        
        if (this.locked) {
            return;
        }
        
        card.activate(true);

        if (!this.flippedCard) {
            this.flippedCard = true;
            this.firstCard = card;
            card.disable(true);
        } else {
            this.flippedCard = false;
            this.secondCard = card;
            console.log("this.secondCard", this.secondCard);
        }

        if (this.firstCard && this.secondCard) {
            console.log("isCardsMatch", this.isCardsMatch());
            this.locked = true;
            this.secondCard.disable(true);
            if (this.isCardsMatch()) {
                for (const couple of this.allCouples) {
                    console.log("couple", couple);
                    const first = couple[0];
                    if (this.firstCard.letter == first.letter) {
                        this.allCouples.splice(this.allCouples.indexOf(couple), 1);
                        console.log("allCouples.length", this.allCouples.length);
                        if (this.allCouples.length == 0) {
                            console.log("Partie terminée !");
                            this.dispatchEvent(new PairGameEvent(AbstractGameEventNames.WIN));
                        }
                        break;
                    }
                }
                this.firstCard = null;
                this.secondCard = null;
                this.locked = false;
                this.dispatchEvent(new PairGameEvent(PairGameEventNames.GOOD));
            } else {
                this.dispatchEvent(new PairGameEvent(PairGameEventNames.WRONG));
                setTimeout(() => {
                    
                    this.firstCard.activate(false);
                    this.secondCard.activate(false);
                    this.firstCard.disable(false);
                    this.secondCard.disable(false);
                    
                    this.firstCard = null;
                    this.secondCard = null;
                    this.locked = false;

                    this.dispatchEvent(new PairGameEvent(PairGameEventNames.FLIP));
                    
                }, Delays.FLIP);
            }
        }
    }

    init(dataSource) {
        this.cards.splice(0);
        const cardsClass = dataSource.querySelectorAll(".carte");

        for (const cardClass of cardsClass) {
            const card = new Card(cardClass);
            card.addEventListener(CardEventsName.CLICK, function () {
                this.cardClickHandler(card);
            }.bind(this));

            card.face.textContent = card.letter;
            if (debug) {
                card.back.textContent = card.letter;
            }
            this.cards.push(card);
        }

        shuffleArray(this.lines);

        for (const ligne of this.lines) {
            dataSource.querySelector("body").insertBefore(ligne.dataSource, this.infosDiv);
        }
        
        let i = 0;
        for (const letter of Letters) {
            let couples = [];
            for (const card of this.cards) {
                if (card.letter == letter) {
                    if(isDebug){
                        card.buttonDiv.style.border = "solid";
                    }
                    console.log(card);
                    card.rotate();
                    couples.push(card);
                }
            }
            if (couples.length > 0) {
                this.allCouples.push(couples);
            }
            console.log(letter);
            
            if(isDebug && i > Letters.length / 4){
                break;
            }
            i++;
        }

        this.flipCards();

        super.init(dataSource);
    }

    flipCards() {
        for (const card of this.cards) {
            card.activate(true);
            setTimeout(() => {
                card.activate(false);
                card.disable(false);
            }, Delays.FLIP);
        }
    }

    isCardsMatch() {
        // console.log(getFace(firstCard).textContent, getFace(secondCard).textContent);
        const bool = this.firstCard.face. textContent == this.secondCard.face.textContent;
        return bool;
    }

}

const CardEventsName = {
    CLICK: "card_click"
}

class CardEvent extends CustomEvent {
    constructor(type) {
        super(type);
    }
}

class Card extends AbstractButton {
    constructor(buttonDiv) {
        super(buttonDiv);
    }

    get letter() {
        return this.buttonDiv.getAttribute("data-attr");
    }

    get face() {
        return this.buttonDiv.querySelector(".face");
    }

    get back() {
        return this.buttonDiv.querySelector(".arriere");
    }

    buttonClickHandler() {
        super.buttonClickHandler();

        this.dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }

    activate(flag) {
        if (flag) {
            this.buttonDiv.childNodes[1].classList.toggle("active");
        } else {
            this.buttonDiv.childNodes[1].classList.remove("active");
        }
    }

    rotate() {
        this.face.style.transform = "rotateY(180deg)";
    }
}

function pairGameInitHandler(evt){
    console.log("pairGameInitHandler", evt.target);
    const infosDiv = document.querySelector("#infos");
    infosDiv.parentNode.appendChild(infosDiv);
    refreshNbCouples();
}

function pairGameGoodWrongHandler(evt){
    console.log("pairGameGoodWrongHandler", evt.type);
    const stateDiv = document.querySelector("#state");
    stateDiv.textContent = evt.type == PairGameEventNames.GOOD ? States.GOOD : States.WRONG;
    if(evt.type == PairGameEventNames.GOOD){
        refreshNbCouples();
    }
}

function pairGameFlipHandler(evt){
    console.log("pairGameFlipHandler", evt.type);
    const stateDiv = document.querySelector("#state");
    stateDiv.textContent = "";
}

function refreshNbCouples() {
    const infosDiv = document.querySelector("#infos");
    const couplesDiv = document.querySelector("#couples");
    couplesDiv.textContent = "Nombre de couples restant : " + pairGame.allCouples.length;
}

const pairGame = new PairGame();
pairGame.addEventListener(AbstractGameEventNames.INIT, pairGameInitHandler);
pairGame.addEventListener(PairGameEventNames.GOOD, pairGameGoodWrongHandler);
pairGame.addEventListener(PairGameEventNames.WRONG, pairGameGoodWrongHandler);
pairGame.addEventListener(PairGameEventNames.FLIP, pairGameFlipHandler);
pairGame.init(document);