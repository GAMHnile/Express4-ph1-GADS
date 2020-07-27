const { Strategy } = require('passport-local');
const passport = require('passport');

passport.use(
  new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const user = {
      username,
      password
    };
    done(null, user);
  })
);
