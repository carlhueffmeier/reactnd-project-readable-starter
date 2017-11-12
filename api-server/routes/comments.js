const bodyParser = require('body-parser');
const comments = require('../services/comments');

module.exports = app => {
  app.get('/api/comments/:id', (req, res) => {
    comments.get(req.token, req.params.id).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.put('/api/comments/:id', bodyParser.json(), (req, res) => {
    comments.edit(req.token, req.params.id, req.body).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.post('/api/comments', bodyParser.json(), (req, res) => {
    comments.add(req.token, req.body).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.post('/api/comments/:id', bodyParser.json(), (req, res) => {
    const { option } = req.body;
    comments.vote(req.token, req.params.id, option).then(
      data => res.send(data),
      error => {
        console.error(error);
        res.status(500).send({
          error: 'There was an error.'
        });
      }
    );
  });

  app.delete('/api/comments/:id', (req, res) => {
    comments.disable(req.token, req.params.id).then(
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
