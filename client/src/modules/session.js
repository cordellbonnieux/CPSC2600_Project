import axios from 'axios'
const server = 'https://localhost:5000'

// this wont work

async function createSession(user) {
    axios
    .post(server+'routes/session/create',{user:user})
    .then(res => {
        console.log(res)
    })
}