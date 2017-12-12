const clone = require('clone');

const VOTE_UP = `upVote`;
const VOTE_DOWN = `downVote`;
const VOTE_NONE = null;

let db = {};

const defaultData = {
  udacity: {
    posts: {
      '8xf0y6ziyjabvozdd253nd': VOTE_UP
    },
    comments: {}
  }
};

function formatEntry(table, id, type) {
  return {
    id,
    type,
    vote: table[id] || VOTE_NONE
  };
}

function formatTable(table, type) {
  return Object.keys(table).map(id => formatEntry(table, id, type));
}

function formatResponse(userVotes) {
  return Object.keys(userVotes).reduce(
    (result, tableIndex) => [
      ...result,
      ...formatTable(userVotes[tableIndex], tableIndex.replace(/s?$/, ''))
    ],
    []
  );
}

const initialUserData = {
  posts: {},
  comments: {}
};

function getData(token) {
  let data = db[token];
  if (data == null) {
    data = db[token] = clone(defaultData);
  }
  return data;
}

function getUserVotes(token, uid) {
  let data = getData(token)[uid];
  if (data == null) {
    data = db[token][uid] = clone(initialUserData);
  }
  return data;
}

function numericalValueOfVote(vote) {
  return (
    {
      [VOTE_UP]: 1,
      [VOTE_DOWN]: -1
    }[vote] || 0
  );
}

function getScoreDifference(a, b) {
  return numericalValueOfVote(a) - numericalValueOfVote(b);
}

function isValidVote(vote) {
  const validOptions = [VOTE_UP, VOTE_DOWN, VOTE_NONE];
  return validOptions.includes(vote);
}

function changeVote(table, header, id, vote) {
  return new Promise(res => {
    const userVotes = getUserVotes(header.token, header.uid);
    let scoreDifference = 0;

    if (isValidVote(vote)) {
      scoreDifference = getScoreDifference(vote, userVotes[table][id]);
      userVotes[table][id] = vote;
    } else {
      console.log(`Received incorrect parameter: ${vote}`);
    }
    res(scoreDifference);
  });
}

function voteForPost(...parameters) {
  return changeVote('posts', ...parameters);
}

function voteForComment(...parameters) {
  return changeVote('comments', ...parameters);
}

function getAll(token, uid) {
  return new Promise(res => {
    const userVotes = getUserVotes(token, uid);
    res(formatResponse(userVotes));
  });
}

function getVote({ type, token, uid, id }) {
  const votes = getUserVotes(token, uid)[`${type}s`];
  return votes[id] || VOTE_NONE;
}

module.exports = {
  getAll,
  voteForPost,
  voteForComment,
  getVote
};
