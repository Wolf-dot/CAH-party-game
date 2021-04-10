const socket = io();

let myChosenCards = [];
let winningCard = null;

socket.emit("join", (error) => {
    if (error){
        alert(error);
        location.href = '/';    //navigates back to login page -> index.html
    }
});

socket.on('yourCards', (cards)=>{
    console.log(cards);
    for(let i = 0; i<cards.length; i++){
        let button = document.createElement('button');
        button.style.backgroundColor = 'rgb(47, 98, 135)';
        button.addEventListener('click', function() {
            console.log(this.style.backgroundColor);
            if(this.style.backgroundColor == "rgb(47, 98, 135)"){
                this.style.backgroundColor = 'rgb(9, 121, 130)';
                myChosenCards.push(this);
                console.log(myChosenCards);
            }else{
                this.style.backgroundColor = "rgb(47, 98, 135)";
                myChosenCards.splice(myChosenCards.indexOf(this), 1);
                console.log(myChosenCards);
            }  
        });
        button.className = "w3-button card";
        button.id = i;
        button.textContent = cards[i];
        document.getElementById('mycards').appendChild(button);        
    }
});

socket.on('roomData', ({room, users, cardData: {chosenBlackCard: {text, pick}, chosenCards}, isCzar}) => {
    // show room name, current card czar (gotta add it), and the black card
    document.getElementById('blackCard').innerText = text + '\n' + pick;    

    document.getElementById('roomName').innerText = room;
    let nameList = document.getElementById('nameList');

    while(nameList.hasChildNodes()){nameList.removeChild(nameList.firstChild)}
    users.forEach(user => {
        let name = document.createElement('p');
        let points = document.createElement('p');

        name.innerText = user.username.toLowerCase();
        points.innerText = user.points;
        document.getElementById('nameList').appendChild(name);
    });

    if(chosenCards !== []){
        chosenCards.forEach(card => {
            let button = document.createElement('button');
            button.style.backgroundColor = 'rgb(47, 98, 135)';
            button.className = "w3-button card";
            button.textContent = card;
            button.addEventListener('click', function() {
                console.log(this.style.backgroundColor);
                if(this.style.backgroundColor == "rgb(47, 98, 135)"){
                    this.style.backgroundColor = 'rgb(9, 121, 130)';
                    winningCard = this;
                    console.log(winningCard);
                }else{
                    this.style.backgroundColor = "rgb(47, 98, 135)";
                    winningCard = null;
                    console.log(winningCard);
                }  
            });
            document.getElementById('othercards').appendChild(button);
        });
    }

    const me = users.filter( user => user.id === socket.id)[0];
    if(me.czar){
        document.getElementById('confirm').disabled = true;
    }
    const currentCzar = users.filter( user => user.czar === true)[0];
    document.getElementById('czar').innerText = currentCzar.username + " is Czar!";
});

socket.on('chosenCards', ({user, cards}) => {
    let button = document.createElement('button');
    button.style.backgroundColor = 'rgb(47, 98, 135)';
    button.addEventListener('click', function() {
        console.log(this.style.backgroundColor);
        if(this.style.backgroundColor == "rgb(47, 98, 135)"){
            this.style.backgroundColor = 'rgb(9, 121, 130)';
            winningCard = this;
            console.log(winningCard);
        }else{
            this.style.backgroundColor = "rgb(47, 98, 135)";
            winningCard = null;
            console.log(winningCard);
        }  
    });
    button.className = "w3-button card";
    button.id = user.username;
    button.textContent += cards;
    
    document.getElementById('othercards').appendChild(button);
});

socket.on("error", (err) => alert(err));

socket.on("cardsSentOK", () => {
    //delete from hand
    for(let child of myChosenCards){document.getElementById('mycards').removeChild(child)}
    myChosenCards = [];
    document.getElementById('confirm').disabled = true;
});

socket.on("chooseBest", () => {
    console.log("choose the best card!");
    document.getElementById('winner').disabled = false; 
});

socket.on("winnerInfo", ({winnerID, bestText}, users) => {
    document.getElementById('pick').innerText = bestText + '\n' + "-" + winnerID;
    let nameList = document.getElementById('nameList');
    while(nameList.hasChildNodes()){nameList.removeChild(nameList.firstChild)}
    users.forEach(user => {
        let name = document.createElement('p');
        name.innerText = user.username.toLowerCase() + " " + user.points;
        document.getElementById('nameList').appendChild(name);
    });
});

function confirmCards(){
    if(myChosenCards.length !== 0){
        let cards = [];
        for(let i = 0; i < myChosenCards.length; i++){
            cards.push(myChosenCards[i].textContent);
            console.log(cards);
        }
        socket.emit('sendCards', cards);
    }else{alert('choose some cards')}
}

function appendChosenCards(user, cards){
    let button = document.createElement('button');
    button.style.backgroundColor = 'rgb(47, 98, 135)';
    button.addEventListener('click', function() {
        console.log(this.style.backgroundColor);
        if(this.style.backgroundColor == "rgb(47, 98, 135)"){
            this.style.backgroundColor = 'rgb(9, 121, 130)';
            winningCard = this;
            console.log(winningCard);
        }else{
            this.style.backgroundColor = "rgb(47, 98, 135)";
            winningCard = null;
        }  
    });
    button.className = "w3-button card";
    button.id = user.username;
    for (const card of cards) {
        button.textContent += card + '\n';
    }
    document.getElementById('othercards').appendChild(button);
}

function choseTheWinner(){
    if(winningCard !== null){
        document.getElementById('winner').disabled = true;
        socket.emit("winner", winningCard.id, winningCard.textContent);
        // reset the game after clicking OK, next card czar
    }else{
        alert("choose a winner!");
    }
}