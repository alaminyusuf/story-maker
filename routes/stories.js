const router = require('express').Router()
const { ensureAuth } = require('../middlewares/auth')
const Story = require('../model/Story')

router.get('/add', (req, res) => {
  res.render('stories/add')
})

router.post('/', async (req, res) => {
  try {
    req.body.user = req.body.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate()
      .sort({ createdAt: 'desc' })
      .lean()
    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

module.exports = router
