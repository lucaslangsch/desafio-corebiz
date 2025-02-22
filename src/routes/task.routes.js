const route = require('express').Router();
const { taskController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

route.get('/list', authMiddleware, taskController.getAllTasks);
route.post('/create', authMiddleware, taskController.createTask);
route.patch('/:id', authMiddleware, taskController.updateTask);
route.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = route;