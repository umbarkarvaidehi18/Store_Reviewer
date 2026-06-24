const express = require('express');
const router = express.Router();
const { getStoresForUser, submitRating, updateRating } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { ratingValidator } = require('../validations/validator');

// Protect all routes to User role only
router.use(authenticateToken, authorizeRoles('User'));

// GET /api/stores is under user routes since users view stores.
router.get('/stores', getStoresForUser);

router.post('/ratings', ratingValidator, submitRating);
router.put('/ratings/:id', ratingValidator, updateRating);

module.exports = router;
