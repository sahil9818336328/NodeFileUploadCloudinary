const path = require('path')
const cloudinary = require('cloudinary')
const fs = require('fs')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

// ADDITIONAL CHECKS
const uploadProductImageLocal = async (req, res) => {
  // TRUTHY/FALSY
  if (!req.files) {
    throw new CustomError.BadRequestError('PLEASE PROVIDE AN IMAGE...')
  }

  const productImage = req.files.image

  // CHECKING FILE TYPE
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError(
      'PLEASE PROVIDE A FILE WITH TYPE IMAGE...'
    )
  }

  // CHECKING FILE SIZE
  if (productImage.size > process.env.MAX_SIZE) {
    throw new CustomError.BadRequestError(
      'PLEASE PROVIDE AN IMAGE FILE LESS THAN 1KB...'
    )
  }

  // MOVE IMAGE TO THE SPECIFIED PATH
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )

  await productImage.mv(imagePath)
  // console.log(imagePath)

  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } })
}

// UPLOAD IMAGE TO CLOUDINARY AND GET ITS PATH BACK, AND THEN MAKE A POST REQUEST
const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
    }
  )

  // UNSTORE FILE ON THE SERVER
  fs.unlinkSync(req.files.image.tempFilePath)
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = { uploadProductImage }
