const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoute');

const bookRouter = express.Router();

const router = (nav) => {
  bookRouter.get('/', (req, res) => {
    (async function mongo() {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();
        res.render('bookListView', {
          nav,
          title: 'Library',
          books
        });
        await client.close();
      } catch (err) {
        debug(err.stack);
      }
    }());
  });
  bookRouter.route('/:id')
    .all((req, res, next) => {
      next();
    })
    .get((req, res) => {
      const { id } = req.params;
      (async function mongo() {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';
        try {
          const client = await MongoClient.connect(url);
          const db = client.db(dbName);
          const col = db.collection('books');
          const book = await col.findOne({ _id: ObjectID(id) });
          res.render('bookView', {
            nav,
            title: 'Library',
            book
          });
          await client.close();
        } catch (err) {
          debug(err.stack);
        }
      }());
    });
  return bookRouter;
};

module.exports = router;
