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

router.get('/edit/:id', async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id })

  if (!story) {
    res.render('errors/404')
  }

  // if (story.id != req.user.id) {
  //   res.redirect('/stories')
  // } else {
  res.render('stories/edit', {
    story,
  })
})

router.put('/:id', async (req, res) => {
  let story = await Story.findById(req.params.id)

  if (!story) {
    return res.render('errors/404')
  }

  // if (story.id != req.user.id) {
  //   res.redirect('/stories')
  // } else {
  story = await Story.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  res.redirect('/dashboard')
  // }
})

module.exports = router
