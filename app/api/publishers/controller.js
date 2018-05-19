const jwt = require('jsonwebtoken');
const config = require('../../../config/config');
var conn = require('../../../config/db');
const md5 = require('md5');
const moment = require('moment');

exports.getAllPublishers = function (req, res) {
    // if(req.User[0].d_id == 2)  {
    //     return res.status(401).send({ message: 'Unauthorized Access' });
    // } 
    var query = "SELECT * from publisher";
    conn.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {
                    if(result.length) {                                                
                        res.json({success:true,results:result});
                    }
                    else {
                        res.json({success:false});
                    }
            }
    });    
};

exports.addNewPublisher = function(req, res) {
    // if(req.User[0].d_id == 2)  {
    //     return res.status(401).send({ message: 'Unauthorized Access' });
    // } 
    if(req.body.p_name && req.body.street && req.body.city && req.body.state && req.body.zip) {
        var book = req.body.book;
        var query = "insert into publisher (P_ID, p_name, street, City, State, zip) select max(P_ID) + 1, '" + req.body.p_name + "','" + req.body.street + "','" + req.body.city + "','" + req.body.state + "'," + req.body.zip + " from publisher";
        conn.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {                
                res.json({success:true});                
            }
        });    
    } else {
        res.json({success: false, message: 'Incorrect form data'});
    }
};
