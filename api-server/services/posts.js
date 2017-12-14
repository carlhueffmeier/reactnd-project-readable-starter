const clone = require('clone');
const { getAuthor } = require('./users');
const { getVote } = require('./votes');

let db = {};

const defaultData = {
  '8xf0y6ziyjabvozdd253nd': {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1467166872634,
    title: 'Udacity is the best place to learn React',
    body: 'Everyone says so after all.',
    author: 'thingtwo',
    category: 'react',
    voteScore: 6,
    deleted: false,
    commentCount: 2
  },
  '6ni6ok3ym7mf1p33lnez': {
    id: '6ni6ok3ym7mf1p33lnez',
    timestamp: 1468479767190,
    title: 'Learn Redux in 10 minutes!',
    body: 'Just kidding. It takes more than 10 minutes to learn technology.',
    author: 'thingone',
    category: 'redux',
    voteScore: -5,
    deleted: false,
    commentCount: 0
  }
};

function getData(token) {
  let data = db[token];
  if (data == null) {
    data = db[token] = clone(defaultData);
  }
  return data;
}

function populate({ token, uid }, post) {
  let populatedPost = { ...post };
  if (uid) {
    populatedPost.userVote = getVote({
      type: 'post',
      token,
      uid,
      id: post.id
    });
  }
  populatedPost.author = getAuthor(post.author);
  return populatedPost;
}

function getByCategory(header, category) {
  return new Promise(res => {
    let posts = getData(header.token);
    let keys = Object.keys(posts);
    let filtered_keys = keys.filter(
      key => posts[key].category === category && !posts[key].deleted
    );
    res(filtered_keys.map(key => populate(header, posts[key])));
  });
}

function get(header, id) {
  return new Promise(res => {
    const posts = getData(header.token);
    res(!posts[id] || posts[id].deleted ? {} : populate(header, posts[id]));
  });
}

function getAll(header) {
  return new Promise(res => {
    const posts = getData(header.token);
    let keys = Object.keys(posts);
    let filtered_keys = keys.filter(key => !posts[key].deleted);
    res(filtered_keys.map(key => populate(header, posts[key])));
  });
}

function add(header, post) {
  return new Promise(res => {
    let posts = getData(header.token);

    posts[post.id] = {
      id: post.id,
      timestamp: post.timestamp,
      title: post.title,
      body: post.body,
      author: post.author,
      category: post.category,
      voteScore: 0,
      deleted: false,
      commentCount: 0
    };

    res(populate(header, posts[post.id]));
  });
}

function changeVoteScore(header, id, difference) {
  return new Promise(res => {
    let posts = getData(header.token);
    post = posts[id];
    post.voteScore = post.voteScore + difference;
    res(populate(header, post));
  });
}

function disable(header, id) {
  return new Promise(res => {
    let posts = getData(header.token);
    posts[id].deleted = true;
    res(populate(header, posts[id]));
  });
}

function edit(header, id, post) {
  return new Promise(res => {
    let posts = getData(header.token);
    for (prop in post) {
      posts[id][prop] = post[prop];
    }
    res(populate(header, posts[id]));
  });
}

function incrementCommentCounter(token, id, count) {
  const data = getData(token);
  if (data[id]) {
    data[id].commentCount += count;
  }
}

module.exports = {
  get,
  getAll,
  getByCategory,
  add,
  changeVoteScore,
  disable,
  edit,
  getAll,
  incrementCommentCounter,
  populate
};
