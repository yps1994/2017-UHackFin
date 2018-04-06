#!/usr/bin/env node
/* Fetch Yahoo finance data and store it to MYSQL_DATABASE.daily
 * Run:
 *      node fetch_yahoo_data.js
 * Note:
 *      1. MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_HOST must be set
 *      2. DURATION and CSVPATH are inputs, which can be modified accordingly
 */

const mysql = require('mysql');
const when = require('when');
const moment = require('moment');
const yahooFinance = require('yahoo-finance');
const winston = require('winston');

// fetch range
const DURATION = 1;

// setting logger
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: process.env.NODE_ENV === 'development' ? 'verbose' : 'info',
    })
  ]
});

// Connect to database
const connectDB = async() => {
  // create connection configuration
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'stock'
  }).connect((err) => {
    if (err) {
      logger.error('Cannot connect to database.')
      throw err
    };
  });
}


// main program
connectDB().then(clean)
