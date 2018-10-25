const votes = require('../services/votes');
const { sendGeneralError } = require('../helpers/utils');

module.exports = app => {
  app.get('/api/votes', ({ token, user }, res) => {
    votes
      .getAll(token, user.uid)
      .then(data => res.send(data), error => sendGeneralError({ res, error }));
  });
};
