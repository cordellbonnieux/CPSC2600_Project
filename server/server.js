require('dotenv').config({ path: './config.env' })
const port = process.env.PORT || 5000
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())

app.use(require('./routes/accountRoutes'))

// make server
const server = require('http').createServer(app)

// mongoose conn
const mongoose = require('mongoose')
mongoose.connect(process.env.ATLAS_URI) //async
const connection = mongoose.connection
connection.once('open', () => console.log('connected with mongoose'))

// server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// web socket
// need to come back to this
const io = require('socket.io')(server)
io.on('connection', socket => {
  console.log(`user connected: ${socket.id}`)
})
