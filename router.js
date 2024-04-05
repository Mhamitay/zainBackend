const router = require('express').Router()

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

const { authLogIn, registereUser } = require('./handlers/Auth/authHandler')
const { authMiddleware } = require('./handlers/Auth/authMiddleware')

//- Categories.
//- Products.
//- MostOrderd.
//- Cart.
//- PreviousOrders.
//- Favorits.
//- Purchase.
///////////////////////////////////////////////
// const {
//   addEnrollmentToCourse,
//   getEnrollmentsByStudentsId,
// } = require('./handlers/Favorits')


// const {
//   getDivingLog,
//   getDivingLogById,
//   postDivingLog,
//   putDivingLog,
//   deleteDivingLog,
// } = require('./handlers/MostOrderd')

// const {
//   getInstructors,
//   postInstructor,
//   getInstructorById,
//   putInstructor,
// } = require('./handlers/Cart')

// const { getUsers, getUsersById } = require('./handlers/Users')
// const { getEnvironmentData } = require('worker_threads')

// const {
//   getCourses,
//   getCourseById,
//   postCourses,
//   putCourses,
//   deleteCourses,
//   getCoursesByInstructor,
//   getStudentForCourse,
// } = require('./handlers/Users')
////////////////////////////////////////////////////////////////////

//GET/LIST
//GET
//PUT
//POST
//DETELE

//#region EndPoints ..

// Course categories endpoints
//------------------------------------
router.get('/api/categories', getCategories)
router.get('/api/category/:id', getCategoryById)
router.post('/api/categorY', postCategory)
router.put('/api/category/:id', putCategory)
router.delete('/api/categories/:id', deleteCategory)
//router.post('/category', upload.single('file'), postCategory)
//router.patch('/api/courses/:id', upload.single('file'), putcategory)

// user management endpoints
//------------------------------------
router.get('/api/users', getUsers)
router.get('/api/users/:id', getUsersById)
// router.put('/api/users/:id', putUser)  - Not used. for After the course
// router.delete('/api/users/:id', deleteUser) - Not used. for After the course

//#endregion



//#region  jwt login & Auth
//------------------------------------
router.post('/api/auth/login', authLogIn)
router.post('/api/auth/register', registereUser)

    //#region Protected routs
    router.get('/api/students', authMiddleware, (req, res) => {
      if (req.user.role !== 'student') {
        return res.status(403).send('Forbidden.')
      }

      // Return student data
      res.status(200).json({ name: 'John Doe', roll: '123456' })
    })

    router.get('/api/instructors', authMiddleware, (req, res) => {
      console.log('000000000000000000000000000000')

      if (req.user.role !== 'instructor') {
        return res.status(403).send('Forbidden.')
      }

      // Return instructor data
      res.status(200).json({ name: 'Hammad', courses: [''] })
    })
 //#endregion

 //#endregion

module.exports = router
