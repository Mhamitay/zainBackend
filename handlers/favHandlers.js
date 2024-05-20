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


const getFav = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB') ///

  try {
    // Check if the favorite record already exists
    const allFavorites = await db.collection('favorites').find().toArray()
    return res.json(allFavorites)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating Products' });
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

const postFavToggle = async (req, res) => {
  const client = new MongoClient(process.env.CONNECTION_STRING_Remote, options)
  const db = client.db('zainStoreDB')

  const favObject = {
    userID: req.body.userID,
    tID: 0,
    product: req.body
  };

  const filter = { _id: new ObjectId(req.body._id) };

  try {
    // Check if the favorite record already exists
    const existingFavorite = await db.collection('favorites').findOne(filter);

    if (existingFavorite) {
      // If the favorite exists, update it
      //const updateResult = await db.collection('favorites').updateOne(filter, { $set: favObject });

      const deleteFavorite = await db.collection('favorites').deleteOne(filter);

      return res.json(req.body)

    } else {
      // If the favorite doesn't exist, create it
      const insertResult = await db.collection('favorites').insertOne({ ...favObject, ...filter });
      if (insertResult.acknowledged === true) {
        return res.json(req.body)
      } else {
        return res.status(500).json({ message: 'Failed to create favorite' });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating Products' });
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

const deleteFav = async (req, res) => {
  try {
    const client = await MongoClient.connect(
      process.env.CONNECTION_STRING_Remote
    )

    const db = client.db()
    const result = await db
      .collection('favorites')
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
  getFav,
  postFavToggle,
  deleteFav
}
