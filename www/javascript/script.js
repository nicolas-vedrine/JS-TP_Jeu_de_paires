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

class PairGame extends AbstractGame {
    constructor() {
        super();
        
        this.aLignes = [];
        this.aCards = [];
        this.allCouples = [];
        this.firstCard;
        this.secondCard;
        this.locked = false;
        this.returnedCard = false;
    }

    init(dataSource) {
        super.init(dataSource);

        const cardsClass = document.querySelectorAll(".carte");
        
        for (const cardClass of cardsClass) {
            const card = new Card(cardClass);
            card.face.textContent = cardClass.getAttribute("data-attr");
            if (debug) {
                card.back.textContent = cardClass.getAttribute("data-attr");
            }
        }

        return;

        shuffleArray(aLignes);
        for (const ligne of aLignes) {
            document.querySelector("body").insertBefore(ligne, infosDiv);
        }

        for (const letter of Letters) {
            let couples = [];
            for (const ligne of lines) {
                const cartes = ligne.querySelectorAll(".carte");
                for (const carte of cartes) {
                    const face = carte.querySelector(".face");
                    face.style.transform = "rotateY(180deg)";
                    if (face) {
                        if (!carte.className.includes("hidden") && face.textContent.includes(letter)) {
                            couples.push(carte);
                        }
                    }
                }
            }
            if (couples.length > 0) {
                allCouples.push(couples);
            }
        }
        console.log(allCouples);

        returnCards();
        refreshNbCouples();
    }

    returnCards() {
        for (const card of cards) {
            card.childNodes[1].classList.toggle("active");
            setTimeout(() => {
                returnCard(card);
                disableCard(card, false);
            }, 1500);
        }
    }

    refreshNbCouples() {
        couplesDiv.textContent = "Nombre de couples restant : " + allCouples.length;
    }

    isCardsMatch() {
        console.log(getFace(firstCard).textContent, getFace(secondCard).textContent);

        return (getFace(firstCard).textContent == getFace(secondCard).textContent)
    }

    divLigneClickHandler(evt) {
        if (locked) {
            return;
        }
        this.childNodes[1].classList.toggle("active");

        if (!returnedCard) {
            returnedCard = true;
            firstCard = this;
            disableCard(firstCard);
        } else {
            returnedCard = false;
            secondCard = this;
        }

        if (firstCard && secondCard) {
            console.log("isCardsMatch", isCardsMatch());
            locked = true;
            disableCard(secondCard);
            if (isCardsMatch()) {
                stateDiv.textContent = States.GOOD;
                for (const couple of allCouples) {
                    const first = couple[0];
                    if (firstCard.getAttribute("data-attr") == first.getAttribute("data-attr")) {
                        allCouples.splice(allCouples.indexOf(couple), 1);
                        console.log("allCouples.length", allCouples.length);
                        if (allCouples.length == 0) {
                            console.log("Partie terminée !");
                            init();
                        }
                        break;
                    }
                    console.log(couple);
                }
                firstCard = null;
                secondCard = null;
                locked = false;
                refreshNbCouples();
            } else {
                stateDiv.textContent = States.WRONG;
                setTimeout(() => {
                    stateDiv.textContent = "";
                    returnCard(firstCard);
                    returnCard(secondCard);
                    disableCard(firstCard, false);
                    disableCard(secondCard, false);

                    firstCard = null;
                    secondCard = null;
                    locked = false;
                }, 1500);
            }
        }
    }


}

const CardEventsName = {
    CLICK: "click"
}

class CardEvent extends Event {
    constructor() {

    }
}

class Card {
    constructor(cardDiv) {
        this.cardDiv = cardDiv;
    }

    get face() {
        return this.cardDiv.querySelector(".face");
    }

    get back() {
        return this.cardDiv.querySelector(".arriere");
    }

    disableCard(button, bool = true) {
        button.disabled = bool;
        button.style.cursor = bool ? "auto" : "pointer";
        if (bool) {
            button.removeEventListener(EventNames.CLICK, divLigneClickHandler);
        } else {
            button.addEventListener(EventNames.CLICK, divLigneClickHandler);
        }
    }

    divLigneClickHandler() {
        dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }


    returnCard(card) {
        card.childNodes[1].classList.remove("active");
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
const infosDiv = document.querySelector("#infos");
const stateDiv = document.querySelector("#state");
const couplesDiv = document.querySelector("#couples");
const lines = document.querySelectorAll(".ligne");



//let aLignes = [];
// for (const line of lines) {
//     aLignes.push(line);
// }

// init();
const pairGame = new PairGame();
pairGame.init(document);