const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const bookRouter = require('./src/routes/bookRoute');

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(morgan('tiny'));
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

app.get('/', (req, res) => {
  res.render('index', {
    nav: [
      { title: 'Books', link: '/books' },
      { title: 'Authors', link: '/authors' }
    ],
    title: 'Library'
  });
});

app.listen(port, () => {
  debug(`App running on port ${chalk.green(port)}`);
});
