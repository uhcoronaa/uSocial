var dbconfig = require('./dbconfig');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig);
connection.connect((err) => {
    if (err) throw err;
    console.log('DB Connected!!\n');
});

module.exports = connection;