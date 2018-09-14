var express = require('express');
var router = express.Router();

const users = [
    {
        username: 'wang',
        password: '123456'
    },
    {
        username: 'liang',
        password: '654321'
    }
]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'content-type')
    res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS')
    res.send()
})
router.post('/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const {username, password} = req.body
  let loginSuccess = false
  console.log(username, password)

  users.forEach(item => {
    if(item.username === username&&item.password === password)
        loginSuccess = true

  })

    if(loginSuccess){
      res.json({
          code: 200,
          msg: '登陆成功'
      })
    }else {
        res.json({
            code: 500,
            msg: '登陆失败'
        })
    }
})

router.get('/server1', (req, res) => {
    res.json({
        data: '一些信息',
        msg: '吃饭睡觉打豆豆',
        code: 200
    })
})


module.exports = router;
