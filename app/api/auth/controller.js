const jwt = require('jsonwebtoken');
const config = require('../../../config/config');
var conn = require('../../../config/db');
const md5 = require('md5');
const moment = require('moment');

exports.login = function (req, res) {
    console.log('In validateLogin');
    console.log(req.body);
    if(req.body.username && req.body.password) {

        var username = req.body.username;
        var password = req.body.password;

        var query = "SELECT * from user where user.username = '" + username + "' AND user.password = '" + password + "'";
        conn.query(query, function(err, result) {
        		if (err) {
                    console.log(err);
        			res.status(500).json({success:false});
        		}
        		else {
        			   if(result.length) {
                           var object = JSON.stringify(result);
                           var token = jwt.sign(object, config.token_secret);
                           res.json({success:true,token: token, user:result});
        			   }
        			   else {
        				    res.json({success:false});
        			   }
        		}
      	});
    }
    else {
        res.json({success: false, message: 'Incorrect form data'});
    }
};

exports.signup = function (req, res) {
    console.log('In signup');
        
    if(req.body.username && req.body.password && req.body.email && req.body.city && req.body.state && req.body.zip && req.body.phone) {

        var username = req.body.username;
        var password = req.body.password;
        var city = req.body.city;
        var state = req.body.state;
        var zip = req.body.zip;
        var phone = req.body.phone;
        var email = req.body.email;

        var query = "insert into user values('" + username + "','" + password + "','" + email + "','" + username + "','" + city + "','" + state + "'," + zip + "," + phone + "," + 2 + ")";
        conn.query(query, function(err) {
        		if (err) {
                    console.log(err);
        			res.status(500).json({success:false});
        		}
        		else {
                    var query2 = "select * from user where username = '" + username + "'";
                    conn.query(query2, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({success:false});
                        }
                        else {
                            if(result.length) {
                                var object = JSON.stringify(result);
                                var token = jwt.sign(object, config.token_secret);
                                res.json({success:true,token: token, user:result});
                            }
                            else {
                                res.json({success:false});
                            }
                        }
                    });
        		}
      	});
    }
    else {
        res.json({success: false, message: 'Incorrect form data'});
    }
};
