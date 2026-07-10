const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName;
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);

        if (!user) {
          const info = db
            .prepare(
              'INSERT INTO users (google_id, email, name, avatar_url) VALUES (?, ?, ?, ?)'
            )
            .run(googleId, email, name, avatarUrl);
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
        } else {
          // Keep profile info fresh on each login
          db.prepare(
            'UPDATE users SET name = ?, avatar_url = ?, email = ? WHERE id = ?'
          ).run(name, avatarUrl, email, user.id);
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
