const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getUsers, 
  getUserById, 
  createUser, 
  getStores, 
  getStoreById, 
  createStore 
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { registerValidator, storeValidator } = require('../validations/validator');

// Protect all routes under /api/admin to Admin role only
router.use(authenticateToken, authorizeRoles('Admin'));

router.get('/dashboard', getDashboardStats);

router.get('/users', getUsers);
router.post('/users', registerValidator, createUser);
router.get('/users/:id', getUserById);

router.get('/stores', getStores);
router.post('/stores', storeValidator, createStore);
router.get('/stores/:id', getStoreById);

module.exports = router;
