var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection({
	// host: config.db_host,
  	// port: config.db_port,
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  	user     : config.db_user,
  	password : config.db_password,
  	database : config.db_name
});

connection.connect(function(err) {
    if (err) {
    console.error('error connecting: ' + err.stack);
    return;
    }
});
module.exports = connection;
