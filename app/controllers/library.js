const express = require('express');
const router = express.Router();

var mw = require('../utils/authmiddleware');
var library = require('../api/library/controller');

//GET 
router.get('/', mw.ensureAuthenticated, library.getAllLibraries);

//POST
router.post('/new/', mw.ensureAuthenticated, library.addNewLibrary);

//UPDATE 
// router.put('/:bookId/', mw.ensureAuthenticated, books.getSingleBook);

//DELETE 
// router.delete('/', mw.ensureAuthenticated, books.getSingleBook);
module.exports = router;
