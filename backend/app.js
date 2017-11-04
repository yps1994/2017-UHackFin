var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');

var index = require('./routes/index');
var stocks = require('./routes/stocks');
var hot = require('./routes/hot');

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

con.connect(function (err) {
  if (err) {
    console.error('Mysql connection error. Aborted.');
    process.exit(1);
  }
  console.log('Mysql connection success.');
});

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  req.con = con;
  next();
});

app.use('/', index);
app.use('/stocks', stocks);
app.use('/stocks', hot);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({'status': err.status});
});

module.exports = app;
