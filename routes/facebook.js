const router = require('express').Router()
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('facebook', {
    scope: 'email',
  })
)

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

module.exports = router
