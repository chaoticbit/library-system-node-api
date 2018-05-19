const config = require('../../../config/config');
var conn = require('../../../config/db');
const moment = require('moment');

exports.getAllLibraries = function (req, res) {
    console.log('In get all books');    
    var query = "select * from branch";
    conn.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {
                    if(result.length) {                        
                        res.status(200).json({success:true,results:result});
                    }
                    else {
                        res.json({success:false});
                    }
            }
    });    
};

exports.addNewLibrary = function(req, res) {
    if(req.User[0].d_id == 2)  {
        return res.status(401).send({ message: 'Unauthorized Access' });
    } 
    if(req.body.lib_ID && req.body.l_name && req.body.city && req.body.total_books) {        
        var query = "insert into branch values('" + req.body.lib_ID + "','" + req.body.l_name + "'," + req.body.city + "," + req.body.total_books + ")";
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

