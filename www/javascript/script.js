const Letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const States = {
    GOOD: "✅",
    WRONG: "❌"
}

const Delays = {
    FLIP: 1500
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

        this.lines = [];
        this.cards = [];
        this.allCouples = [];
        this.firstCard;
        this.secondCard;
        this.locked = false;
    }

    /**
     * @description Return the remaining card couples.
     */
    get remainingCouples() {
        return this.allCouples.length;
    }

    init(dataSource) {
        this.initLines(dataSource);
        this.initCards(dataSource);

        let i = 0;
        for (const letter of Letters) {
            let couples = [];
            for (const card of this.cards) {
                if (card.letter == letter) {
                    if (isDebug) {
                        card.buttonDiv.style.border = "solid";
                    }
                    // console.log(card);
                    card.rotate();
                    couples.push(card);
                }
            }
            if (couples.length > 0) {
                this.allCouples.push(couples);
            }

            if (isDebug && i > Letters.length / 8) {
                break;
            }
            i++;
        }

        this.flipCards();

        super.init(dataSource);
    }

    /**
     * @description Init the pair game lines.
     * @param {*} dataSource 
     */
    initLines(dataSource) {
        this.lines.splice(0);
        for (const lineDiv of dataSource.querySelectorAll(".ligne")) {
            const line = new Line(lineDiv);
            this.lines.push(line);
        }
        shuffleArray(this.lines);
        for (const ligne of this.lines) {
            dataSource.querySelector("body").insertBefore(ligne.dataSource, this.infosDiv);
        }
    }

    /**
     * Init the pair game cards.
     * @param {*} dataSource 
     */
    initCards(dataSource) {
        this.cards.splice(0);
        const cardsClass = dataSource.querySelectorAll(".carte");
        for (const cardClass of cardsClass) {
            const card = new Card(cardClass);
            card.addEventListener(CardEventsName.CLICK, function () {
                this.cardClickHandler(card);
            }.bind(this));

            card.letter = card.letter;
            if (debug) {
                card.back.textContent = card.letter;
            }
            this.cards.push(card);
        }
    }

    /**
     * @description Handler when a card is clicked.
     * @param {Card} The clicked card.
     */
    cardClickHandler(card) {
        if (this.locked) {
            return;
        }

        card.activate(true);

        if (!this.firstCard) {
            this.firstCard = card;
            this.firstCard.disable(true);
        } else {
            this.secondCard = card;
            this.secondCard.disable(true);
        }
        if (this.firstCard && this.secondCard) {
            this.checkCouple();
        }
    }

    /**
     * @description Check the cards when 2 cards are clicked.
     */
    checkCouple() {
        this.locked = true;
        console.log("isCardsMatch", this.isCardsMatch());
        if (this.isCardsMatch()) {
            for (const couple of this.allCouples) {
                console.log("couple", couple);
                const first = couple[0];
                if (this.firstCard.letter == first.letter) {
                    this.allCouples.splice(this.allCouples.indexOf(couple), 1);
                    if (this.allCouples.length == 0) {
                        console.log("Partie terminée !");
                        this.increasePoints();
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

    /**
     * @description Flip all the cards.
     */
    flipCards() {
        for (const card of this.cards) {
            card.activate(true);
            setTimeout(() => {
                card.activate(false);
                card.disable(false);
            }, Delays.FLIP);
        }
    }

    /**
     * @description Check if the 2 clicked cards match.
     */
    isCardsMatch() {
        return this.firstCard.letter == this.secondCard.letter;
    }

}

class Line {
    constructor(dataSource) {
        this.dataSource = dataSource;
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

    /**
     * return the letter's card.
     */
    get letter() {
        return this.buttonDiv.getAttribute("data-attr");
    }

    /**
     * set the letter's card.
     */
    set letter(value) {
        this.face.textContent = value;
    }

    /**
     * return the face's div card.
     */
    get face() {
        return this.buttonDiv.querySelector(".face");
    }

    /**
     * return the back's div card.
     */
    get back() {
        return this.buttonDiv.querySelector(".arriere");
    }

    buttonClickHandler() {
        super.buttonClickHandler();

        this.dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }

    /**
     * @description Activate of not the card with the flip.
     * @param {Boolean} flag 
     */
    activate(flag) {
        if (flag) {
            this.buttonDiv.childNodes[1].classList.toggle("active");
        } else {
            this.buttonDiv.childNodes[1].classList.remove("active");
        }
    }

    /**
     * @description Rotate the card.
     */
    rotate() {
        this.face.style.transform = "rotateY(180deg)";
    }
}

function pairGameInitHandler(evt) {
    console.log("pairGameInitHandler", evt.target);
    const infosDiv = document.querySelector("#infos");
    infosDiv.parentNode.appendChild(infosDiv);
    refreshRemainingCouples();
    refreshNbPoints();
}

function pairGameGoodWrongHandler(evt) {
    console.log("pairGameGoodWrongHandler", evt.type);
    const stateDiv = document.querySelector("#state");
    stateDiv.textContent = evt.type == PairGameEventNames.GOOD ? States.GOOD : States.WRONG;
    if (evt.type == PairGameEventNames.GOOD) {
        refreshRemainingCouples();
    }
}

function pairGameFlipHandler(evt) {
    console.log("pairGameFlipHandler", evt.type);
    const stateDiv = document.querySelector("#state");
    stateDiv.textContent = "";
}

function pairGameWinHandler(evt) {
    console.log("pairGameWinHandler", evt.type);
    refreshNbPoints();
    pairGame.init(document);
}

function refreshNbPoints(){
    const nbPointsDiv = document.querySelector("#nbPoints");
    nbPointsDiv.textContent = "Nombre de points : " + pairGame.points;
}

function refreshRemainingCouples() {
    const couplesDiv = document.querySelector("#couples");
    couplesDiv.textContent = "Nombre de couples restant : " + pairGame.remainingCouples;
}

const pairGame = new PairGame();
pairGame.addEventListener(AbstractGameEventNames.INIT, pairGameInitHandler);
pairGame.addEventListener(PairGameEventNames.GOOD, pairGameGoodWrongHandler);
pairGame.addEventListener(PairGameEventNames.WRONG, pairGameGoodWrongHandler);
pairGame.addEventListener(PairGameEventNames.FLIP, pairGameFlipHandler);
pairGame.addEventListener(AbstractGameEventNames.WIN, pairGameWinHandler);
// pairGame.init(document);

const card = document.querySelectorAll(".carte")[2];
card.childNodes[1].classList.toggle("active");