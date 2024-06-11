const { describe, after, beforeEach, test } = require("node:test");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");
const assert = require("assert");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await helper.createRootUser();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "hellas",
      name: "Arto Hellas",
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  });

  test("creation fails with proper status and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()
    const existsUser = usersAtStart[0]
    
    const result = await api
      .post('/api/users')
      .send({
        username: existsUser.username,
        password: '123456',
        name: 'testName'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails with proper status and message if password is invalid", async () => {
    const usersAtStart = await helper.usersInDb()
    const existsUser = usersAtStart[0]
    
    const result = await api
      .post('/api/users')
      .send({
        username: existsUser.username,
        password: '12',
        name: 'testName'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
});

after(async () => {
  await mongoose.connection.close();
});
