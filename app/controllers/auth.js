const express = require('express');
const router = express.Router();

var mw = require('../utils/authmiddleware');
var auth = require('../api/auth/controller');

router.post('/', mw.validateRequest, auth.login);
router.post('/signup/', mw.validateRequest, auth.signup);
module.exports = router;
