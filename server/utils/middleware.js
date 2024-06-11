const { verify } = require("jsonwebtoken")
const { SECRET } = require("./config")
const User = require("../models/user")

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization?.startsWith('Bearer '))
        req.token = authorization.replace('Bearer ', '')

    next()
}

const userExtractor = async (req, res, next) => {
    const decodedToken = verify(req.token, SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'token invalid'
        })
    }

    const user = await User.findById(decodedToken.id)
    req.user = user

    next()
}

module.exports = {
    tokenExtractor,
    userExtractor
}