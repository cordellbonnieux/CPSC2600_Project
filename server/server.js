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

// mongoose conn
const mongoose = require('mongoose')
mongoose.connect(process.env.ATLAS_URI) //async
const connection = mongoose.connection
connection.once('open', () => console.log('connected to mongodb atlas'))

// mongoose models
const User = require('./models/userModel')
const Que = require('./models/queModel')

// web socket
const io = require('socket.io')(server)
const matchmaking = require('./emits/matchmaking')
const match = require('./emits/match')

// web socket conn
io.on('connection', socket => {
  matchmaking(socket, io)
  socket.on('matchmaking', () => matchmaking(socket, io))
  socket.on('match', id => match(socket, io, id))
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

