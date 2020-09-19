const faceBookStrategy = require('passport-facebook')
  .Strategy
const User = require('../model/User')

module.exports = function (passport) {
  passport.use(
    new faceBookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:
          'http://localhost:3000/auth/facebook/callback',
        profileFields: [
          'id',
          'email',
          'gender',
          'link',
          'locale',
          'name',
          'timezone',
          'updated_time',
          'verified',
        ],
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
}
