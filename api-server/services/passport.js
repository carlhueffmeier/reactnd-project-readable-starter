const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config/keys');
const users = require('./users');

passport.serializeUser((user, done) => {
  console.log('serialize ', user);
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  console.log('deserialize ', uid);
  const user = await users.get(uid);
  done(null, user);
});

const getPrimaryEmail = profile => {
  const primary = profile.emails.find(email => email.type === 'account');
  return primary ? primary.value : null;
};

passport.use(
  new GoogleStrategy(
    {
      clientSecret: keys.googleClientSecret,
      clientID: keys.googleClientID,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await users.get(profile.id);
      if (existingUser) {
        done(null, existingUser);
      } else {
        const newUser = await users.add({
          uid: profile.id,
          displayName: profile.displayName
        });
        done(null, newUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await users.get(username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!users.verifyPassword(user, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
);
