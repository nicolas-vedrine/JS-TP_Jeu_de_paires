class MyEventTarget extends EventTarget {
    constructor(mySecret) {
        super();
        this._secret = mySecret;
    }

    get secret() { return this._secret; }
};

class MyEvent extends CustomEvent {
    constructor(type){
        super(type);
    }
}

function handler(evt){
    const myEventTarget = evt.target;
    myEventTarget._secret = evt.detail;
    console.log(myEventTarget.secret);
    
}

let myEventTarget = new MyEventTarget(5);
let value = myEventTarget.secret;  // == 5
myEventTarget.addEventListener("foo", handler);


let event = new CustomEvent("foo", { detail: 7 });
myEventTarget.dispatchEvent(event);



class PairGame {
    constructor() {

        this.cards = [];

        let i = 0;
        while (i < 10) {
            const card = new Card();
            card.addEventListener(CardEventsName.CLICK, this.cardClickHandler);
            this.cards.push(card);
            i++;
        }

        const card = this.cards[0];
        card.dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }

    cardClickHandler(evt){
        console.log(evt);
        
    }

    init(dataSource) {
        
    }

    flipCards() {
        for (const card of this.cards) {
            // console.log(card);
            
            card.dispatchEvent(new CardEvent(CardEventsName.CLICK));
        }
    }


}

const CardEventsName = {
    CLICK: "card_click"
}

class CardEvent extends Event {
    constructor(type) {
        super(type);
    }
}

class Card extends EventTarget {
    constructor() {
        super();
    }

    test(){
        console.log("test");
        
        dispatchEvent(new CardEvent(CardEventsName.CLICK));
    }
}

const pairGame = new PairGame();