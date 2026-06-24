const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUppercase && hasSpecial;
};

const validateName = (name) => {
  return name && name.trim().length >= 20 && name.trim().length <= 60;
};

const validateAddress = (address) => {
  if (address === undefined || address === null) return false;
  return address.trim().length <= 400;
};

const registerValidator = (req, res, next) => {
  const { name, email, password, address, role } = req.body;

  if (!validateName(name)) {
    return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be 8 to 16 characters long, contain at least one uppercase letter, and at least one special character.' 
    });
  }

  if (!validateAddress(address)) {
    return res.status(400).json({ error: 'Address must not exceed 400 characters.' });
  }

  if (role && !['Admin', 'User', 'Store Owner'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Allowed values are: Admin, User, Store Owner.' });
  }

  next();
};

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  next();
};

const changePasswordValidator = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required.' });
  }

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ 
      error: 'New password must be 8 to 16 characters long, contain at least one uppercase letter, and at least one special character.' 
    });
  }

  next();
};

const storeValidator = (req, res, next) => {
  const { name, email, address, ownerId } = req.body;

  if (!validateName(name)) {
    return res.status(400).json({ error: 'Store Name must be between 20 and 60 characters.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!validateAddress(address)) {
    return res.status(400).json({ error: 'Address must not exceed 400 characters.' });
  }

  if (!ownerId) {
    return res.status(400).json({ error: 'Store Owner (ownerId) is required.' });
  }

  next();
};

const ratingValidator = (req, res, next) => {
  const { storeId, rating } = req.body;

  if (!storeId) {
    return res.status(400).json({ error: 'Store ID is required.' });
  }

  const ratingVal = parseInt(rating, 10);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
  }

  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  storeValidator,
  ratingValidator
};
