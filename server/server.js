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
//app.use(require('./routes/record'))
app.use(require('./routes/accountRoutes'))
const dbo = require('./db/conn')

// make server & socket conn
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// mongoose conn
const { connectViaMongoose } = require('./db/mongoose')

// listen for reqs
// main server func
server.listen(port, () => {

  // mongoose connection
  connectViaMongoose()

  // mongodb connection
  dbo.connectToServer(function(err) {
    if (err) console.log(err)
  })

  console.log(`Server is running on port ${port}`)
})

// web socket, on connection
// need to come back to this
io.on('connection', socket => {
  console.log(`user connected: ${socket.id}`)
})
