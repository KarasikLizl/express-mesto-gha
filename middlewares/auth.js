import jwt from 'jsonwebtoken';
import NotAuthorizedError from '../errors/unauthorized.js';

export const auth = (req, res, next) => {
  const { authorization } = req.body;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Пожалуйста, авторизуйтесь');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret-key');
  } catch (err) {
    throw new NotAuthorizedError('Пожалуйста, авторизуйтесь');
  }
  req.user = payload;
  next();
}