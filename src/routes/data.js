const { Router } = require('express');

const router = Router();
const controller = require('src/controllers/data');

// 路由
// GET
router.get('/', controller.getOne);

module.exports = router;
