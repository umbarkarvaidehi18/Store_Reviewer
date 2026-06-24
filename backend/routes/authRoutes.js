const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validations/validator');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.put('/change-password', authenticateToken, changePasswordValidator, changePassword);

module.exports = router;
