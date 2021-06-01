const router = require('express').Router();
const passport = require('passport');

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

// Callback auth Route
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/dashboard');
	}
);

// Logout route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
