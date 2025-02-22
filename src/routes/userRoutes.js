const route = require('express').Router();
const { userController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

route.post('/sign_in', userController.login)
route.post('/sign_up', userController.createUser);

route.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.email}!` });
});

module.exports = route;
