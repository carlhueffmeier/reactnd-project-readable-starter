const bodyParser = require('body-parser');
const comments = require('../services/comments');
const votes = require('../services/votes');
const {
  createHeader,
  sendForbiddenError,
  sendGeneralError,
  isUserSignedIn,
  isUserAuthorizedToModify
} = require('../helpers/utils');

module.exports = app => {
  // Everyone can fetch comments
  app.get('/api/comments/:id', (req, res) => {
    const header = createHeader(req);
    comments
      .get(header, req.params.id)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.post('/api/comments', bodyParser.json(), (req, res) => {
    const header = createHeader(req);
    if (!isUserSignedIn(req)) {
      sendForbiddenError(res, 'Only signed in users can create new comments');
      return;
    }
    const newComment = { ...req.body, author: req.user.uid };
    comments
      .add(header, newComment)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.post('/api/comments/:id', bodyParser.json(), async (req, res) => {
    const header = createHeader(req);
    if (!isUserSignedIn(req)) {
      sendForbiddenError(res, 'Only signed in users can vote on comments.');
      return;
    }
    try {
      const { body: { vote }, params: { id } } = req;
      const scoreDifference = await votes.voteForComment(header, id, vote);
      const comment = await comments.changeVoteScore(
        header,
        id,
        scoreDifference
      );
      res.send(comment);
    } catch (error) {
      sendGeneralError({ res, error });
    }
  });

  app.put('/api/comments/:id', bodyParser.json(), (req, res) => {
    const header = createHeader(req);
    if (!isUserAuthorizedToModify(req, comments)) {
      sendForbiddenError(
        res,
        'Only signed in and authorized users can modify comments.'
      );
      return;
    }
    comments
      .edit(header, req.params.id, req.body)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });

  app.delete('/api/comments/:id', (req, res) => {
    const header = createHeader(req);
    if (!isUserAuthorizedToModify(req, comments)) {
      sendForbiddenError(
        res,
        'Only signed in and authorized users can delete comments.'
      );
      return;
    }
    comments
      .disable(header, req.params.id)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });
};
