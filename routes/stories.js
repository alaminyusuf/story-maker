const router = require('express').Router()
const Story = require('../model/Story')

const {ensureAuth } = require('../middlewares/auth')

router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

router.post('/', ensureAuth,async (req, res) => {
  try {
    req.body.user = req.body.id
    await Story.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

router.get('/', ensureAuth,async (req, res) => {
  console.log('-----is auth', req.isAuthenticated())
  console.log('--------- user', req.body.user)
  console.log('--------- user', req.body)
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
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

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id)
    if (!story) {
      res.render('error/400')
    }
    res.render('stories/show')
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

router.get('/edit/:id', ensureAuth,async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    })

    if (!story) {
      res.render('errors/404')
    }

    if (story.id != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

router.put('/:id', ensureAuth,async (req, res) => {
  try {
    let story = await Story.findById(req.params.id)

    if (!story) {
      return res.render('errors/404')
    }

    if (story.id != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

router.delete('/:id', ensureAuth,  async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id })
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
})

module.exports = router
