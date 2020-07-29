const { Strategy } = require('passport-local');
const passport = require('passport');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local-strategy');

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

module.exports = function localStrategy() {
  passport.use(
    new Strategy({
      usernameField: 'username',
      passwordField: 'password'
    }, (username, password, done) => {
      let client;
      (async function getUser() {
        try {
          client = await MongoClient.connect(url);
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = await col.findOne({ username });
          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    })
  );
};
