#!/usr/bin/env node
/* Fetch Yahoo finance data and store it to MYSQL_DATABASE.daily
 * Run:
 *      node fetch_yahoo_data.js
 * Note:
 *      1. MYSQL_USER, MYSQL_PASSWORD must be set
 *      2. MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE has default value
 *      2. DURATION can be changed according to task details
 */

const mysql = require('mysql');
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

// Create a connection
const connectDB = workspace => {
  const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'stock'
  });

  return new Promise((resolve, reject) => {
    db.connect(err => {
      if (err) {
        reject(err)
      } else {
        workspace.db = db;
        logger.info('Connected to database.')
        resolve(workspace);
      }
    });
  });
};

// fetch stock symbols
const fetchSymbols = workspace => {
  return new Promise((resolve, reject) => {
    workspace.db.query('SELECT STOCKCODE FROM detail', (err, result) => {
      if (err) {
        reject(err)
      } else {
        // only HK stocks are allowed
        workspace.symbols = result.map(x => x.STOCKCODE + '.HK');
        logger.info('Fetched all stocks IDs.')
        resolve(workspace);
      }
    })
  })
}

// Fetch Yahoo Stock Data
const fetchYahooData = workspace => {
  return new Promise((resolve, reject) => {
    // fetch data from -1+ duration days to -1 days
    yahooFinance.historical({
      symbols: workspace.symbols,
      from: moment().subtract(DURATION + 1, 'days').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      period: 'd'
    }, (err, quotes) => {
      if (err) {
        reject(err);
      } else {
        workspace.quotes = quotes;
        logger.info('Fetched Yahoo Stocks Data.')
        resolve(workspace);
      }
    });
  });
}

// InsertData to daily table
// We use bulk insert to improve the performance
const insertData = workspace => {
  const sql_prefix = 'REPLACE INTO daily (id, date, high, low, open, close) VALUES ?';
  let records = [];
  Object.keys(workspace.quotes).forEach(function (key) {
    workspace.quotes[key].forEach(function (record) {
      if (record.open !== null && record.close !== null) {
        records.push([record.symbol, moment(record.date).format('YYYY-MM-DD'), record.high,
        record.low, record.open, record.close]);
      }
    });
  });
  return new Promise((resolve, reject) => {
    workspace.db.query(sql_prefix, [records], err => {
      if (err) {
        reject(err);
      } else {
        logger.info('Data is inserted into table daily');
        resolve(workspace);
      }
    })
  })
  return workspace;
}

// Close the connection
const clean = workspace => {
  workspace.db.end()
  return workspace
}


// main program
connectDB({})
  .then(fetchSymbols)
  .then(fetchYahooData)
  .then(insertData)
  .then(clean)
  .catch(err => {
    logger.error(err);
  })
