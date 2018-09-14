var express = require('express');
var router = express.Router();
var cors = require('cors');
var http = require('http');
var proxy = require('http-proxy-middleware');
// 首先当匹配到了/api开头的地址会去转发到另一台服务器
// 同时带上整个的路径,所以,请求的地址变成了http://localhost:3001/server1
router.use('/api', proxy({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '/api' : '/'
    }
    }
))

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true
}

router.use(cors(corsOptions))

// router.all('*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
//     res.header('Access-Control-Allow-Credentials', true)
//     res.header('Access-Control-Allow-Headers', 'content-type')
//     res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS')
//     next()
// })

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
    // res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    // res.header('Access-Control-Allow-Origin', '*')
    res.json({
        data: '一些信息',
        msg: '吃饭睡觉打代码',
        code: 200
    })
})

// router.options('/noSimple', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
//     res.header('Access-Control-Allow-Credentials', true)
//     res.header('Access-Control-Allow-Headers', 'content-type')
//     res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS')
//     res.send()
// })
router.post('/noSimple', (req, res) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.json({
        data: '一些信息',
        msg: '吃饭睡觉打豆豆',
        code: 200
    })
})

router.get('/proxy', (req, response) => {
    http.get('http://localhost:3001/server1',function(res){
        let rawData = ''
        res.on('data', (chunk) => {rawData += chunk;});
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
                response.json(parsedData)
            }catch (e) {
                console.log(e.message);
            }
        });
    })
})

module.exports = router;
