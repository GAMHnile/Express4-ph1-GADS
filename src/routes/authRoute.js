const express = require('express');
// const debug = require('debug')('app:authRoute');

const authRouter = express.Router();

const route = () => {
  authRouter.route('/signUp')
    .post((req, res) => {
      req.logIn(req.body, (err) => {
        res.redirect('/auth/profile');
      });
    });

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
};

module.exports = route;
