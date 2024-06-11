const bcrypt = require("bcrypt");
const { Router } = require("express");
const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const token = await jsonwebtoken.sign({
        username,
        id: user._id
    }, process.env.SECRET)

    res.json({
        token,
        username,
        name: user.name
    })
})

module.exports = loginRouter
