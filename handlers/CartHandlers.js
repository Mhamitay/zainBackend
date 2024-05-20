require('dotenv').config()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const path = require('path')
const fs = require('fs')
const { json } = require('stream/consumers')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}


const { CONNECTION_STRING_URI } = process.env.CONNECTION_STRING_Remote
// Instructor management handlers
const getCart = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')
  try {
    const query = { role: 'Cart' }
    const cartitems = await db.collection('Cart').find().toArray()
    return res.json({ data: cartitems, message: 'success' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error getting Cart list' })
  }
}
const postCart = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')
  // console.log(req.body.item)

  const cartObject = { ...req.body.item }
  //const cartItemId = new ObjectId(cartObject._id.toString());
  const cartItemId = cartObject._id
  const filter = { _id: cartItemId };


  try {
    // Check if the favorite record already exists
    const existingItem = await db.collection('Cart').findOne(filter);

    if (existingItem) {
      // If the favorite exists, update it
      res.status(400).json({ message: 'item alread in the cart', code: 2 })
    } else {
      const cart = await db.collection('Cart').insertOne(cartObject)
      res.status(200).json({ message: 'An item was added to the cart successfuly.' })
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding item to cart' });
  } finally {
    // Close the MongoDB client
    await client.close();
  }


}

const deleteCart = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')


  try {
    const result = await db
      .collection('Cart')
      .deleteOne({ _id: ObjectId(req.params.id) })
    if (result.deletedCount === 1) {
      res.json({ message: 'Cart item deleted' })
    } else {
      res.status(404).json({ message: 'Cart item was not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting Cart item' })
  }
}

module.exports = {
  getCart,
  postCart,
  deleteCart
}
