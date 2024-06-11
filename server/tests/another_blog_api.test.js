const { default: mongoose } = require("mongoose");
const { describe, after, beforeEach, test} = require("node:test");
const { clearDataInDb, usersInDb, addUserToDb, getUserToken } = require("./another_helper");
const supertest = require("supertest");
const assert = require("assert");

const app = require('../app')

const api = supertest(app)

const root = {
  username: "root",
  name: "root",
  password: "123456",
};

describe('blog api', () => {
    beforeEach(async () => {
        await clearDataInDb()
    })

    describe('when there is no users in db', () => {
        test('create a root user', async () => {
            const response = await api
                .post('/api/users')
                .send(root)
                .expect(201)
            
            assert.strictEqual(response.body.username, 'root')
            const users = await usersInDb()
            assert.strictEqual(users.length, 1)
        })
    })

    describe('when there is initially a root user in db', () => {
        beforeEach(async () => {
            await addUserToDb(root)
        })

        test('log in succeeds with root', async () => {
            await api
                .post('/api/login')
                .send({ username: root.username, password: root.password })
                .expect(200)
        })

        test('a valid blog can be added', async () => {
            const token = await getUserToken(root.username)
            const result = await api
                .post('/api/blogs')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    title: 'Test blog title',
                    author: 'author name',
                    url: 'no url',
                    likes: 0
                })
                .expect(201)
            
            assert(result.body.title === 'Test blog title')
        })
    })
})

describe('after reset', () => {
    beforeEach(async () => {
        await api
            .post('/api/testing/reset')
    })

    test('there is no blogs', async () => {
        const result = await api
            .get('/api/blogs')
            .expect(200)
        assert.strictEqual(result.body.length, 0)
    })
})

after(async () => {
    await mongoose.connection.close()
})