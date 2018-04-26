const restify = require('restify');
const morgan = require('morgan');
const _ = require('lodash');

const routers = require('./routes');
const logger = require('./lib/logger');
const connector = require('./lib/connector');


// create database connection
connector.connect(function (err) {
  if (err) {
    logger.error('Cannot connect to ' + connector.config.host + ':' + connector.config.database);
    throw err;
  }
  logger.info('Connected to database ' + connector.config.host + ':' + connector.config.database);
});

// create server 
var server = restify.createServer({
  name: 'api-portfolio',
  version: '0.0.1'
});

// extended plugins
server.use(morgan('common'));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.queryParser());

// add connector in request attribute
server.use((req, res, next) => {
  req.con = connector;
  return next();
});

// apply all routers
_.mapValues(routers, router => {
  router(server);
});

module.exports = server;
