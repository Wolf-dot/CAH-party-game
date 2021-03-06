const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {addUser, removeUser, getUser, getUsersInRoom, everyoneSubmitted, getCzar, addPoints, nextCzar} = require('./utils/users');
const {getWhiteCards, addChosenCards, getCardData, nextCards} = require('./utils/cards');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

let nameAndRoom = {
    name: String,
    room: String
};

app.post('/logIN', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
    nameAndRoom = {name: req.body.name, room: req.body.room};
});

io.on('connection', (socket) => {
    console.log('New socket connected');

    socket.on('join', (callback) => {
        const {error, user} = addUser({id: socket.id, username: nameAndRoom.name, room: nameAndRoom.room});

        if(error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('yourCards', getWhiteCards(10, user.room));
        io.in(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
            cardData: getCardData(user.room)
        });
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        console.log(`user disconnected`);

        if (user) {
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
                cardData: getCardData(user.room)
            });
        }
    });

    socket.on('sendCards', (cards)=>{
        const user = getUser(socket.id);
        const {chosenBlackCard: {text, pick}} = getCardData(user.room);        
        if(cards.length === pick){
            addChosenCards(cards, user.room);
            socket.emit('cardsSentOK');
            user.submitted = true;
            io.in(user.room).emit('chosenCards', {
                user: user,
                cards: cards
            });
        }else{
            socket.emit("error", `cards sent: ${cards.length}. needed cards: ${pick}`)
        }

        if(everyoneSubmitted(user.room)){
            const cardCzar = getCzar(user.room);
            io.to(cardCzar.id).emit("chooseBest");
        }
    });

    socket.on("winner", (winnerID, bestText) => {
        const room = getUser(socket.id).room;
        const users = getUsersInRoom(room);
        const winner = users.filter( user => user.username === winnerID)[0];
        addPoints(winner);
        users.forEach(user => {
            if(user.submitted){
                io.to(user.id).emit("yourCards", getWhiteCards(1, room));
                user.submitted = false;
            }
        });
        
        io.to(winner.room).emit('winnerInfo', {winnerID, bestText}, users);
    });

    socket.on('nextRound', () => {
        //delete chosen cards and pick a new black card and send to everyones
        const room = getUser(socket.id).room;
        io.to(room).emit('roomData', {
            room: room,
            users: nextCzar(room),
            cardData: nextCards(room)
        });
    })
    




})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})