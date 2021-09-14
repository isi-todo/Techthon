var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
  res.json({
    status_code : 200,
    method : 'GET'
  });
});

/* POST */
router.post('/', function(req, res, next) {
  res.json({
    status_code : 200,
    method : 'POST'
  });
});

module.exports = router;