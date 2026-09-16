import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

export const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).json({ error: 'Token not provided.' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        throw new Error('Error validating token.');
      }

      req.userId = decoded.id;
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  return next();
};
