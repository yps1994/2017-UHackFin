var express = require('express');
var router = express.Router();

/** 
 * @api {get} /stocks/raw/:id Get Raw data By ID
 * @apiName GetRawDataByStockID
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
 *          "close": 99.3
 *       }, ... ] 
 *     }
 */
router.get('/raw/:stockID', function (req, res) {
  var db = req.con;
  var stockID = req.params.stockID;
  db.query('SELECT * FROM stocks_raw WHERE id = ? ORDER BY date LIMIT 7', stockID, function (err, rows) {
    if (err) {
      console.log(err);
      res.json({ 'status': 'error' });
    } else {
      res.json({ 'status': 'OK', 'data': rows });
    }
  })
});

/** 
 * @api {get} /stocks/raw_d/:id/?d1=:date&d2=:date Get Raw data By ID By date
 * @apiName GetRawDataByStockIDBydate
 * @apiGroup STOCKS
 * @apiDescription Get the raw data by stock id and by date.
 * At most two query dates are supported.
 * :date should be in YYYY-MM-DD form. 
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
 *          "close": 99.3
 *       }, ...]
 *     }
 */
router.get('/raw_d/:stockID', function (req, res) {
  var db = req.con;
  var stockID = req.params.stockID;
  var queryDate1 = req.query.d1;
  var queryDate2 = req.query.d2;
  db.query('SELECT * FROM stocks_raw WHERE id = ? AND date IN (?, ?)',
    [stockID, queryDate1, queryDate2], function (err, rows) {
      if (err) {
        console.log(err);
        res.json({ 'status': 'error' });
      } else {
        res.json({ 'status': 'OK', 'data': rows });
      }
    })
});

module.exports = router;
