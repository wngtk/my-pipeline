const { Router } = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");

const testingRouter = Router()

testingRouter.post('/reset', async (req, res) => {
    console.log(new Date(), 'reseting data in db')
    console.log(new Date(), 'blogs deleted, deleting users')
    console.log(new Date(), 'after reset data in db')
    res.status(204).end()
})

module.exports = testingRouter