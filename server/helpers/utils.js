function sendForbiddenError(res, message) {
  res.status(403).send({
    error: message || 'Forbidden.'
  });
}

function sendGeneralError({ res, error }) {
  console.error(error);
  res.status(500).send({
    error: 'There was an error.'
  });
}

function isUserSignedIn(req) {
  return Boolean(req.user);
}

async function isUserAuthorizedToModify(req, service) {
  try {
    if (!isUserSignedIn) return false;
    const entity = await service.get(req.token, req.params.id);
    return entity.author.uid === req.user.uid;
  } catch (error) {
    return false;
  }
}

function createHeader(req) {
  const header = { token: req.token };
  if (req.user) {
    header.uid = req.user.uid;
  }
  return header;
}

module.exports = {
  sendForbiddenError,
  sendGeneralError,
  isUserSignedIn,
  isUserAuthorizedToModify,
  createHeader
};
