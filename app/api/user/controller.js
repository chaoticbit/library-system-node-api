const config = require('../../../config/config');
var conn = require('../../../config/db');
const moment = require('moment');

exports.getAllUsers = function (req, res) {
    console.log('In get all users');      
    if(req.User[0].d_id == 2)  {
        return res.status(401).send({ message: 'Unauthorized Access' });
    } 
    var query = "select * from user where d_id != 1";
    conn.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {
                    if(result.length) {
                        // var object = JSON.stringify(result);                        
                        res.json({success:true,results:result});
                    }
                    else {
                        res.json({success:false});
                    }
            }
    });    
};
exports.getSingleUser = function (req, res) {
    console.log('In get single user');    
    if(req.User[0].d_id == 2)  {
        return res.status(401).send({ message: 'Unauthorized Access' });
    } 
    var key = req.params.key,            
        query = "select * from user where username = '" + key + "' and d_id != 1";
    
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
exports.getDashboardData = function (req, res) {
    console.log('In get dashboard data');        
    var username = req.User[0].username;

    var query = "select book.title, borrow.username,borrow.Book_ID, borrow.fine, DATE_FORMAT(borrow.B_Date_Time,'%d/%m/%Y') AS borrow_date, DATE_FORMAT(borrow.R_Date_Time,'%d/%m/%Y') AS return_date, borrow.c_id, borrow.lib_id, branch.l_name as library_name from borrow, branch, book where borrow.Book_ID = book.Book_ID and borrow.username = '" + username + "' and borrow.lib_id = branch.Lib_ID";           
    var finalResult = {
        'borrowed': [],
        'reserved': []
    };

    conn.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {                
                    if(result.length) {                      
                        var totalBorrowed = result.length;                    
                        for(var i = 0; i < result.length; i++) {
                            finalResult.borrowed.push(result[i]);                        
                        }
                    }                    
                    // if(finalResult.borrowed.length == totalBorrowed) {
                        var query2 = "select book.title, reserve.username,reserve.Book_ID, reserve.reserved, DATE_FORMAT(reserve.Res_Date_Time,'%d/%m/%Y') AS reserved_date, branch.l_name as library_name from reserve, branch, book where reserve.Book_ID = book.Book_ID and reserve.username = '" + username + "' and reserve.lib_id = branch.lib_ID";                        
                        conn.query(query2, function(err, result2) {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json({success:false});
                                }
                                else {                
                                        if(result2.length) {
                                            var totalReserved = result2.length;                    
                                            for(var i = 0; i < result2.length; i++) {
                                                finalResult.reserved.push(result2[i]);                        
                                            }  
                                        }
                                        // if(finalResult.reserved.length == totalReserved) {
                                            finalCall(res, finalResult);
                                        // }                                      
                                    // }
                                    // else {                    
                                    //     finalCall(res, finalResult);
                                    // }
                                }
                        });   
                    // }                                                            
                // }
                // else {                    
                //     finalCall(res, finalResult);
                // }
            }
    });             
};

function finalCall(res, finalResult) {    
    res.json({success:true,results:finalResult});
}

exports.getNotifications = function(req, res) {
    
    var username = req.User[0].username;

    var query = "select notifications.*, book.title from notifications, book where notifications.username = '" + username + "' and notifications.Book_ID = book.Book_ID";
    conn.query(query, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({success:false});
        }
        else {                
            if(result.length) { 
                res.json({success: true, results: result});
            } else {
                res.json({success: true, results: []});
            }
        }
    });
}