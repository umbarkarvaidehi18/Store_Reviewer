const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Protect to Store Owner role only
router.use(authenticateToken, authorizeRoles('Store Owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
