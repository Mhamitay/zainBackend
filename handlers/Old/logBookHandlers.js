require('dotenv').config()
const { MongoClient } = require('mongodb')
// const { json } = require('stream/consumers')
const ObjectId = require('mongodb').ObjectId
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
// Diving logbook catalog handlers
const getDivingLog = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  const logs = await db.collection('logBook').find().toArray()

  return res.json({ logs: logs, message: 'success' })
}
const getDivingLogById = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  console.log('req.params.id', req.params.id)
  const logs = await db
    .collection('logBook')
    .find({ userId: req.params.id })
    .toArray()

  return res.json({ logs: logs, message: 'success' })
  // client.close()
}
const postDivingLog = async (req, res) => {
  try {
    const client = new MongoClient(
      process.env.CONNECTION_STRING_Remote,
      options
    )
    const db = client.db('AppDB')
    console.log('bodey', req.body)

    const logObject = {
      userId: req.body.userId,
      date: req.body.date,
      country: req.body.country,
      city: req.body.city,
      location: req.body.location,
      depth: req.body.depth,
      duration: req.body.duration,
    }

    const result = await db.collection('logBook').insertOne(logObject)
    if (result.acknowledged) {
      res.status(200).json({ message: 'success' })
    }
  } catch (error) {
    console.log('error ', error)
  }
}
const putDivingLog = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  console.log('bodey put', req.body)
  console.log('req.params.id', req.params.id)

  const updated = {
    date: req.body.date,
    country: req.body.country,
    city: req.body.city,
    location: req.body.location,
    depth: req.body.depth,
    duration: req.body.duration,
  }

  const filter = { _id: new ObjectId(req.params.id) }
  const update = { $set: updated }

  try {
    const result = await db.collection('logBook').updateOne(filter, update)

    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'seccuess' })
    } else {
      return res.status(404).json({ message: 'log was not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating log' })
  }
}
const deleteDivingLog = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')
  console.log('req.params.id', req.params.id)
  try {
    // const filter = { _id: new ObjectId(req.params.id) }
    const result = await db
      .collection('logBook')
      .deleteOne({ _id: new ObjectId(req.params.id) })

    if (result.deletedCount === 1) {
      console.log('log deleted successfully')
      return res.status(200).json({ message: 'log deleted successfully' })
    } else {
      return res
        .status(400)
        .json({ message: 'log was not deleted successfully' })
    }
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  getDivingLog,
  getDivingLogById,
  postDivingLog,
  putDivingLog,
  deleteDivingLog,
}
