const express = require('express')
const router = express.Router()
const {
  ensureAuth,
  ensureGuest,
} = require('../middlewares/auth')
const Story = require('../model/Story')

router.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' })
})

router.get('/login', (req, res) => {
  res.redirect('/')
})

router.get('/dashboard', async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.user.id,
    }).lean()

    res.render('dashboard', {
      stories: stories,
      name: req.user.firstName,
    })
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

module.exports = router
