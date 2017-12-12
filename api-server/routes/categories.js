const categories = require('../services/categories');
const posts = require('../services/posts');
const { sendGeneralError } = require('../helpers/utils');

module.exports = app => {
  app.get('/api/categories', (req, res) => {
    categories
      .getAll(req.token)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.get('/api/:category/posts', (req, res) => {
    posts
      .getByCategory(req.token, req.params.category)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });
};
