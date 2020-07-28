const express = require('express');
// const debug = require('debug')('app:authRoute');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

const route = (nav) => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';

  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      (async function createUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = { username, password };
          const result = await col.insertOne(user);

          req.logIn(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          console.log(error.stack);
        }
        await client.close();
      }());
    });
  authRouter.route('/signin')
    .all((req, res, next) => {
      if (req.user) {
        res.redirect('/books');
      } else {
        next();
      }
    })
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'SignIn'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/signout')
    .get((req, res) => {
      req.logOut();
      res.redirect('/');
    });

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/signin');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
};

module.exports = route;
