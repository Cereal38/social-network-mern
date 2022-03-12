
// Import express's router
const router = require('express').Router();

const authController = require('../controllers/auth.controller.js');
const userController = require('../controllers/user.controller.js');

// If /api/user/register (Cause called with path /api/user/)
router.post('/register', authController.signUp);

// user DB
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.put('/:id', userController.updateUser);


module.exports = router;