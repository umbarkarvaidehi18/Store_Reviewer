const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'User'
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'store_rating_secret_key_2026_xyz',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'store_rating_secret_key_2026_xyz',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password.' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ error: 'An error occurred while changing password.' });
  }
};

module.exports = {
  register,
  login,
  changePassword
};
