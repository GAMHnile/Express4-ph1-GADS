const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsApi');

const parser = new xml2js.Parser({ explicitArray: false });

function goodReads(id) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.goodreads.com/book/show/?key=${process.env.GOODREADS_KEY}&id=${id}`)
      .then(({ data }) => {
        parser.parseString(data, (err, details) => {
          if (err) {
            debug(err);
          } else {
            resolve(details.GoodreadsResponse.book);
          }
        });
      })
      .catch((err) => {
        debug(err);
        reject(err);
      });
  });
}

module.exports = goodReads;
