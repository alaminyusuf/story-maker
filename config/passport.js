const GoogltStrategy = require('passport-google-oauth20')
  .Strategy

const User = require('../model/User')

module.exports = function (passport) {
  passport.use(
    new GoogltStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, cd) => {
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        })
        try {
          let user = await User.findOne({
            googleId: profile.id,
          })

          if (user) {
            cd(null, user)
          } else {
            user = await User.create(newUser)
            cd(null, user)
          }
        } catch (error) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, cd) => cd(null, user.id))

  passport.deserializeUser((id, cd) => {
    User.findById(id, (err, user) => cd(err, user))
  })
}
