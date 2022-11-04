const Que = require('../models/queModel')
const uri = 'localhost:5000/'

async function connection(socket) {
    let user1, user2
    // check que for users
    Que.findOne().then(que => {
        if (que.userList.length > 1) {
            let matchId
            user1 = que.userList[0]
            user2 = que.userList[1]
            // remove users from que
            async () => await axios.delete(uri + '/que/' + user1)
                .then(() => console.log(user1 + ' removed from que'))
            async () => await axios.delete(uri + '/que/' + user2)
                .then(() => console.log(user1 + ' removed from que'))
            
            // create a new match with users
            async () => axios.post(uri + '/match/' + create, {user1, user2})
                .then(res => matchId = res.data[0])

            // send the matchId to users
            socket.emit(user1, {matchFound: true, matchId})
            socket.emit(user2, {matchFound: true, matchId})
        }
    })
}

module.exports = connection