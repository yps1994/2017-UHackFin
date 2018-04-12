/** 
 * @api {get} /history/:id Get history data By ID
 * @apiName GetHistDataByStockID
 * @apiGroup STOCKS
 * @apiDescription Get the raw data by stock id sorted by date. 
 * Only 7 days will be provided.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "OK",
 *       "data": [{
 *          "id": "0001.HK",
 *          "date": "2017-09-24T16:00:00.000Z",
 *          "high": 99.85,
 *          "low": 99,
 *          "open": 99.3,
 *          "close": 99.3,
 *          "STOCKCODE": "0001.HK",
 *          "NAME_ENG": "CKH HOLDINGS",
 *          "NAME_CHI": "長和",
 *          "BOARD_LOT": 500
 *       }, ... ] 
 *     }
 */
module.exports = server => {
  server.get('/stock/:stockSymbol/history', (req, res, next) => {
    const connetor = req.con;
    const symbol = req.params.stockSymbol;
    const start = req.query.start;
    const end = req.query.end;
    connetor.query('SELECT * FROM history AS t1 INNER JOIN detail AS t2 ON t1.id = t2.stockcode \
    WHERE t1.id = ? AND t1.date IN (?, ?)', [symbol, start, end], (err, rows) => {
      if (err) {
        console.log(err);
        res.send(200);
      } else {
        res.json(rows);
      }
    });
    return next();
  });
};
