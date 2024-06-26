const fs = require('fs')
require('dotenv').config()
const { MongoClient } = require('mongodb')
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}


const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote

const getOrders = async (req, res) => {
  //console.log('allProduct allFav')
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db()

  try {
    const allOrders = await db.collection('Orders').find().toArray()
    return res
      .status(200)
      .json({ Orders: allOrders, message: 'success - list of orders' })
  } catch (error) {
    console.log('error ', error)
    return res
      .status(500)
      .json({ error: error, message: 'internal server error' })
  }
  //const allFav = await db.collection('favorites').find().toArray()

  //console.log('allProduct allFav')
  //console.log(allProduct)
  //console.log(allFav)
  //allProduct.forEach((p) => {
  // const isfav = allFav.find(f => f._id == p._id)
  // console.log(p._id + ' = ' + isfav)
  // isfav === true ? p.isFav = true : p.isFav = false
  //})
  //console.log(allProduct)

}

const getOrderById = async (req, res) => {
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

const postOrder = async (req, res) => {
  const client = await MongoClient.connect(process.env.CONNECTION_STRING_Remote)
  const db = client.db()
  try {
    const result = await db.collection('Orders').insertOne(req.body)
    return res
      .status(200)
      .json({ status: 'Success', Message: 'Order was saved successfuly.' })
  } catch (error) {
    console.log('error ', error)
    return res.send('File uploaded successfully!')
  }
}

const deleteOrder = async (req, res) => {
  try {
    // const client = await MongoClient.connect(
    //   process.env.CONNECTION_STRING_Remote
    // )

    // const db = client.db()
    // const result = await db
    //   .collection('Products')
    //   .deleteOne({ _id: new ObjectId(req.params.id) })
    // if (result.deletedCount === 1) {
    //   return res.status(200).json({ message: 'Product deleted successfully' })
    // } else {
    // }
    return res.status(400).json({ message: 'Not Implemented' })
  } catch (error) {
    console.log('error ', error)
    return res
      .status(500)
      .json({ message: 'An error occurred while deleting the Product' })
  }
}

module.exports = {
  getOrders,
  getOrderById,
  postOrder,
  deleteOrder,
}
