const restify = require('restify');
const morgan = require('morgan');


var server = restify.createServer();
server.use(morgan('common'));

server.get('/', (req, res, next) => {
  res.send(200);
  return next();
});

module.exports = server;
