const express = require('express');

const bookRouter = express.Router();

const router = (nav) => {
  const bookControllers = require('../controllers/bookController')(nav);
  bookRouter.use(bookControllers.authMiddleware);
  bookRouter.get('/', bookControllers.getBooksIndex);
  bookRouter.route('/:id').get(bookControllers.getBooksById);
  return bookRouter;
};

module.exports = router;
