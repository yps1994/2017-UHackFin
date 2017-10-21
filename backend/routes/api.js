var express = require('express');
var router = express.Router();

/** 
 * @api {get} /api/raw Get Raw stock data
 * @apiName GetRawData
 */
router.get('/raw', function(req, res) {
    var db = req.con;
    db.query('SELECT * FROM stocks_raw', function(err, rows) {
        if (err) {
            console.log(err);
            res.json({'status': 'error'});
        } else {
            res.json({'status': 'OK', 'data': rows});
        }  
    })
});

module.exports = router;