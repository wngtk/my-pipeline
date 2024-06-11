const { beforeEach, describe, after, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')
const jsonwebtoken = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(r => r.toJSON())
}

let userId
let token
beforeEach(async () => {
    await User.deleteMany({})
    await helper.createRootUser()
    
    const users = await helper.usersInDb()
    userId = users[0].id
    
    const blogsWithUser = initialBlogs.map(b => ({
        user: userId,
        ...b,
    }))
    
    await Blog.deleteMany({})
    const blogs = blogsWithUser.map(blog => new Blog(blog))
    await Blog.insertMany(blogs)

    const getToken = async () => {
        return jsonwebtoken.sign({ username: users[0].username, id: userId }, SECRET)
    }
    token = await getToken()
    console.log(token)
})

test('bloglists are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a specific note can be viewed', async () => {
    const blogs = await blogsInDb()
    const blogToView = blogs[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    blogToView.user = blogToView.user.toString()
    assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
        likes: 4,
        userId: userId
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length + 1)     

    const bloglists = blogListsAtEnd.map(r => r.title)
    assert(bloglists.includes('The Principle of Least Power'))
})

test('blog without likes can be added with default likes 0', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
        userId
    }

    const resultBlog = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)

    assert.strictEqual(resultBlog.body.likes, 0)

})

test('bloglist without title is not added', async () => {
    const newBlog = {
        author: 'Tim Berners-Lee',
        url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400)
    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length)
})

test('bloglist without url is not added', async () => {
    const newBlog = {
        title: 'The Principle of Least Power',
        author: 'Tim Berners-Lee',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400)
    const blogListsAtEnd = await blogsInDb()
    assert.strictEqual(blogListsAtEnd.length, initialBlogs.length)
})

test('update likes for first blog', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 20

    const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
    
    assert.strictEqual(updatedBlog.body.likes, blogToUpdate.likes)
})

after(async () => {
    await mongoose.connection.close()
})
