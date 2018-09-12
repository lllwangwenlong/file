var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getJsonp', (req, res) => {
  res.jsonp({
      data: '一些信息',
      msg: '吃饭睡觉打代码',
      code: 200
  })
})

router.get('/getMsg', (req, res) => {
    res.json({
        data: '一些信息',
        msg: '吃饭睡觉打代码',
        code: 200
    })
})

module.exports = router;
