require('dotenv').config()
const { MongoClient } = require('mongodb')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote

// const { client } = require('./db')
// user management handlers
const getUsers = async (req, res) => {
  // try {
  //   const users = await User.find()
  //   res.json(users)
  // } catch (error) {
  //   res.status(500).json({ message: error.message })
  // }
}
const getUsersById = async (req, res) => {
  try {
    const db = client.db()
    const user = await db.collection('users').findOne({ _id: req.params.id })
    if (!user) throw new Error('User not found')

    res.json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
const getUserByEmail = async (email) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  try {
    await client.connect()

    const user = await db.collection('users').findOne({ email: email })

    return user
  } catch (error) {
    console.log('error', error)
    return { error: error }
  }
}
const createUser = async (user) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  try {
    const db = client.db()
    const result = await db.collection('users').insertOne(user)
    return result.insertedId
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
const putUser = async (req, res) => {
  // try {
  //   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //   })
  //   if (!user) throw new Error('User not found')
  //   res.json(user)
  // } catch (error) {
  //   res.status(404).json({ message: error.message })
  // }
}
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) throw new Error('User not found')
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

module.exports = {
  getUsers,
  getUsersById,
  putUser,
  deleteUser,
  getUserByEmail,
  createUser,
}
