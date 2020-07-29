const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');
const bookServive = require('../services/goodreadsApi');

function bookControllers(nav) {
  function getBooksIndex(req, res) {
    (async function mongo() {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = db.collection('books');
        const books = await col.find().toArray();
        res.render('bookListView', {
          nav,
          title: 'Library',
          books,
          isSignedin: !!req.user
        });
        await client.close();
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function getBooksById(req, res) {
    const { id } = req.params;
    (async function mongo() {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = db.collection('books');
        const book = await col.findOne({ _id: ObjectID(id) });
        const details = await bookServive(book.id);
        res.render('bookView', {
          nav,
          title: 'Library',
          book,
          details
        });
        await client.close();
      } catch (err) {
        debug(err.stack);
        res.status(404).send('Error retrieving book');
      }
    }());
  }

  function authMiddleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  }

  return {
    getBooksById,
    getBooksIndex,
    authMiddleware
  };
}

module.exports = bookControllers;
