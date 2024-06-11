const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const { error } = require('../utils/logger')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const user = request.user
  const body = request.body
  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes ? body.likes : 0,
    user: user.id
  })

  if (!user) {
    return response.status(400).json({ error: `${body.userId} is not exists`})
  }

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat([savedBlog.id])
    await user.save()
    console.log(new Date(), 'after save a new blog', savedBlog, user.toJSON())
    const returnBlog = await savedBlog.populate('user', { username: 1 })
    response.status(201).json(returnBlog)
  } catch (err) {
    if (err.name === "ValidationError")
      return response.status(400).json({ error: error.message })
    next(err)
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const blogToDelete = await Blog.findById(req.params.id)

  if (blogToDelete && user._id.toString() !== blogToDelete.user?._id.toString()) {
    return res.status(401).json({
      error: 'this blog is no yours'
    })
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const blog = {
    likes: body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.json(updatedBlog)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = blogsRouter
