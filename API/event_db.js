const mysql = require('mysql2')
var bodyParser = require('body-parser');
var http = require('http');

var dbDetails = require("./db-details");


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