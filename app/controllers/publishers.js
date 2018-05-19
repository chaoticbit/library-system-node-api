const express = require('express');
const router = express.Router();

var mw = require('../utils/authmiddleware');
var publishers = require('../api/publishers/controller');

//GET BOOK(S)
router.get('/', mw.ensureAuthenticated, publishers.getAllPublishers);
// router.get('/:key/', mw.ensureAuthenticated, publishers.getSinglePublisher);

//POST NEW BOOK
router.post('/new/', mw.ensureAuthenticated, publishers.addNewPublisher);

//UPDATE BOOK
// router.put('/:bookId/', mw.ensureAuthenticated, publishers.);

//DELETE BOOKS(S)
// router.delete('/', mw.ensureAuthenticated, publishers.);
// router.delete('/:bookId/', mw.ensureAuthenticated, publishers.);
module.exports = router;
