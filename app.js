require('dotenv').config()
require('swagger-ui-express')

const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
})

// DATABASE
const connectDB = require('./db/connect')

// MIDDLEWARE
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const productsRouter = require('./routes/productRoutes')

// SERVE FONT-END
app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.send('<h1>FILE UPLOAD STARTER<h1>')
})

// APP.USE
app.use(express.json())
app.use(fileUpload({ useTempFiles: true }))
app.use('/api/v1/products', productsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
