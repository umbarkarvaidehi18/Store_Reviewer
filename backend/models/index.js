const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// User hasMany Ratings
User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Store hasMany Ratings
Store.hasMany(Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

// Store belongsTo User as Owner
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });
User.hasMany(Store, { foreignKey: 'ownerId', as: 'OwnedStores', onDelete: 'CASCADE' });

module.exports = {
  User,
  Store,
  Rating
};
