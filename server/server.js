require('dotenv').config({ path: './config.env' })
const port = process.env.PORT || 5000
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())

// routes
app.use('/account', require('./routes/account'))
app.use('/session', require('./routes/session'))
app.use('/que', require('./routes/que'))
app.use('/match', require('./routes/match'))

// make server
const server = require('http').createServer(app)

// web socket
const io = require('socket.io')(server)

// mongoose conn
const mongoose = require('mongoose')
mongoose.connect(process.env.ATLAS_URI) //async
const connection = mongoose.connection
connection.once('open', () => console.log('connected to mongodb atlas'))

// mongoose models
const User = require('./models/userModel')
const Que = require('./models/queModel')

// web socket conn
io.on('connection', socket => {
  console.log(`user connected via sockets: ${socket.id}`)
  // each time a user connects
  // check the Que, if que contains another user
  // create a new match, and update both users matchId and inMatch
  // send users a prompt to check for user details and update user global state to start match
  socket.emit('hello', {msg:'hey there', somedata: [{one:1},{three:4}]})
})

// server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)

  // create que
  Que.find({}).then(qlist => {
    if (qlist.length === 0) {
      new Que({userList: [], }).save()
    }
  })

})

