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

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/auth/facebook', require('./routes/facebook'))

const PORT = process.env.PORT

app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} on port ${PORT}`
  )
)
