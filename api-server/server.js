require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const config = require('./config/config');
const keys = require('./config/keys');
require('./services/passport.js');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));

if (!keys || !keys.cookieKey) {
  console.warn("Please add cookieKey to 'config/keys.js'.");
}
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in miliseconds
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth')(app);
require('./routes/root')(app);
require('./routes/categories')(app);
require('./routes/posts')(app);
require('./routes/comments')(app);
require('./routes/votes')(app);

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port);
});
