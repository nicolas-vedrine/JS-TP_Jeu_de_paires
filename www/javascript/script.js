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

class Line{
    constructor(dataSource){
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

    cardClickHandler(card){
        // console.log("cardClickHandler", this);
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

        console.log("flip", this.firstCard, this.secondCard);
        

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
                        
                        // console.log("dddd", this.allCouples.indexOf(couple));
                        console.log("dddd", this.allCouples.indexOf(couple));

                        this.allCouples.splice(this.allCouples.indexOf(couple), 1);
                        console.log("allCouples.length", this.allCouples.length);
                        if (this.allCouples.length == 0) {
                            console.log("Partie terminée !");
                            // this.init();
                        }
                        break;
                    }
                    // console.log(couple);
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
            // card.addEventListener(CardEventsName.CLICK, this.cardClickHandler);

            card.addEventListener(CardEventsName.CLICK, function() {
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
            for (const line of this.lines) {
                // const cartes = line.querySelectorAll(".carte");

                for (const card of this.cards) {
                    // const face = card.querySelector(".face");
                    // card.rotate();
                    // couples.push(card);

                    // console.log(couples);
                    
                    
                    

                    // if (face) {
                    //     if (!card.className.includes("hidden") && face.textContent.includes(letter)) {
                    //         couples.push(card);
                    //     }
                    // }
                }
            }

            for (const card of this.cards) {
                console.log("card", card);
                
                if(card.letter == letter){
                    card.rotate();
                    couples.push(card);
                }    
            }
            if (couples.length > 0) {
                this.allCouples.push(couples);
                
            }
        }

        console.log(this.cards);
        

        // console.log(this.allCouples);

        this.flipCards();
        this.refreshNbCouples();
    }

    flipCards() {
        for (const card of this.cards) {
            // card.childNodes[1].classList.toggle("active");
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
        const bool = this.firstCard.face.textContent == this.secondCard.face.textContent;
        return bool;
    }

    // toto() {
    //     if (locked) {
    //         return;
    //     }
    //     // this.childNodes[1].classList.toggle("active");

    //     if (!returnedCard) {
    //         returnedCard = true;
    //         firstCard = this;
    //         disableCard(firstCard);
    //     } else {
    //         returnedCard = false;
    //         secondCard = this;
    //     }

    //     if (firstCard && secondCard) {
    //         console.log("isCardsMatch", isCardsMatch());
    //         locked = true;
    //         disableCard(secondCard);
    //         if (isCardsMatch()) {
    //             stateDiv.textContent = States.GOOD;
    //             for (const couple of allCouples) {
    //                 const first = couple[0];
    //                 if (firstCard.getAttribute("data-attr") == first.getAttribute("data-attr")) {
    //                     allCouples.splice(allCouples.indexOf(couple), 1);
    //                     console.log("allCouples.length", allCouples.length);
    //                     if (allCouples.length == 0) {
    //                         console.log("Partie terminée !");
    //                         init();
    //                     }
    //                     break;
    //                 }
    //                 console.log(couple);
    //             }
    //             firstCard = null;
    //             secondCard = null;
    //             locked = false;
    //             refreshNbCouples();
    //         } else {
    //             stateDiv.textContent = States.WRONG;
    //             setTimeout(() => {
    //                 stateDiv.textContent = "";
    //                 returnCard(firstCard);
    //                 returnCard(secondCard);
    //                 disableCard(firstCard, false);
    //                 disableCard(secondCard, false);

    //                 firstCard = null;
    //                 secondCard = null;
    //                 locked = false;
    //             }, 1500);
    //         }
    //     }
    // }


}

const CardEventsName = {
    CLICK: "card_click"
}

class CardEvent extends CustomEvent {
    constructor(type) {
        super(type);
    }
}

class Card extends EventTarget {
    constructor(cardDiv) {
        super();
        
        this.cardDiv = cardDiv;
    }

    get letter(){
        return this.cardDiv.getAttribute("data-attr");
    }

    get face() {
        return this.cardDiv.querySelector(".face");
    }

    get back() {
        return this.cardDiv.querySelector(".arriere");
    }

    disable(bool = true) {
        this.cardDiv.disabled = bool;
        this.cardDiv.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            this.cardDiv.removeEventListener(EventNames.CLICK, this.divLigneClickHandler);

            
        } else {
            // this.cardDiv.addEventListener(EventNames.CLICK, this.divLigneClickHandler);

            this.cardDiv.addEventListener(EventNames.CLICK, function() {
                this.divLigneClickHandler();
            }.bind(this));
        }
    }

    divLigneClickHandler() {
        console.log("divLigneClickHandler");
        
        this.dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }

    activate(flag){
        if(flag){
            this.cardDiv.childNodes[1].classList.toggle("active");
        }else{
            this.cardDiv.childNodes[1].classList.remove("active");    
        }
    }


    // returnCard(card) {
    //     card.childNodes[1].classList.remove("active");
    // }

    rotate(){
        this.face.style.transform = "rotateY(180deg)";
    }
}

// function init() {
//     shuffleArray(aLignes);
//     for (const ligne of aLignes) {
//         document.querySelector("body").insertBefore(ligne, infosDiv);
//     }

//     for (const letter of Letters) {
//         let couples = [];
//         for (const ligne of lines) {
//             const cartes = ligne.querySelectorAll(".carte");
//             for (const carte of cartes) {
//                 const face = carte.querySelector(".face");
//                 face.style.transform = "rotateY(180deg)";
//                 if (face) {
//                     if (!carte.className.includes("hidden") && face.textContent.includes(letter)) {
//                         couples.push(carte);
//                     }
//                 }
//             }
//         }
//         if (couples.length > 0) {
//             allCouples.push(couples);
//         }
//     }
//     console.log(allCouples);

//     returnCards();
//     refreshNbCouples();
// }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// function divLigneClickHandler(evt) {
//     if (locked) {
//         return;
//     }
//     this.childNodes[1].classList.toggle("active");

//     if (!returnedCard) {
//         returnedCard = true;
//         firstCard = this;
//         disableCard(firstCard);
//     } else {
//         returnedCard = false;
//         secondCard = this;
//     }

//     if (firstCard && secondCard) {
//         console.log("isCardsMatch", isCardsMatch());
//         locked = true;
//         disableCard(secondCard);
//         if (isCardsMatch()) {
//             stateDiv.textContent = States.GOOD;
//             for (const couple of allCouples) {
//                 const first = couple[0];
//                 if (firstCard.getAttribute("data-attr") == first.getAttribute("data-attr")) {
//                     allCouples.splice(allCouples.indexOf(couple), 1);
//                     console.log("allCouples.length", allCouples.length);
//                     if (allCouples.length == 0) {
//                         console.log("Partie terminée !");
//                         init();
//                     }
//                     break;
//                 }
//                 console.log(couple);
//             }
//             firstCard = null;
//             secondCard = null;
//             locked = false;
//             refreshNbCouples();
//         } else {
//             stateDiv.textContent = States.WRONG;
//             setTimeout(() => {
//                 stateDiv.textContent = "";
//                 returnCard(firstCard);
//                 returnCard(secondCard);
//                 disableCard(firstCard, false);
//                 disableCard(secondCard, false);

//                 firstCard = null;
//                 secondCard = null;
//                 locked = false;
//             }, 1500);
//         }
//     }
// }

// let allCouples = [];
// let firstCard;
// let secondCard;
// let returnedCard = false;
// let locked = false;
// const infosDiv = document.querySelector("#infos");
// const stateDiv = document.querySelector("#state");
// const couplesDiv = document.querySelector("#couples");
// const lines = document.querySelectorAll(".ligne");



// //let aLignes = [];
// // for (const line of lines) {
// //     aLignes.push(line);
// // }

// init();
const pairGame = new PairGame();
pairGame.init(document);