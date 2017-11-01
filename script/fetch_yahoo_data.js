#!/usr/bin/env node
/** Fetch Yahoo finance data and store it to MYSQL_DATABASE.stocks_raw
 * Run:
 *      node fetch_yahoo_data.js
 * Note:
 *      1. MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_HOST must be set
 *      2. when, mysql, moment and yahoo-finance will be used, if the package is missing, 
 *         run `npm install`
 *      3. DURATION and CSVPATH are inputs, which can be modified accordingly
 */

var when = require('when');
var moment = require('moment');
var yahooFinance = require('yahoo-finance');
var utils = require('./utils')

// fetch range
const DURATION = 1;
const CSVPATH = 'csv/stocks_id.csv'

// Read stocks symbols
function readSymbols(workspace) {
	return when.promise(function (resolve, reject) {
		utils.readCSV(CSVPATH, function (rows) {
			workspace.symbols = rows.map(function (row) {
				return row.ids;
			});
			resolve(workspace);
		});
	});
}

// Connect to database
function connectDB(workspace) {
	// create connection configuration
	var db = utils.connectDB();

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
			symbols: workspace.symbols,
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

	return workspace;
}

// Insert data to database
function insertData(workspace) {
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
function clean(workspace) {
	workspace.db.end();
	return workspace;
}

// main program
readSymbols({})
	.then(connectDB)
	.then(fetchData)
	.then(parseData)
	.then(insertData)
	.then(clean)
	.done(function (result, err) {
		if (err) {
			console.log(err);
		}
		console.log("Finished fetching data at " + moment().format())
	});
