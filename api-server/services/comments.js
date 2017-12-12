const clone = require('clone');
const posts = require('./posts');
const { getAuthor } = require('./users');
const { getVote } = require('./votes');

let db = {};

const defaultData = {
  '894tuq4ut84ut8v4t8wun89g': {
    id: '894tuq4ut84ut8v4t8wun89g',
    parentId: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1468166872634,
    body: 'Hi there! I am a COMMENT.',
    author: 'thingone',
    voteScore: 6,
    deleted: false,
    parentDeleted: false
  },
  '8tu4bsun805n8un48ve89': {
    id: '8tu4bsun805n8un48ve89',
    parentId: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1469479767190,
    body: 'Comments. Are. Cool.',
    author: 'thingtwo',
    voteScore: -5,
    deleted: false,
    parentDeleted: false
  }
};

function getData(token) {
  let data = db[token];
  if (data == null) {
    data = db[token] = clone(defaultData);
  }
  return data;
}

function populate({ token, uid }, comment) {
  let populatedComment = { ...comment };
  if (uid) {
    populatedComment.userVote = getVote({
      type: 'comment',
      token,
      uid,
      id: comment.id
    });
  }
  populatedComment.author = getAuthor(comment.author);
  return populatedComment;
}

function getByParent(header, parentId) {
  return new Promise(res => {
    let comments = getData(header.token);
    let keys = Object.keys(comments);
    filtered_keys = keys.filter(
      key => comments[key].parentId === parentId && !comments[key].deleted
    );
    res(filtered_keys.map(key => populate(header, comments[key])));
  });
}

function get(header, id) {
  return new Promise(res => {
    const comments = getData(header.token);
    res(
      comments[id].deleted || comments[id].parentDeleted
        ? {}
        : populate(header, comments[id])
    );
  });
}

function add(header, comment) {
  return new Promise(res => {
    let comments = getData(header.token);

    comments[comment.id] = {
      id: comment.id,
      timestamp: comment.timestamp,
      body: comment.body,
      author: comment.author,
      parentId: comment.parentId,
      voteScore: 0,
      deleted: false,
      parentDeleted: false
    };

    posts.incrementCommentCounter(header.token, comment.parentId, 1);
    res(populate(header, comments[comment.id]));
  });
}

function changeVoteScore(header, id, difference) {
  return new Promise(res => {
    let comments = getData(header.token);
    comment = comments[id];
    comment.voteScore = comment.voteScore + difference;
    res(populate(header, comment));
  });
}

function disableByParent(header, post) {
  return new Promise(res => {
    let comments = getData(header.token);
    keys = Object.keys(comments);
    filtered_keys = keys.filter(key => comments[key].parentId === post.id);
    filtered_keys.forEach(key => (comments[key].parentDeleted = true));
    res(posts.populate(header, post));
  });
}

function disable(header, id) {
  return new Promise(res => {
    let comments = getData(header.token);
    comments[id].deleted = true;
    posts.incrementCommentCounter(header.token, comments[id].parentId, -1);
    res(populate(header, comments[id]));
  });
}

function edit(header, id, comment) {
  return new Promise(res => {
    let comments = getData(header.token);
    for (prop in comment) {
      comments[id][prop] = comment[prop];
    }
    res(populate(header, comments[id]));
  });
}

module.exports = {
  get,
  getByParent,
  add,
  changeVoteScore,
  disableByParent,
  disable,
  edit
};
