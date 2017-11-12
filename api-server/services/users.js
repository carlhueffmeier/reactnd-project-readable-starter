const userData = {
  mulder: {
    uid: 'mulder',
    displayName: 'Fox Mulder'
  },
  '123': {
    uid: '123',
    displayName: 'thingtwo'
  },
  '124': {
    uid: '124',
    displayName: 'thingone'
  }
};

const passwords = {
  mulder: 'trustno1'
};

const getAll = () => new Promise(res => res(userData));

const get = uid => new Promise(res => res(userData[uid] || null));

const add = user =>
  new Promise(res => {
    userData[user.uid] = {
      uid: user.uid,
      displayName: user.displayName
    };
    res(userData[user.uid]);
  });

const populateAuthor = item => ({
  ...item,
  author: userData[item.author] || null
});

const verifyPassword = (user, password) => passwords[user.uid] === password;

module.exports = {
  getAll,
  get,
  add,
  populateAuthor,
  verifyPassword
};
