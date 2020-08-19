const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const mongoose = require('mongoose')

dotenv.config()

// Passport
require('./config/passport')(passport)
require('./config/facebook')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Loogging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  Handlebars Helpers to format date
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
} = require('./helpers/hbs')

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      // editIcon,
      formatDate,
      stripTags,
      truncate,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// Session
app.use(
  session({
    secret: 'octopus',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
// app.use('/auth/facebook', require('./routes/facebook'))

const PORT = process.env.PORT

app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} on port ${PORT}`
  )
)
