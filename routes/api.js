var express = require('express');
var router = express.Router();
const DataArea = require('../app/data-area'); 

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/provinces', DataArea.provinces);
router.get('/cities', DataArea.cities);
router.get('/districts', DataArea.districts);
router.get('/villages', DataArea.villages);

module.exports = router;
