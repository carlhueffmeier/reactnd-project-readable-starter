const bodyParser = require('body-parser');
const posts = require('../services/posts');
const votes = require('../services/votes');
const comments = require('../services/comments');
const {
  createHeader,
  sendForbiddenError,
  sendGeneralError,
  isUserSignedIn,
  isUserAuthorizedToModify
} = require('../helpers/utils');

module.exports = app => {
  // Everyone can fetch posts and comments
  app.get('/api/posts', (req, res) => {
    const header = createHeader(req);
    posts
      .getAll(header)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.get('/api/posts/:id', (req, res) => {
    const header = createHeader(req);
    posts
      .get(header, req.params.id)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.get('/api/posts/:id/comments', (req, res) => {
    const header = createHeader(req);
    comments
      .getByParent(header, req.params.id)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.post('/api/posts/:id', bodyParser.json(), async (req, res) => {
    const header = createHeader(req);
    if (!isUserSignedIn(req)) {
      sendForbiddenError(res, 'Only signed in users can vote on posts.');
      return;
    }
    try {
      const { body: { vote }, params: { id } } = req;
      const scoreDifference = await votes.voteForPost(header, id, vote);
      const post = await posts.changeVoteScore(header, id, scoreDifference);
      res.send(post);
    } catch (error) {
      sendGeneralError({ res, error });
    }
  });

  app.post('/api/posts', bodyParser.json(), (req, res) => {
    const header = createHeader(req);
    if (!isUserSignedIn(req)) {
      sendForbiddenError(res, 'Only signed in users can create new posts.');
      return;
    }
    const newPost = { ...req.body, author: req.user.uid };
    posts
      .add(header, newPost)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.delete('/api/posts/:id', (req, res) => {
    const header = createHeader(req);
    if (!isUserAuthorizedToModify(req, posts)) {
      sendForbiddenError(
        res,
        'Only signed in and authorized users can delete posts.'
      );
      return;
    }
    posts
      .disable(header, req.params.id)
      .then(post => comments.disableByParent(header, post))
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.put('/api/posts/:id', bodyParser.json(), (req, res) => {
    const header = createHeader(req);
    if (!isUserAuthorizedToModify(req, posts)) {
      sendForbiddenError(
        res,
        'Only signed in and authorized users can modify posts.'
      );
      return;
    }
    posts
      .edit(header, req.params.id, req.body)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });
};
