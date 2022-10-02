const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './config.env' })
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(require('./routes/record'))

// web socket
const socketIO = require('socket.io')
// get driver connection
const dbo = require('./db/conn')
 
const server = app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err)
  })
  console.log(`Server is running on port: ${port}`)
})

const io = socketIO(server)

// web socket - on connection
io.on('connection', socket => {
  console.log('a user connected')
  socket.on('message', message => {
    console.log(message)
    io.emit('message', `${socket.id.substr(0,2)} said ${message}`)
  })
})