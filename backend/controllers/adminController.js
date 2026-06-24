const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching dashboard statistics.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, role, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Filters
    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Sort column validation
    const validSortColumns = ['name', 'email', 'role', 'createdAt'];
    const sortField = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset
    });

    return res.status(200).json({
      users,
      total: count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Rating,
          include: [{ model: Store, attributes: ['name', 'address'] }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Admin Get User Details Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching user details.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'User'
    });

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address
      }
    });
  } catch (error) {
    console.error('Admin Create User Error:', error);
    return res.status(500).json({ error: 'An error occurred while creating user.' });
  }
};

const getStores = async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Filters
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const validSortColumns = ['name', 'email', 'address', 'createdAt'];
    const sortField = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: stores } = await Store.findAndCountAll({
      where,
      include: [
        { model: User, as: 'Owner', attributes: ['id', 'name', 'email'] }
      ],
      order: [[sortField, sortOrder]],
      limit: limitNum,
      offset
    });

    return res.status(200).json({
      stores,
      total: count,
      pages: Math.ceil(count / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('Admin Get Stores Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching stores.' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id, {
      include: [
        { model: User, as: 'Owner', attributes: ['id', 'name', 'email'] },
        {
          model: Rating,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

    return res.status(200).json(store);
  } catch (error) {
    console.error('Admin Get Store Details Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching store details.' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if store owner actually exists and is a Store Owner
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Store Owner not found.' });
    }

    if (owner.role !== 'Store Owner') {
      return res.status(400).json({ error: 'The selected user is not a Store Owner.' });
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    return res.status(201).json({
      message: 'Store created successfully.',
      store: newStore
    });
  } catch (error) {
    console.error('Admin Create Store Error:', error);
    return res.status(500).json({ error: 'An error occurred while creating store.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  getStoreById,
  createStore
};
