// Course catalog handlers
const path = require('path')
const fs = require('fs')
// create a multer instance with the storage options
require('dotenv').config()
const { MongoClient } = require('mongodb')
// const { json } = require('stream/consumers')
const ObjectId = require('mongodb').ObjectId
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote

const getCach = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db()
  const allCach = await db.collection('CachVersion').find().toArray()
  return res.json({ cach: allCach, message: 'success' })
}
const getCachById = async (req, res) => {
  const client = await MongoClient.connect(url)
  const db = client.db(dbName)
  const Cach = await db
    .collection('CachVersion')
    .findOne({ _id: req.params.id })
  //client.close()  // TODO- check this close function.
  return res.json(Cach)
}
const postCach = async (req, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )

    let newCourse

    if (req.file !== undefined) {
      const fileName = req.file.filename
      const filePath = req.file.path
      const fileData = fs.readFileSync(filePath, { encoding: 'base64' })

      newCourse = {
        filename: req.file.originalname,
        ...req.body,
        enrolled: 0,
        showOnHomePage: true,
      }
    } else {
      newCourse = {
        ...req.body,
        enrolled: 0,
        showOnHomePage: true,
      }
    }
    const db = client.db()
    const result = await db.collection('courses').insertOne(newCourse)
  } catch (error) {
    console.log('error ', error)
  }
  return res.send('File uploaded successfully!')
}
const putCach = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')

  let updated = null
  if (req.file !== undefined) {
    const fileName = req.file
    const filePath = req.file.path
    const fileData = fs.readFileSync(filePath, { encoding: 'base64' })

    updated = {
      filename: req.file.originalname,
      name: req.body.name,
      subtitle: req.body.subtitle,
      capacity: req.body.capacity,
      status: req.body.status,
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
      endDate: req.body.endDate,
      Description: req.body.Description,
    }
  } else {
    updated = {
      name: req.body.name,
      subtitle: req.body.subtitle,
      capacity: req.body.capacity,
      status: req.body.status,
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
      endDate: req.body.endDate,
      Description: req.body.Description,
    }
  }

  const filter = { _id: new ObjectId(req.params.id) }
  const update = { $set: updated }

  try {
    const result = await db.collection('courses').updateOne(filter, update)

    if (result.modifiedCount === 1) {
      const course = await db.collection('courses').findOne(filter)
      return res.status(200).json({ course })
    } else {
      return res.status(404).json({ message: 'course not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating course' })
  }
}
const deleteCach = async (req, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )

    const db = client.db()
    const result = await db
      .collection('CachVersion')
      .deleteOne({ _id: new ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'cach deleted successfully' })
    } else {
    }
  } catch (error) {
    console.log('error ', error)
    return res
      .status(500)
      .json({ message: 'An error occurred while deleting the cach' })
  }
}

module.exports = {
  getCach,
  getCachById,
  postCach,
  putCach,
  deleteCach,
}
