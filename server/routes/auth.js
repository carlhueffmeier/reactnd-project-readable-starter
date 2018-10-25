const passport = require('passport');
const bodyParser = require('body-parser');

module.exports = app => {
  if (process.env.GOOGLE_CLIENT_ID) {
    app.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email']
      })
    );

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
      res.redirect('/');
    });
  } else {
    app.get('/auth/google', (req, res) => {
      res.send('In order to use Google sign in, please add the necessary information in `.env`');
    });
  }

  app.post('/auth/local', bodyParser.json(), passport.authenticate('local'), (req, res) => {
    res.send(req.user);
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
