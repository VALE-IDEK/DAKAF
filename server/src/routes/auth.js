const express = require('express');
const passport = require('passport');

const router = express.Router();

// Kick off Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google redirects back here
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

// Returns the currently logged-in user, or null
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { id, email, name, avatar_url } = req.user;
    return res.json({ user: { id, email, name, avatar_url } });
  }
  res.json({ user: null });
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

module.exports = router;
