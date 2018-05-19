var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var moment = require('moment');

exports.validateRequest = function(req, res, next) {

    if(config.api_key == req.get('api_key')) {
        next();
    }
    else {
        res.status(403).send('Failed to validate request');
    }    
}

exports.ensureAuthenticated = function(req, res, next) {

    if(config.api_key != req.get('api_key')) {
        res.status(403).send('Failed to validate request');
    }
    else {
        if (!req.get('token')) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        }
        else {
            // console.log(req.get('token'));
            var decoded = jwt.verify(req.get('token'), config.token_secret);
            req.User = decoded;
            // console.log(decoded);
            next();
        }
    }
}
