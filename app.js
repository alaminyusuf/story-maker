const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

// Passport
require('./config/passport')(passport)

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
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT

app.listen(
  PORT,
  console.log(
    `Server running on ${process.env.NODE_ENV} on port ${PORT}`
  )
)
