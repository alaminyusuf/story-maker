const express = require('express')
const router = express.Router()
const {
  ensureAuth,
  ensureGuest,
} = require('../middlewares/auth')
const Story = require('../model/Story')

router.get('/', ensureGuest, (req, res) => {
  console.log(req.isAuthenticated())
  res.render('login', { layout: 'login' })
})

router.get('/dashboard', ensureAuth, async (req, res) => {
  console.log(req.isAuthenticated())

  try {
    const stories = await Story.find({
      status: 'public',
    }).lean()

    console.log(stories)

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
