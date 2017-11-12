const categories = require('../services/categories');
const posts = require('../services/posts');

module.exports = app => {
  app.get('/api/categories', (req, res) => {
    categories.getAll(req.token).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.get('/api/:category/posts', (req, res) => {
    posts.getByCategory(req.token, req.params.category).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });
};
