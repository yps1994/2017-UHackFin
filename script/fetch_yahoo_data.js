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
const DURATION = 1;
const SYMBOLS = [
  '0001.HK',
  '0002.HK',
  '0003.HK',
  '0004.HK',
  '0005.HK',
  '0006.HK',
  '0011.HK',
  '0012.HK',
  '0016.HK',
  '0017.HK',
  '0019.HK',
  '0023.HK',
  '0027.HK',
  '0066.HK',
  '0083.HK',
  '0101.HK',
  '0135.HK',
  '0144.HK',
  '0151.HK',
  '0175.HK',
  '0267.HK',
  '0288.HK',
  '0293.HK',
  '0386.HK',
  '0388.HK',
  '0688.HK',
  '0700.HK',
  '0762.HK',
  '0823.HK',
  '0836.HK',
  '0857.HK',
  '0883.HK',
  '0939.HK',
  '0941.HK',
  '0992.HK',
  '1038.HK',
  '1044.HK',
  '1088.HK',
  '1109.HK',
  '1113.HK',
  '1299.HK',
  '1398.HK',
  '1928.HK',
  '2018.HK',
  '2318.HK',
  '2319.HK',
  '2388.HK',
  '2628.HK',
  '3328.HK',
  '3988.HK'
];

// Connect to database
function connectDB (workspace) {
  // create connection configuration
  var db = mysql.createConnection({
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
function fetchData (workspace) {
  return when.promise(function (resolve, reject) {
    // fetch data from -1+ duration days to -1 days
    yahooFinance.historical({
      symbols: SYMBOLS,
      from: moment().subtract(DURATION + 1, 'days').format('YYYY-MM-DD'),
      to: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      period: 'd'
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
function parseData (workspace) {
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
function insertData (workspace) {
  // insert the data to sqldb asychronously
  var promises = when.map(workspace.records, function (record) {
    return when.promise(function (resolve, reject) {
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
function clean (workspace) {
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
