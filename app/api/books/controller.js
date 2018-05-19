const config = require('../../../config/config');
var conn = require('../../../config/db');
const moment = require('moment');
const nodemailer = require('nodemailer');

exports.getAllBooks = function (req, res) {
    console.log('In get all books');    
    var query = "select distinct book.Book_ID, book.title, book.author, book.ISBN, DATE_FORMAT(book.publication_date,'%d/%m/%Y') AS publication_date, copy.C_ID, copy.Lib_ID, publisher.p_name, branch.l_name, (select count(*) from reserve where reserve.username = '" + req.User[0].username + "' and reserve.Book_ID = copy.Book_ID and reserve.C_ID = copy.C_ID and reserve.lib_ID = copy.Lib_ID) as is_reserved, (select count(*) from borrow where borrow.Book_ID = copy.Book_ID and borrow.c_id = copy.C_ID and borrow.lib_id = copy.Lib_ID) as borrowed from book, publisher, branch, copy where book.P_ID = publisher.P_ID and book.Book_ID = copy.Book_ID and copy.Lib_ID = branch.lib_ID order by book.Book_ID desc";
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

exports.getSingleBook = function (req, res) {
    console.log('In get single books');    
    var key = req.params.key,
        query = '';       

    if(key == parseInt(key, 10)) { //search by bookID             
        query = "select book.*, publisher.p_name, publisher.street, publisher.City, publisher.State, publisher.zip from book, publisher where book.P_ID = publisher.P_ID and book.Book_ID = " + key;
    } else { //search by bookname
        query = "select book.*, publisher.p_name, publisher.street, publisher.City, publisher.State, publisher.zip from book, publisher where book.P_ID = publisher.P_ID and book.title LIKE '%" + key + "%'";
    }    
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

exports.borrowBook = function(req, res) {
    var username = req.User[0].username;
    var bookId = req.body.bookId;
    var C_ID = req.body.C_ID;
    var Lib_ID = req.body.Lib_ID;

    // var query = "update book set borrowed = 1 where Book_ID = " + bookId;
    var query = "insert into borrow values('" + username + "','" + bookId + "','" + C_ID + "',NOW(),NOW()+INTERVAL 10 DAY,0,'" + Lib_ID + "')";
    conn.query(query, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({success:false});
        }
        else {                
            var query2 = "update copy set borrowed = 'y' where Book_ID = " + bookId + " and C_ID = '" + C_ID + "' and Lib_ID = '" + Lib_ID + "'";
            conn.query(query2, function(err, result2) {
                if (err) {
                    console.log(err);
                    res.status(500).json({success:false});
                }
                else {               
                    res.json({success:true});
                }
            }); 
        }
    });
}

exports.reserveBook = function(req, res) {
    var username = req.User[0].username;
    var bookId = req.body.bookId;              
    var C_ID = req.body.C_ID;
    var Lib_ID = req.body.Lib_ID;
    
    var query = "insert into reserve values('" + username + "','" + bookId + "','" + C_ID + "',NOW(),'y','" + Lib_ID + "')";
    conn.query(query, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({success:false});
        }
        else {               
            var query2 = "update copy set reserved = 'y' where Book_ID = " + bookId + " and C_ID = '" + C_ID + "' and Lib_ID = '" + Lib_ID + "'";
            conn.query(query2, function(err, result2) {
                if (err) {
                    console.log(err);
                    res.status(500).json({success:false});
                }
                else {               
                    res.json({success:true});
                }
            }); 
        }
    });     
}

exports.addNewBook = function(req, res) {
    // if(req.User[0].d_id == 2)  {
    //     return res.status(401).send({ message: 'Unauthorized Access' });
    // } 
    if(req.body.title && req.body.author && req.body.ISBN && req.body.publication_date && req.body.P_ID) {
        var book = req.body.book;
        var query = "insert into book(title, author, ISBN, publication_date, P_ID) values('" + req.body.title + "','" + req.body.author + "'," + req.body.ISBN + ",'" + req.body.publication_date + "','" + req.body.P_ID + "')";
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

exports.addBookCopy = function(req, res) {
    // if(req.User[0].d_id == 2)  {
    //     return res.status(401).send({ message: 'Unauthorized Access' });
    // } 
    if(req.body.Book_ID && req.body.title && req.body.Lib_ID && req.body.C_ID) {        
        var query = "insert into copy values('" + req.body.C_ID + "'," + req.body.Book_ID + ",'" + req.body.Lib_ID + "','n','n')";
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

exports.returnBook = function(req, res) {
    var username = req.User[0].username;
    var Book_ID = req.body.Book_ID;
    var C_ID = req.body.C_ID;
    var Lib_ID = req.body.Lib_ID;    
    
    if(req.body.Book_ID && req.body.Lib_ID && req.body.C_ID) {        
        var query = "delete from borrow where username = '" + username + "' and Book_ID = " + Book_ID + " and c_id = '" + C_ID + "' and lib_id = '" + Lib_ID + "'";

        var query2 = "update copy set borrowed = 'n' where Book_ID = " + Book_ID + " and C_ID = '" + C_ID + "' and Lib_ID = '" + Lib_ID + "'";

        var sendMailQuery = "select reserve.username, book.title, user.email from reserve, book, user where reserve.Book_ID = " + Book_ID + " and reserve.c_id = '" + C_ID + "' and reserve.lib_id = '" + Lib_ID + "' and reserve.Book_ID = Book.Book_ID and reserve.username = user.username order by reserve.Res_Date_Time asc limit 1"        

        conn.query(query, function(err) {
            if (err) {
                console.log(err);
                res.status(500).json({success:false});
            }
            else {                
                conn.query(query2, function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({success:false});
                    }
                    else {                
                        conn.query(sendMailQuery, function(err, result) {
                            if(err) {
                                console.log(err);
                                res.status(500).json({success:false});                                
                            }
                            else {                                
                                var receipant = result[0].email;
                                var bookName = result[0].title;               
                                
                                let transporter = nodemailer.createTransport(config.poolConfig);
                                let mailOptions = {
                                    to: receipant,
                                    subject: 'Library Manager | Your book is available',
                                    html: '<div style="font-size: 18px;font-weight: 300;"><p>No more waiting time!</p><b>' + bookName + '</b> is available. <br>You can now borrow it. <br><a href="http://localhost:9000/#!/books" style="border-radius: 4px;color: rgba(255,255,255,0.87);background-color: rgb(63,81,181);text-decoration: none;min-height: 36px; min-width: 88px;max-width: 88px;display: block;text-align:center;line-height:2;margin-top: 10px;box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.5);padding: 0 6px;">Borrow</a></div>'
                                };
                            
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if(error) {
                                        return console.log(error);
                                    }
                                    console.log("Email sent");
                                    res.json({success: true, message: 'Email sent'});
                                });
                            }
                        });
                    }
                });
            }
        });   
    } else {
        res.json({success: false, message: 'Incorrect form data'});
    }
}

exports.testMail = function(req, res) {
    let transporter = nodemailer.createTransport(config.poolConfig);

    let mailOptions = {
        to: 'dandekar.atharva@gmail.com',
        subject: 'Library Manager | Your book is available',
        html: '<div style="font-size: 18px;font-weight: 300;"><p>No more waiting time!</p><b>Learn React Native</b> is available. <br>You can now borrow it. <br><a href="http://localhost:9000/#!/books" style="border-radius: 4px;color: rgba(255,255,255,0.87);background-color: rgb(63,81,181);min-height: 36px; min-width: 88px;max-width: 88px;display: block;text-align:center;line-height:2;margin-top: 10px;box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.5);padding: 0 6px;">Borrow</a></div>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }

        console.log('Email sent');
        res.json({success: true, message: 'Email sent'});
    });
}