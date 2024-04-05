require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote

const addEnrollmentToCourse = async (req, res) => {
  const { course, user } = req.body
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')

  try {
    const db = client.db()
    const enrollObject = {
      instructorId: course.instructorId,
      studentId: user._id,
      courseId: course._id,
      courseImage: course.filename,
      studentImage: user.image,
    }

    const isAlreadyEnrolled = await db.collection('enrollment').findOne({
      courseId: enrollObject.courseId,
      studentId: enrollObject.studentId,
    })

    if (isAlreadyEnrolled) {

      return res
        .status(400)
        .json({ message: 'You have already enrolled to this course' })
    }

    const result = await db.collection('enrollment').insertOne(enrollObject)

    const newValue = parseInt(course.enrolled) + 1
    const query = { _id: new ObjectId(course._id) }
    const updateObj = {
      enrolled: newValue,
    }

    const filter = { _id: new ObjectId(req.params.id) }
    const update = { $set: updateObj }

    const result1 = await db.collection('courses').updateOne(query, update)
    if (result1.modifiedCount === 1) {
      return res.status(200).json({ data: result })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// update enrollment for a course
const updateEnrollmentToCourse = async (req, res) => {}

// get all enrollment for a course
const getEnrollmentsByCourseId = async (req, res) => {}

// get all enrollment for a Instructur
const getEnrollmentsByInstructorId = async (req, res) => {}

// get all enrollment for a students
const getEnrollmentsByStudentsId = async (req, res) => {
  const userId = req.params.id
  //   const { course, user } = req.body
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('AppDB')

  try {
    const db = client.db()

    const courses = await db.collection('courses').find().toArray()
    const Enrolled = await db
      .collection('enrollment')
      .find({
        studentId: userId,
      })
      .toArray()

    if (Enrolled) {
      let EnrolledCourese = []
      Enrolled.forEach((e) => {
        const found = courses.find((c) => {
          return e.courseId.toString() === c._id.toString()
        })
        if (found) {
          EnrolledCourese.push(found)
        }
      })


      return res.status(200).json({ data: EnrolledCourese })
    }
  } catch (error) {
    console.log('error', error)
  }
}

const getEnrollmentsByUserId = async (req, res) => {
  try {
    const db = client.db()
    const user = await db.collection('users').findOne({ _id: req.params.id })
    if (!user) throw new Error('User not found')
    res.json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}



module.exports = {
  addEnrollmentToCourse,
  updateEnrollmentToCourse,
  getEnrollmentsByCourseId,
  getEnrollmentsByUserId,
  getEnrollmentsByStudentsId,
}
