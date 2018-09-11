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

router.post('/login', (req, res) => {
  console.log(req.body)
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


module.exports = router;
