const express = require('express');
const router = express.Router();

var mw = require('../utils/authmiddleware');
var books = require('../api/books/controller');

//GET 
router.get('/', mw.ensureAuthenticated, books.getAllBooks);
router.get('/testmail/', mw.ensureAuthenticated, books.testMail);
router.get('/:key/', mw.ensureAuthenticated, books.getSingleBook);

//POST 
router.post('/new/', mw.ensureAuthenticated, books.addNewBook);
router.post('/borrow/', mw.ensureAuthenticated, books.borrowBook);
router.post('/reserve/', mw.ensureAuthenticated, books.reserveBook);
router.post('/copy/', mw.ensureAuthenticated, books.addBookCopy);
router.post('/return/', mw.ensureAuthenticated, books.returnBook);

//UPDATE 
// router.put('/:bookId/', mw.ensureAuthenticated, books.getSingleBook);

//DELETE 
// router.delete('/', mw.ensureAuthenticated, books.getSingleBook);
// router.delete('/:bookId/', mw.ensureAuthenticated, books.getSingleBook);
module.exports = router;
