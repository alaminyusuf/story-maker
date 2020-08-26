const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')
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
app.use(
  methodOverride((req, res) => {
    if (
      req.body &&
      typeof req.body === 'object' &&
      '_method' in req.body
    ) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Loogging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  Handlebars Helpers to format date
const {
  formatDate,
  select,
  stripTags,
  truncate,
  editIcon,
} = require('./helpers/hbs')

// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      editIcon,
      formatDate,
      select,
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
    cookie: { secure: false },
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

const { ensureAuth } = require('./middlewares/auth')

// Routes
// app.use('/*', ensureAuth)
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
