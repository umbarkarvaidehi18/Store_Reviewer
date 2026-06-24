const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

const getStoresForUser = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    // Filters
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ['id', 'userId', 'rating']
        }
      ]
    });

    const formattedStores = stores.map(store => {
      const ratings = store.Ratings || [];
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(1)) : 0;
      const myRating = ratings.find(r => r.userId === userId);

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
        myRating: myRating ? { id: myRating.id, rating: myRating.rating } : null
      };
    });

    return res.status(200).json(formattedStores);
  } catch (error) {
    console.error('User Get Stores Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching stores.' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    // Check if user has already rated this store
    const existingRating = await Rating.findOne({ where: { userId, storeId } });
    if (existingRating) {
      return res.status(400).json({ 
        error: 'You have already rated this store. Please update your existing rating instead.' 
      });
    }

    const newRating = await Rating.create({
      userId,
      storeId,
      rating
    });

    return res.status(201).json({
      message: 'Rating submitted successfully.',
      rating: newRating
    });
  } catch (error) {
    console.error('Submit Rating Error:', error);
    return res.status(500).json({ error: 'An error occurred while submitting rating.' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const ratingToUpdate = await Rating.findByPk(id);
    if (!ratingToUpdate) {
      return res.status(404).json({ error: 'Rating not found.' });
    }

    // Verify rating belongs to the user
    if (ratingToUpdate.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only edit your own ratings.' });
    }

    ratingToUpdate.rating = rating;
    await ratingToUpdate.save();

    return res.status(200).json({
      message: 'Rating updated successfully.',
      rating: ratingToUpdate
    });
  } catch (error) {
    console.error('Update Rating Error:', error);
    return res.status(500).json({ error: 'An error occurred while updating rating.' });
  }
};

module.exports = {
  getStoresForUser,
  submitRating,
  updateRating
};
