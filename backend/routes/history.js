const logger = require('../lib/logger');
const gate = require('../lib/gate');
const msg = require('../lib/error-message');
const decoder = require('../lib/decoder');

module.exports = server => {
  /** 
   * @api {get} /stock/:stock-symbol/history?start=:start&end=:end&token=:token GetHistPrice
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost/stock/0001.HK/history?start=2018-04-01&end=2018-04-05&token=eyJ0eX
   * @apiVersion 0.0.1
   * @apiName GetHistPrice
   * @apiGroup Stock
   * @apiDescription Get historical stock quote prices by stock symbol. 
   * @apiParam {String} stock-symbol Stock symbol
   * @apiParam {String} start Start date.
   * @apiParam {String} [end] End date, If it is not specified, current date will be used.
   * @apiParam {String} token JSON Web Token.
   * @apiSuccess {String} symbol Stock symbol
   * @apiSuccess {String} name_eng Name in Chinese
   * @apiSuccess {String} name_chi Name in English
   * @apiSuccess {Number} board_lot Board lot size
   * @apiSuccess {Object[]} daily List of historical daily dataq
   * @apiSuccess {String} daily.date Date
   * @apiSuccess {Number} daily.high The highest price
   * @apiSuccess {Number} daily.low The lowest price
   * @apiSuccess {Number} daily.open The opening price
   * @apiSuccess {Number} daily.close The closing price
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "symbol": "0001.HK",
   *       "name_eng": "CKH HOLDINGS",
   *       "name_chi": "長和",
   *       "board_lot": 500,
   *       "daily": [{
   *          "date": "2018-04-02T16:00:00.000Z",
   *          "high": 93.9,
   *          "low": 92.25,
   *          "open": 93,
   *          "close": 93
   *       }, ... ]
   *     }
   * @apiError 400 Bad Request.
   * @apiError 401 Invalid token.
   * @apiError 404 No data available.
   * @apiError (serverError) 503 Server error, which is usually related to unavailable database.
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "No data available."
   *     }
   */
  server.get('/stock/:stockSymbol/history', decoder, (req, res, next) => {
    const connetor = req.con;
    const symbol = req.params.stockSymbol || '';
    const start = req.query.start || '';
    const end = req.query.end || '2047-07-01';

    if (!gate.isValidDate(start) || !gate.isValidDate(end)) {
      res.json(400, msg.BadRequstError);
      return next();
    }
    connetor.query('SELECT * FROM history AS t1 INNER JOIN detail AS t2 ON t1.id = t2.stockcode \
    WHERE t1.id = ? AND t1.date BETWEEN ? AND ?', [symbol, start, end], (err, data) => {
      if (err) {
        logger.warn(err);
        res.json(503, msg.ServiceError);
      } else if (data.length === 0) {
        res.json(404, msg.NoDataAvailableError);
      } else {
        const formated_data = {
          'symbol': data[0].stockcode,
          'name_eng': data[0].name_eng,
          'name_chi': data[0].name_chi,
          'board_lot': data[0].board_lot,
          'daily': data.map(x => {
            return { 'date': x.date, 'high': x.high, 'low': x.low, 'open': x.open, 'close': x.close };
          })
        };
        res.charSet('utf-8');
        res.json(formated_data);
      }
    });
    return next();
  });
};
