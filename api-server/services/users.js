const userData = {
  udacity: {
    uid: 'udacity',
    displayName: 'Udacity 🚀'
  },
  thingtwo: {
    uid: 'thingtwo',
    displayName: 'Thing II'
  },
  thingone: {
    uid: 'thingone',
    displayName: 'Thing I'
  }
};

const passwords = {
  udacity: 'udacityrocks'
};

function getAll() {
  return new Promise(res => res(userData));
}

function get(uid) {
  return new Promise(res => res(userData[uid] || null));
}

function add(user) {
  return new Promise(res => {
    userData[user.uid] = {
      uid: user.uid,
      displayName: user.displayName
    };
    res(userData[user.uid]);
  });
}

function getAuthor(uid) {
  return userData[uid] || null;
}

function verifyPassword(user, password) {
  return passwords[user.uid] === password;
}

module.exports = {
  getAll,
  get,
  add,
  getAuthor,
  verifyPassword
};
