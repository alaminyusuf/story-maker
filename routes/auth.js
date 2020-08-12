const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] })
)

// Callback auth Route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

// Logout route
router.get('/logout', (req, res) => {
  res.logout()
  res.redirect('/')
})

module.exports = router
