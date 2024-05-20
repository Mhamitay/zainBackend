const router = require('express').Router()

const multer = require('multer')

// const storage = multer.diskStorage({-----------------------------------
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   },
// })

//const upload = multer({ storage: storage })

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
//#region EndPoints ..


//#region Product
// Product endpoints
//------------------------------------
const {
  getFav,
  postFavToggle,
  deleteFav
} = require('./handlers/favHandlers')

router.get('/api/fav', getFav)
router.post('/api/fav', postFavToggle)
router.delete('/api/fav/:id', deleteFav)

//------------------------------------
//#endregion



//#region Product
// Product endpoints
//------------------------------------
const {
  getCart,
  postCart,
  deleteCart,
} = require('./handlers/CartHandlers')

router.get('/api/cart', getCart)
router.post('/api/Cart', postCart)
router.delete('/api/Cart/:id', deleteCart)
//------------------------------------
//#endregion

//#region Product
// Product endpoints
//------------------------------------
const {
  getProducts,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct,
  postProductFav,
  uploadImageToGridFS,
} = require('./handlers/productHandlers')

router.get('/api/product', getProducts)
router.get('/api/product/:id', getProductById)
router.post('/api/product', postProduct)
router.put('/api/product/:id', putProduct)
router.post('/api/product/fav', postProductFav)
router.delete('/api/product/:id', deleteProduct)
router.post('/api/product', upload.single('image'), uploadImageToGridFS)

//------------------------------------
//#endregion

//#region cach
// Cach endpoints
//------------------------------------
const {
  getCach,
  getCachById,
  postCach,
  putCach,
  deleteCach,
} = require('./handlers/cachHandlers')

router.get('/api/cach', getCach)
router.get('/api/cach/:id', getCachById)
router.post('/api/cach', postCach)
router.put('/api/cach/:id', putCach)
router.delete('/api/cach/:id', deleteCach)
//------------------------------------
//#endregion

//#region categories
// Categories endpoints
//------------------------------------
const {
  getCategories,
  getCategoryById,
  postCategory,
  putCategory,
  deleteCategory,
} = require('./handlers/categoriesHandlers')

router.get('/api/categories', getCategories)
router.get('/api/category/:id', getCategoryById)
router.post('/api/categorY', postCategory)
router.put('/api/category/:id', putCategory)
router.delete('/api/categories/:id', deleteCategory)
//router.post('/category', upload.single('file'), postCategory)
//router.patch('/api/courses/:id', upload.single('file'), putcategory)
//#endregion

//#region  jwt login & Auth
//------------------------------------
// router.post('/api/auth/login', authLogIn)
// router.post('/api/auth/register', registereUser)

//#region Protected routs
// router.get('/api/students', authMiddleware, (req, res) => {
//   if (req.user.role !== 'student') {
//     return res.status(403).send('Forbidden.')
//   }

//   // Return student data
//   res.status(200).json({ name: 'John Doe', roll: '123456' })
// })

// router.get('/api/instructors', authMiddleware, (req, res) => {
//   console.log('000000000000000000000000000000')

//   if (req.user.role !== 'instructor') {
//     return res.status(403).send('Forbidden.')
//   }

//   // Return instructor data
//   res.status(200).json({ name: 'Hammad', courses: [''] })
// })
//#endregion

//#endregion
//#endregion

module.exports = router

// user management endpoints
//------------------------------------
// router.get('/api/users', getUsers)
// router.get('/api/users/:id', getUsersById)
// router.put('/api/users/:id', putUser)  - Not used. for After the course
// router.delete('/api/users/:id', deleteUser) - Not used. for After the course