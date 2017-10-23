/** Fetch Yahoo finance data and store it to MYSQL_DATABASE.stocks_raw
 * Run:
 *      node fetch_yahoo_data.js
 * Note:
 *      1. MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_HOST must be set
 *      2. when, mysql, moment and yahoo-finance will be used, if the package is missing, 
 *         run `npm install <package>`
 *      3. DURATION and SYMBOLS are inputs, which can be modified accordingly
 */

var when = require('when');
var mysql = require('mysql');
var moment = require('moment');
var yahooFinance = require('yahoo-finance');

// fetch range
const DURATION = 7
const SYMBOLS = [
  '0001.HK',
  '0002.HK',
  '0003.HK',
  '0700.HK'
];

// Connect to database
function connectDB(workspace) {
  // create connection configuration
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
  });

  // create connection promise
  return when.promise(function (resolve, reject) {
    db.connect(function (err) {
      if (err) {
        reject(err);
      } else {
        workspace.db = db;
        resolve(workspace);
      }
    });
  });
}

// Fetch data from Yahoo Finance
function fetchData(workspace) {
  return when.promise(function (resolve, reject) {
    // fetch data from -1+ duration days to -1 days
    yahooFinance.historical({
      symbols: SYMBOLS,
      from: moment().subtract(DURATION + 1, 'days').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      period: 'd',
    }, function (err, quotes) {
      if (err) {
        reject(err);
      } else {
        workspace.data = quotes;
        resolve(workspace);
      }
    });
  });
}

// Parsing data
function parseData(workspace) {
  // reformat data into sql statement
  workspace.records = [];
  Object.keys(workspace.data).forEach(function (key) {
    workspace.data[key].forEach(function (record) {
      if (record.open !== null && record.close !== null) {
        workspace.records.push(`REPLACE INTO stocks_raw (id, date, high, low, open, close) \
      VALUES ('${record.symbol}', '${moment(record.date).format('YYYY-MM-DD')}', ${record.high}, \
      ${record.low}, ${record.open}, ${record.close});`)
      }
    });
  });

  // remove the records with undefined
  workspace.records = workspace.records.filter(function (element) {
    return (typeof element !== 'undefined');
  });
  return workspace;
}


// Insert data to database
function insertData(workspace) {
  // insert the data to sqldb asychronously
  var promises = when.map(workspace.records, function (record) {
    return when.promise(function (resolve, reject) {
      console.log(record);
      workspace.db.query(record, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(record);
        }
      });
    });
  });

  // check if all the insertion are successfull
  return when.promise(function (resolve, reject) {
    promises.done(function (result, err) {
      if (err) {
        reject(err);
      } else {
        resolve(workspace);
      }
    });
  });
}

// done and disconent db
function clean(workspace) {
  workspace.db.end();
  return workspace;
}

// main program
connectDB({})
  .then(fetchData)
  .then(parseData)
  .then(insertData)
  .then(clean)
  .done(function (result, err) {
    if (err) {
      console.log(err);
    }
  });
