const { Router } = require('express');

const controller = require('src/controllers/data');
const userLimiter = require('server/main/middleware/userRateLimiter');

const router = Router();

// 路由
// GET
router.get('/', userLimiter, controller.getOne);

module.exports = router;
