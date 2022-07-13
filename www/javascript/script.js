const EventNames = {
    MOUSE_DOWN: "mousedown",
    MOUSE_UP: "mouseup",
    CLICK: "click",
    MOUSE_OVER: "mouseover",
    MOUSE_OUT: "mouseout",
    INPUT: "input"
    // etc
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isDebug = urlParams.get('debug');
let debug = (window.location.protocol == "file:") || (window.location.hostname == "127.0.0.1") || (isDebug == "true");
if (isDebug == "false") {
    debug = false;
}
console.log("debug", debug);

const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const States = {
    GOOD: "✅",
    WRONG: "❌"
}

class AbstractGame {
    constructor() {
        console.log("Instanciation du jeu.");
    }

    init(dataSource) {
        console.log("Game init avec la source : " + dataSource);
    }
}

class Line {
    constructor(dataSource) {
        this.dataSource = dataSource;
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

        this.infosDiv = document.querySelector("#infos");
        this.stateDiv = document.querySelector("#state");
        this.couplesDiv = document.querySelector("#couples");
        this.linesDiv = document.querySelectorAll(".ligne");
        this.lines = [];

        for (const lineDiv of this.linesDiv) {
            const line = new Line(lineDiv);
            this.lines.push(line);
        }
    }

    cardClickHandler(card) {
        card.activate(true);

        if (this.locked) {
            return;
        }

        if (!this.flippedCard) {
            this.flippedCard = true;
            this.firstCard = card;
            card.disable(true);
        } else {
            this.flippedCard = false;
            this.secondCard = card;
            console.log("toto", this.secondCard);
        }

        if (this.firstCard && this.secondCard) {
            console.log("isCardsMatch", this.isCardsMatch());
            this.locked = true;
            this.secondCard.disable(true);
            if (this.isCardsMatch()) {
                this.stateDiv.textContent = States.GOOD;
                for (const couple of this.allCouples) {
                    console.log("couple", couple);
                    const first = couple[0];
                    if (this.firstCard.letter == first.letter) {
                        this.allCouples.splice(this.allCouples.indexOf(couple), 1);
                        console.log("allCouples.length", this.allCouples.length);
                        if (this.allCouples.length == 0) {
                            console.log("Partie terminée !");
                            // this.init();
                        }
                        break;
                    }
                }
                this.firstCard = null;
                this.secondCard = null;
                this.locked = false;
                this.refreshNbCouples();
            } else {
                this.stateDiv.textContent = States.WRONG;
                setTimeout(() => {
                    this.stateDiv.textContent = "";
                    this.firstCard.activate(false);
                    this.secondCard.activate(false);
                    this.firstCard.disable(false);
                    this.secondCard.disable(false);

                    this.firstCard = null;
                    this.secondCard = null;
                    this.locked = false;
                }, 1500);
            }
        }
    }

    init(dataSource) {
        super.init(dataSource);

        this.cards.splice(0);
        const cardsClass = document.querySelectorAll(".carte");

        for (const cardClass of cardsClass) {
            const card = new Card(cardClass);
            card.addEventListener(CardEventsName.CLICK, function () {
                this.cardClickHandler(card);
            }.bind(this));

            card.face.textContent = cardClass.getAttribute("data-attr");
            if (debug) {
                card.back.textContent = cardClass.getAttribute("data-attr");
            }
            this.cards.push(card);
        }

        shuffleArray(this.lines);

        for (const ligne of this.lines) {
            document.querySelector("body").insertBefore(ligne.dataSource, this.infosDiv);
        }

        for (const letter of Letters) {
            let couples = [];

            for (const card of this.cards) {
                // console.log("card", card);

                if (card.letter == letter) {
                    card.rotate();
                    couples.push(card);
                }
            }
            if (couples.length > 0) {
                this.allCouples.push(couples);

            }
        }

        console.log(this.cards);

        this.flipCards();
        this.refreshNbCouples();
    }

    flipCards() {
        for (const card of this.cards) {
            card.activate(true);
            setTimeout(() => {
                card.activate(false);
                card.disable(false);
            }, 1500);
        }
    }

    refreshNbCouples() {
        this.couplesDiv.textContent = "Nombre de couples restant : " + this.allCouples.length;
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

        // this.cardDiv = cardDiv;
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

    // disable(bool = true) {
    //     this.cardDiv.disabled = bool;
    //     this.cardDiv.style.cursor = bool ? "auto" : "pointer";
    //     if (bool) {
    //         this.cardDiv.removeEventListener(EventNames.CLICK, this.divLigneClickHandler);
    //     } else {
    //         this.cardDiv.addEventListener(EventNames.CLICK, function () {
    //             this.divLigneClickHandler();
    //         }.bind(this));
    //     }
    // }

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const pairGame = new PairGame();
pairGame.init(document);