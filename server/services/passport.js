const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const users = require('./users');

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

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientID: process.env.GOOGLE_CLIENT_ID,
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
  console.log('Google Signin disabled');
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
