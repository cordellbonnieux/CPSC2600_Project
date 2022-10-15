const User = require('../models/userModel')

async function createUser(username, email, password) {
    try {
        return new User({
            username,
            email,
            password,
            created: Date.now()
        }).save().then(() => {
            console.log('user:',username,'created.')
        })
    } catch (e) {
        console.log('createUser error:', e.message)
    }
}

module.exports = { createUser }