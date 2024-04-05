const jwt = require('jsonwebtoken')
// const { client } = require('./db');

async function authMiddleware(req, res, next) {


  try {
    if (req.header('Authorization') === undefined)
      return res.status(401).send('Please authenticate.')

    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await getUserById(decoded._id)

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).send('Please authenticate.' + error)
  }
}

module.exports = {authMiddleware}
