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

function getRandomItems(list, count) {
  const randomItems = []
  const listLength = list.length
  if (count >= listLength) {
    return list // If count is greater or equal to the length of the list, return the whole list
  }
  while (randomItems.length < count) {
    const randomIndex = Math.floor(Math.random() * listLength)
    const randomItem = list[randomIndex]
    if (!randomItems.includes(randomItem)) {
      randomItems.push(randomItem)
    }
  }
  return randomItems
}

const uploadImageToGridFS = async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )
    const db = client.db('zainStoreDB')

    // Get the file from the request
    const imageFile = req.file

    // Create a readable stream from the uploaded file
    const readableStream = new Readable()
    readableStream.push(imageFile.buffer)
    readableStream.push(null)

    // Upload the file to GridFS
    const bucket = new GridFSBucket(db)
    const uploadStream = bucket.openUploadStream(imageFile.originalname)
    readableStream.pipe(uploadStream)

    uploadStream.on('error', (error) => {
      console.error('Error uploading file:', error)
      res.status(500).json({ success: false, error: 'Error uploading file' })
    })

    uploadStream.on('finish', () => {
      client.close()
      res.json({ success: true, fileId: uploadStream.id })
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ success: false, error: 'Error uploading file' })
  }
}

const getProducts = async (req, res) => {
  //console.log('allProduct allFav')
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db()

  const allProduct = await db.collection('Products').find().toArray()
  //const allFav = await db.collection('favorites').find().toArray()

  //console.log('allProduct allFav')
  //console.log(allProduct)
  //console.log(allFav)
  allProduct.forEach((p) => {
    // const isfav = allFav.find(f => f._id == p._id)
    // console.log(p._id + ' = ' + isfav)
    // isfav === true ? p.isFav = true : p.isFav = false
  })
  //console.log(allProduct)
  return res.json({ Product: allProduct, message: 'success' })
}

const getProductsMostrequested = async (req, res) => {
  //console.log('allProduct allFav')
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db()

  const allProduct = await db.collection('Products').find().toArray()
  //const allFav = await db.collection('favorites').find().toArray()

  const randomItems = getRandomItems(allProduct, 4)

  return res.json({ Product: randomItems, message: 'success' })
}

const getProductById = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db('zainStoreDB')

  const products = await db
    .collection('Products')
    .find({ catid: req.params.id })
    .toArray()
  const allFav = await db.collection('favorites').find().toArray()

  products.forEach((p) => {
    const result = allFav.find((f) => f.product._id === p._id.toString())
    if (result === undefined) {
      p.isFav = false
    } else {
      p.isFav = true
    }
  })

  return res.json(products)
}

const postProduct = async (req, res) => {
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
    const result = await db.collection('Products').insertOne(newCourse)
  } catch (error) {
    console.log('error ', error)
  }
  return res.send('File uploaded successfully!')
}

const postProductFav = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')

  const favObject = {
    userID: req.body.userID,
    tID: 0,
    product: req.body,
  }

  const filter = { _id: new ObjectId(req.body._id) }

  try {
    // Check if the favorite record already exists
    const existingFavorite = await db.collection('favorites').findOne(filter)

    if (existingFavorite) {
      // If the favorite exists, update it
      //const updateResult = await db.collection('favorites').updateOne(filter, { $set: favObject });

      const deleteFavorite = await db.collection('favorites').deleteOne(filter)

      return res.json(req.body)
    } else {
      // If the favorite doesn't exist, create it
      const insertResult = await db
        .collection('favorites')
        .insertOne({ ...favObject, ...filter })
      if (insertResult.acknowledged === true) {
        return res.json(req.body)
      } else {
        return res.status(500).json({ message: 'Failed to create favorite' })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating Products' })
  } finally {
    // Close the MongoDB client
    await client.close()
  }
}

const putProduct = async (req, res) => {
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
    const result = await db.collection('Products').updateOne(filter, update)

    if (result.modifiedCount === 1) {
      const course = await db.collection('Products').findOne(filter)
      return res.status(200).json({ course })
    } else {
      return res.status(404).json({ message: 'Products not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating Products' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )

    const db = client.db()
    const result = await db
      .collection('Products')
      .deleteOne({ _id: new ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Product deleted successfully' })
    } else {
    }
  } catch (error) {
    console.log('error ', error)
    return res
      .status(500)
      .json({ message: 'An error occurred while deleting the Product' })
  }
}

module.exports = {
  getProducts,
  getProductsMostrequested,
  getProductById,
  postProduct,
  putProduct,
  postProductFav,
  deleteProduct,
  uploadImageToGridFS,
}
