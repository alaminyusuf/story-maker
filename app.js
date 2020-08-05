const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

// Loogging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars
app.engine(
  '.hbs',
  exphbs({ defaultLayout: 'main', extname: '.hbs' })
)
app.set('view engine', '.hbs')

const PORT = process.env.PORT

app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} on port ${PORT}`
  )
)
