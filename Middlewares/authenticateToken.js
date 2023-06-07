const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.userId = decoded.userId; // Attach the user ID to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
