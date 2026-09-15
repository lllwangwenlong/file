var express = require('express');
var router = express.Router();

// 内存存储
var todos = [];
var nextId = 1;

// GET /todos — 获取所有待办事项
router.get('/', function(req, res, next) {
  res.json({
    code: 200,
    data: todos
  });
});

// POST /todos — 创建待办事项
// Body: { name: string, description: string }
router.post('/', function(req, res, next) {
  var name = (req.body.name || '').trim();
  var description = (req.body.description || '').trim();

  if (!name) {
    return res.status(400).json({
      code: 400,
      message: '待办事项名称不能为空'
    });
  }

  var todo = {
    id: nextId++,
    name: name,
    description: description,
    createdAt: new Date().toISOString()
  };

  todos.push(todo);

  res.status(201).json({
    code: 201,
    data: todo
  });
});

module.exports = router;