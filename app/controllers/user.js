const express = require('express');
const router = express.Router();

var mw = require('../utils/authmiddleware');
var user = require('../api/user/controller');

//GET USER(S)
router.get('/all/', mw.ensureAuthenticated, user.getAllUsers);
router.get('/dashboard/', mw.ensureAuthenticated, user.getDashboardData);
router.get('/notifications/', mw.ensureAuthenticated, user.getNotifications);
router.get('/:key/', mw.ensureAuthenticated, user.getSingleUser);

//CREATE NEW USER
// router.post('/new/', mw.ensureAuthenticated, user.getSingleBook);

//UPDATE USER
// router.put('/:bookId/', mw.ensureAuthenticated, user.getSingleBook);

//DELETE USER(S)
// router.delete('/', mw.ensureAuthenticated, user.getSingleBook);
// router.delete('/:bookId/', mw.ensureAuthenticated, user.getSingleBook);
module.exports = router;
