const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { SECRET } = require("../utils/config")

const clearDataInDb = async () => {
    await User.deleteMany({})    
    await Blog.deleteMany({})
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const addUserToDb = async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash
    })
    return await newUser.save()
}

const getUserToken = async (username) => {
    const user = await User.findOne({ username })
    const token = jsonwebtoken.sign({ username: user.username, id: user._id }, SECRET)
    return token
}

module.exports = {
    clearDataInDb,
    usersInDb,
    addUserToDb,
    getUserToken,
}