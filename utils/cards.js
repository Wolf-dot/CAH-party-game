const fs = require('fs');

let unParsedCahCards = fs.readFileSync('./resources/cah-cards-compact.json', 'utf8');
let cahCards = JSON.parse(unParsedCahCards);

const cardsInRoom = [];

const getWhiteCards = (amount, roomName) => {
    let deck = [];
    const existingCards = cardsInRoom.find( ({room}) => room === roomName);
    
    if(existingCards !== undefined){
        for(let i = 0; i < amount; i++){
            let rnd = getRandomInt(existingCards.cardsWhite.length);
            deck.push(existingCards.cardsWhite[rnd]);
            existingCards.cardsWhite.splice(rnd,1);
        }
    }else{
        const newRoomCards = createRoomCards(roomName);
        for(let i = 0; i < amount; i++){
            let rnd = getRandomInt(newRoomCards.cardsWhite.length);
            deck.push(newRoomCards.cardsWhite[rnd]);
            newRoomCards.cardsWhite.splice(rnd,1);
            cardsInRoom.push(newRoomCards);
        }
    }
    return deck;
}

const getBlackCard = (roomName) => {
    let blackCard;
    const existingCards = cardsInRoom.find( ({room}) => room === roomName);
    
    if(existingCards !== undefined){
        let rnd = getRandomInt(existingCards.cardsBlack.length);
        blackCard = existingCards.cardsBlack[rnd];
        existingCards.cardsBlack.splice(rnd,1);
        return blackCard;
    }else{
        const newRoomCards = createRoomCards(roomName);
        return newRoomCards.chosenBlackCard;
    }
}

function getWhiteChosenCards(roomName){
    const existingCards = cardsInRoom.find( ({room}) => room === roomName);
    if(existingCards !== undefined){
        return existingCards.chosenCards;
    }else{
        const newRoomCards = createRoomCards(roomName);
        return newRoomCards.chosenCards;
    }
}

function getCardData(roomName){
    const existingCards = cardsInRoom.find( ({room}) => room === roomName);
    if(existingCards !== undefined){
        return existingCards;
    }else{
        const newRoomCards = createRoomCards(roomName);
        return newRoomCards;
    }
}

function nextCards(room){
    const existingCards = cardsInRoom.find( cards => cards.room === room);
    existingCards.chosenCards = [];

    let rnd = getRandomInt(existingCards.cardsBlack.length);
    existingCards.chosenBlackCard = existingCards.cardsBlack[rnd];
    existingCards.cardsBlack.splice(rnd,1);

    return existingCards;
}

function addChosenCards(cards, roomName){
    const existingCards = cardsInRoom.find( ({room}) => room === roomName);
    existingCards.chosenCards.push(cards);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function createRoomCards(room){
    const roomCards = {
        cardsWhite: cahCards.white,
        cardsBlack: cahCards.black,
        chosenBlackCard: {text: "", pick: 0}, 
        chosenCards: [],
        room: room
    };
    let rnd = getRandomInt(roomCards.cardsBlack.length);
    roomCards.chosenBlackCard = roomCards.cardsBlack[rnd];
    roomCards.cardsBlack.splice(rnd,1);
    cardsInRoom.push(roomCards);
    return roomCards;
}


module.exports = {
    getWhiteCards,
    getWhiteChosenCards,
    addChosenCards,
    getCardData
}