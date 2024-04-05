require('dotenv').config()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const path = require('path')
const fs = require('fs')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote


// Instructor management handlers
const getCategories = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')

  try {
    const query = { role: 'Category' }
    const categories = await db.collection('Categories').find().toArray()
    // const categories = await db.collection('Categories').find(query).toArray()
    return res.json({ data: categories, message: 'success' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error getting Categories' })
  }
}
const postCategory = async (req, res) => {
  try {
    const newCategory = await db.collection('Categories').insertOne(req.body)
    res.status(201).json(newCategory.ops[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error creating newCategory' })
  }
}
const getCategoryById = async (req, res) => {
  try {
    const category = await db
      .collection('Categories')
      .findOne({ _id: ObjectId(req.params.id) })

    if (category) {
      res.json(category)
    } else {
      res.status(404).json({ message: 'category not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error getting category' })
  }
}
const putCategory = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')

  let updated = null
  if (req.file !== undefined) {
    const fileName = req.file
    const filePath = req.file.path
    const fileData = fs.readFileSync(filePath, { encoding: 'base64' })

    updated = {
      image: req.file.originalname,
      bio: req.body.bio,
    }
  } else {
    updated = {
      bio: req.body.bio,
    }
  }

  const filter = { _id: new ObjectId(req.params.id) }

  const update = { $set: updated }

  try {
    const result = await db.collection('users').updateOne(filter, update)

    if (result.modifiedCount === 1) {
      const user = await db.collection('users').findOne(filter)
      return res.status(200).json({ user })
    } else {
      return res.status(404).json({ message: 'Instructor not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating instructor' })
  }
}
const deleteCategory = async (req, res) => {
  try {
    const result = await db
      .collection('Categories')
      .deleteOne({ _id: ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      res.json({ message: 'Category deleted' })
    } else {
      res.status(404).json({ message: 'Category not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting Category' })
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  postCategory,
  putCategory,
  deleteCategory,
}
