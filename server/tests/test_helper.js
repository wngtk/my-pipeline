const { hash } = require("bcrypt")
const User = require("../models/user")
const jsonwebtoken = require("jsonwebtoken")
const { SECRET } = require("../utils/config")
const Blog = require("../models/blog")

const rootUser = {
    "username": "root",
    "name": "root",
    "password": "123456"
}

const hellas = {
    username: "hellas",
    name: "Arto Hellas",
    password: "123456",
}

const users = [
    rootUser,
    hellas
]

const addUser = async (newUser) => {
    const passwordHash = await hash(newUser.password, 10)
    const user = new User({
        username: newUser.username,
        passwordHash,
        name: newUser.name
    })
    return await user.save()
}

const createRootUser = async () => {
    const passwordHash = await hash(rootUser.password, 10)
    const user = new User({username: rootUser.username, name: rootUser.name, passwordHash})
    await user.save(user)
}

const usersInDb = async () => {
    const users = await User.find({})    
    return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const rootId = async () => {
    const root = await User.findOne({ username: rootUser.username })
    return root.id
}

const rootToken = async () => {
    const id = await rootId()
    const rootUserForToken = {
        id,
        username: rootUser.username
    }
    const token = jsonwebtoken.sign(rootUserForToken, SECRET)
    return token
}

const userToken = async (username) => {
    const userInDb = await User.findOne({ username })
    const { id } = userInDb.toJSON()
    return jsonwebtoken.sign({
        username,
        id
    }, SECRET)
}

const getUserId = async (username) => {
    const user = await User.findOne({ username })
    return user?.id
}

const insertBlog = async (blog, username) => {
    blog.userId = await getUserId(username)
    return await new Blog(blog).save()
}


module.exports = {
    createRootUser,
    usersInDb,
    rootId,
    addUser,
    rootToken,
    hellas,
    users,
    userToken,
    blogsInDb,
    insertBlog
}
