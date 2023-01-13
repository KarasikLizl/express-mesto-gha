import jwt from 'jsonwebtoken';
import NotAuthorizedError from '../errors/unauthorized.js';

export const auth = (req, res, next) => {

  const token = req.headers.authorization;

  if(!token) {
    next(new NotAuthorizedError('Пожалуйста, авторизуйтесь'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret-key');
  } catch (err) {
    next(new NotAuthorizedError('Нет доступа'));
  }
  req.user = payload;
  next();
}