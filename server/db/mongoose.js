const mongoose = require('mongoose')
const atlas = process.env.ATLAS_URI
const User = require('../models/userModel')

// connect to mongo db atlas via mongoose
const connectViaMongoose = () => mongoose.connect(atlas)
// on connect
mongoose.connection.once('open', () => {
    console.log('DB connected.')
})

// func to create a new user
async function createUser(username, email, password) {
    return new User({
        username,
        email,
        password,
        created: Date.now()
    }).save().then(() => {
        console.log('user:',username,'created.')
    })
}
// func to find a user
async function findUser(username) {
    return await User.findOne({username})
}

module.exports = { connectViaMongoose, createUser, findUser}