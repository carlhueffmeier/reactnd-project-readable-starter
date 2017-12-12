const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config/keys');
const users = require('./users');
const { isGoogleAuthenticationPossible } = require('../helpers/utils');

passport.serializeUser((user, done) => {
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  const user = await users.get(uid);
  done(null, user);
});

const getPrimaryEmail = profile => {
  const primary = profile.emails.find(email => email.type === 'account');
  return primary ? primary.value : null;
};

if (isGoogleAuthenticationPossible()) {
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
} else {
  console.log(
    'In order to use Google sign in, export googleClientID and googleClientSecret from config/keys.js '
  );
}

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
