#!/usr/bin/env node
/** Read stock list and store it to MYSQL_DATABASE.stocks_list
 * Run:
 *      node read_stocks_lists.js
 * Note:
 *      1. MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_HOST must be set
 *      2. when, mysql, moment and yahoo-finance will be used, if the package is missing, 
 *         run `npm install`
 *      3. DURATION and CSVPATH are inputs, which can be modified accordingly
 */

var when = require('when');
var utils = require('./utils')

const CSVPATH = 'csv/stocks_list_HK.csv'

// read the stock list
function readList(workspace) {
  return when.promise(function (resolve, reject) {
    utils.readCSV(CSVPATH, function (rows) {
      workspace.jsons = rows;
      resolve(workspace);
    });
  });
}

// Connect to database
function connectDB (workspace) {
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

function parseData (workspace) {
  // reformat data
  var data = workspace.jsons.map(function(row) {
    return {
      // hard code for case HK only
      STOCKCODE: row.STOCKCODE + '.HK',
      NAME_ENG: row.NAME_ENG,
      NAME_CHI: row.NAME_CHI,
      BOARD_LOT: parseInt(row.BOARD_LOT.replace(',', ''))
    }
  });
  
  workspace.records = data.map(function(record) {
    return `REPLACE INTO stocks_list (STOCKCODE, NAME_ENG, NAME_CHI, BOARD_LOT) \
    VALUES ("${record.STOCKCODE}", "${record.NAME_ENG}", "${record.NAME_CHI}", ${record.BOARD_LOT})`
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

function clean(workspace) {
	workspace.db.end();
	return workspace;
}

readList({})
  .then(connectDB)
  .then(parseData)
  .then(insertData)
	.then(clean)
  .done(function (result, err) {
    if (err) {
      console.log(err);
    }
  });
