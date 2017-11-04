var express = require('express');
var router = express.Router();

router.get('/hot/:stockID', function (req, res) {
  var db = req.con;
  var stockID = req.params.stockID;
  var workspace = {};
  db.query('SELECT StockNO, COUNT(*) as count FROM user_data WHERE StockNO = ? GROUP BY StockNO', stockID, function (err, val) {
    if (err || val.length === 0 ) {
      res.json({ 'status': 'error' });
    } else {
      console.log(val);
      workspace.stockid = val[0].StockNO;
      workspace.count = val[0].count;
      db.query('SELECT count(DISTINCT ID) as usercount FROM user_data', function (err, val) {
        if (err) {
          res.json({ 'status': 'error' });
        }
        workspace.usercount = val[0].usercount;
        workspace.hot = workspace.count / workspace.usercount;
        res.json({'status': 'OK', 'data': workspace});
      });
    }
  });
});

module.exports = router;
