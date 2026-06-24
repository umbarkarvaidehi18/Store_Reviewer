const { Store, Rating, User } = require('../models');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find all stores owned by this user
    const stores = await Store.findAll({
      where: { ownerId },
      include: [
        {
          model: Rating,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    const storesData = stores.map(store => {
      const ratings = store.Ratings || [];
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(1)) : 0;

      const userReviews = ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        user: r.User ? {
          id: r.User.id,
          name: r.User.name,
          email: r.User.email
        } : { id: null, name: 'Anonymous', email: 'N/A' }
      }));

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
        reviews: userReviews
      };
    });

    // Compute overall stats across all owned stores
    const overallTotalRatings = storesData.reduce((sum, s) => sum + s.totalRatings, 0);
    const overallSumRatings = storesData.reduce((sum, s) => sum + (s.averageRating * s.totalRatings), 0);
    const overallAverageRating = overallTotalRatings > 0 ? parseFloat((overallSumRatings / overallTotalRatings).toFixed(1)) : 0;

    return res.status(200).json({
      stores: storesData,
      overallAverageRating,
      overallTotalRatings,
      totalStoresOwned: storesData.length
    });
  } catch (error) {
    console.error('Owner Dashboard Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching owner dashboard.' });
  }
};

module.exports = {
  getOwnerDashboard
};
