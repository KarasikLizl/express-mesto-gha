import jwt from 'jsonwebtoken';
import NotAuthorizedError from '../errors/unauthorized.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Необходима авторизация');
  }

  const extractBearerToken = (header) => header.replace('Bearer ', '');
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret-key');
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};