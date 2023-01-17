import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
  getMyProfile,
} from '../controllers/users.js';

const usersRoutes = express.Router();

usersRoutes.get('/users', express.json(), getUsers);

usersRoutes.get('/users/me', express.json(), getMyProfile);

usersRoutes.get('/users/:userId', express.json(), celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().min(24)
      .max(24),
  }),
}), getUserById);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/),
  }),
}), updateAvatar);

export default usersRoutes;
