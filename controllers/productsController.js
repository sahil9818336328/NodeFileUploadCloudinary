const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')

// POST REQUEST
const createProduct = async (req, res) => {
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

// GET REQUEST
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({ products })
}

module.exports = { createProduct, getAllProducts }
