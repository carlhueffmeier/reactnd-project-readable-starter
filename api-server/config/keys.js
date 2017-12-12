// Tries to load api keys or falls back to an example file.

let keys;

try {
  keys = require('./keys.private.js');
} catch (error) {
  console.log('Please enter your api keys in keys.private.js.');
  keys = {
    cookieKey: 'totallyinsecurecookiekey' // fallback
  };
}

module.exports = keys;
