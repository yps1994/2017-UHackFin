var csv = require('csvtojson');
var fs = require('fs');
var mysql = require('mysql');

function connectDB() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
  });
}

function readCSV(src, next) {
  csv().fromFile(src)
    .on('end_parsed', function(json){
      next(json);
    })
    .on('done', function(err) {
      if (err) {
        throw err;
      }
    });
}


module.exports = { connectDB: connectDB, readCSV: readCSV};
