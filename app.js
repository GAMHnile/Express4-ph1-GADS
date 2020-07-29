const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const nav = [
  { title: 'Books', link: '/books' },
  { title: 'Authors', link: '/authors' }
];

const bookRouter = require('./src/routes/bookRoute')(nav);
const adminRouter = require('./src/routes/adminRoute')(nav);
const authRouter = require('./src/routes/authRoute')(nav);

app.use(morgan('tiny'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport')(app);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   '/css',
//   express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')),
// );
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/jquery/dist')),
);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res, next) => {
  if (req.user) {
    res.redirect('/books');
  } else {
    next();
  }
}, (req, res) => {
  res.render('index', {
    nav,
    title: 'Library'
  });
});

app.listen(port, () => {
  debug(`App running on port ${chalk.green(port)}`);
});
