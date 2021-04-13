const users = [];

const addUser = ({id, username, room}) => {
    username = username.trim().toUpperCase();
    room = room.trim().toUpperCase();

    if(!username || !room){
        return {
            error: "Username and room are required!"
        };
    }
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;    //will return a boolean
    });

    if(existingUser){
        return{
            error: "Username is in use!"
        };
    }

    const user = {
        id,
        username,
        room,
        submitted: false,
        czar: true,
        points: 0
    };

    const isFirstUser = users.filter( player => player.room === room);

    if(isFirstUser.length !== 0){
        user.czar = false;
    }

    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id);
    console.log(users);
    console.log(index);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }else{ return null}
}

const getUser = (id) =>{
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toUpperCase();
    return users.filter((user) => user.room === room);
}

const everyoneSubmitted = (room) => {
    const roomUsers = users.filter( user => user.room === room);
    const submitions = roomUsers.filter( user => user.submitted === true);
    if(submitions.length === roomUsers.length - 1){
        return true;
    }else{
        return false;
    }
}

const getCzar = (room) => {
    const roomUsers = users.filter( user => user.room === room);
    return roomUsers.filter( user => user.czar === true)[0];
}

const addPoints = (user) => {
    user.points++;
    console.log(`${user.username} has now ${user.points} points!`);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    everyoneSubmitted,
    getCzar,
    addPoints
}