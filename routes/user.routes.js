
// Import express's router
const router = require('express').Router();

const authController = require('../controllers/auth.controller.js');

// If /api/user/register (Cause called with path /api/user/)
router.post("/register", authController.signUp);

module.exports = router;