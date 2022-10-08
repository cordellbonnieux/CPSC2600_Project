// enviroment vars
require('dotenv').config({ path: './config.env' })
const port = process.env.PORT || 5000

// packages
const express = require('express')
const app = express()
const cors = require('cors')

// app & get driver connection
app.use(cors())
app.use(express.json())
app.use(require('./routes/record'))
const dbo = require('./db/conn')

// make server & socket conn
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// listen for reqs
server.listen(port, () => {
  // db atlas reqs
  dbo.connectToServer(function(err) {
    if (err) console.log(err)
  })
  console.log(`Server is running on port ${port}`)
})

// web socket, on connection
io.on('connection', socket => {
  console.log(`user connected: ${socket.id}`)
})
