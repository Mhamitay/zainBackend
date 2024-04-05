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
const getInstructors = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  try {
    const query = { role: 'instructor' }
    const instructors = await db.collection('users').find(query).toArray()
    return res.json({ data: instructors, message: 'success' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error getting instructors' })
  }
}
const postInstructor = async (req, res) => {
  try {
    const newInstructor = await db.collection('instructors').insertOne(req.body)
    res.status(201).json(newInstructor.ops[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error creating instructor' })
  }
}
const getInstructorById = async (req, res) => {
  try {
    const instructor = await db
      .collection('instructors')
      .findOne({ _id: ObjectId(req.params.id) })

    if (instructor) {
      res.json(instructor)
    } else {
      res.status(404).json({ message: 'Instructor not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error getting instructor' })
  }
}
const putInstructor = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')

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
const deleteInstructor = async (req, res) => {
  try {
    const result = await db
      .collection('instructors')
      .deleteOne({ _id: ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      res.json({ message: 'Instructor deleted' })
    } else {
      res.status(404).json({ message: 'Instructor not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting instructor' })
  }
}

module.exports = {
  getInstructors,
  postInstructor,
  getInstructorById,
  putInstructor,
  deleteInstructor,
}
