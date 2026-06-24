const app = require('./app');
const { sequelize, initDatabase } = require('./config/db');
const { User, Store, Rating } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function seedDatabase() {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database with default records...');

    // Hash password
    const hashedPassword = await bcrypt.hash('Password@123', 10);

    // Create Admin
    const admin = await User.create({
      name: 'System Administrator Principal Account', // 38 chars
      email: 'admin@example.com',
      password: hashedPassword,
      address: '123 Admin Command Center HQ, Cyber City, Silicon Valley',
      role: 'Admin'
    });

    // Create Store Owner
    const owner = await User.create({
      name: 'Store Owner Representative John', // 31 chars
      email: 'owner@example.com',
      password: hashedPassword,
      address: '456 Main Street, Avenue Road, Tech City',
      role: 'Store Owner'
    });

    // Create User
    const user = await User.create({
      name: 'Regular Customer Account Jane', // 30 chars
      email: 'user@example.com',
      password: hashedPassword,
      address: '789 Broad Street, Sector 4, Garden City',
      role: 'User'
    });

    // Create another User
    const user2 = await User.create({
      name: 'Secondary Customer Account Robert', // 33 chars
      email: 'user2@example.com',
      password: hashedPassword,
      address: '101 Pine Road, Apartment 4B, City Centre',
      role: 'User'
    });

    console.log('Users seeded.');

    // Create Stores
    const store1 = await Store.create({
      name: 'Super Star Electronics Outlet', // 30 chars
      email: 'star_electronics@example.com',
      address: 'Sector 5 Electronics Mall, Tech City',
      ownerId: owner.id
    });

    const store2 = await Store.create({
      name: 'Organic Harvest Grocery Market', // 31 chars
      email: 'organic_harvest@example.com',
      address: 'Green Valley Plaza, Sector 12, Garden City',
      ownerId: owner.id
    });

    console.log('Stores seeded.');

    // Create Ratings
    await Rating.create({
      userId: user.id,
      storeId: store1.id,
      rating: 5
    });

    await Rating.create({
      userId: user2.id,
      storeId: store1.id,
      rating: 4
    });

    await Rating.create({
      userId: user.id,
      storeId: store2.id,
      rating: 3
    });

    console.log('Ratings seeded. Database seeding completed successfully.');
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
}

async function startServer() {
  try {
    // 1. Ensure database exists
    await initDatabase();

    // 2. Authenticate Sequelize
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // 3. Sync models (alter/force: false for production safety)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // 4. Seed default data
    await seedDatabase();

    // 5. Start Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
