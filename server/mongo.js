const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

Blog.find({}).then(result => {
    console.log(result)
    mongoose.connection.close()
})
