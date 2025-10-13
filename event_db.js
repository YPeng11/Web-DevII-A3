const mysql = require('mysql2')
var bodyParser = require('body-parser');
var http = require('http');

var dbDetails = require("./db-details");

// const connection = mysql.createConnection({
//   host: 'localhost', 
//   user: 'root', 
//   password: 'root',  
//   database: 'charityevents_db', 
// })

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected!');
// });

module.exports = {
	getConnection: ()=>{
	return mysql.createConnection({
		host:dbDetails.host,
		user:dbDetails.user,
		password:dbDetails.password,
		database:dbDetails.database	
	});
}
}