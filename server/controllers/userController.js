const userModel = require('../models/userModel')

// login
const userLogin = async (req, res) => {
    res.json({msg: 'user login'})
}

// create account
const createAccount = async (req, res) => {
    res.json({msg: 'create account'})
}

module.exports = { userLogin, createAccount }