const { describe, beforeEach, test, after } = require("node:test");
const Blog = require("../models/blog");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const helper = require("./test_helper");
const User = require("../models/user");

const bcrypt = require("bcrypt")

const api = supertest(app)

describe('when there is no blogs in db', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const users = helper.users.map(u => {
            const returnObj = {...u}
            returnObj.passwordHash = bcrypt.hashSync(u.password, 10)
            delete returnObj.password
            return returnObj
        })
        await User.insertMany(users)
    })

    test('delete fails with proper status and message if blog id is not exists', async () => {
        await api
            .delete('/api/blogs/6641e0d649302cd37949ff0c')
            .expect(401)
    })

    test('creation succeeds with a valid blog', async () => {
        const userId = await helper.rootId()
        const newBlog = {
            title: 'The Principle of Least Power',
            author: 'Tim Berners-Lee',
            url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
            userId: userId
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + await helper.rootToken())
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })

    test('delete fails if not delete by own user', async () => {
        const newBlog = {
            title: 'The Principle of Least Power',
            author: 'Tim Berners-Lee',
            url: 'https://blog.codinghorror.com/the-principle-of-least-power/',
            likes: 20
        }
        const insertedBlog = await helper.insertBlog(newBlog, 'root')
        const token = await helper.userToken(helper.hellas.username)

        const blog = insertedBlog.toJSON()

        await api
            .delete(`/api/blogs/${blog.id}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(401)
    })
})

after(async () => {
    mongoose.connection.close()
})
