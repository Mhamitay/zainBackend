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

const getStudentForCourse = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  try {
    const db = client.db()

    const enrollment = await db
      .collection('enrollment')
      .find({ courseId: req.params.id })
      .toArray()

    const users = await db
      .collection('users')
      .find()
      .toArray()

      const students = []
      enrollment.forEach((e)=>{
       const foundUser =  users.find((u)=> u._id.toString()===e.studentId)
         if(foundUser){
          const student ={
            studentImage:foundUser.image
          }
            students.push(student)
         }
         
      })

 console.log('students', students)
    return res.json({ students })
  } catch (error) {
    return req.json({ error: true, message: error })
  }
}
const getCoursesByInstructor = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  try {
    const db = client.db()

    const courses = await db
      .collection('courses')
      .find({ instructorId: req.params.instructorId })
      .toArray()
    return res.json({ courses })
  } catch (error) {
    return req.json({ error: true, message: error })
  }
}
const getCourses = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)

  const db = client.db()
  const courses = await db.collection('courses').find().toArray()
  const users = await db.collection('users').find().toArray()

  const joined = courses.map((course) => {
    const user = users.find((user) => String(user._id) === course.instructorId)
    return (result = {
      ...course,
      user: {
        role: user.role,
        image: user.image,
        name: user.name,
        rate: user.rate,
      },
    })
  })
  return res.json({ courses: joined, message: 'success' })
}
const getCourseById = async (req, res) => {
  return res.json('getCourseById')
  const client = await MongoClient.connect(url)
  const db = client.db(dbName)
  const course = await db.collection('courses').findOne({ _id: req.params.id })
  res.json(course)
  client.close()
}
const postCourses = async (req, res) => {
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
const putCourses = async (req, res) => {
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
const deleteCourses = async (req, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )

    const db = client.db()
    const result = await db
      .collection('courses')
      .deleteOne({ _id: new ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Course deleted successfully' })
    } else {
    }
  } catch (error) {
    console.log('error ', error)
    return res
      .status(500)
      .json({ message: 'An error occurred while deleting the course' })
  }
}

module.exports = {
  getCourses,
  getCourseById,
  postCourses,
  putCourses,
  deleteCourses,
  getCoursesByInstructor,
  getStudentForCourse
}