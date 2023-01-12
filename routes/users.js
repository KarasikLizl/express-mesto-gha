import express from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updateProfile,
  updateAvatar,
} from '../controllers/users.js';

const usersRoutes = express.Router();

usersRoutes.get('/users', express.json(), getUsers);

usersRoutes.get('/users/:userId', express.json(), getUserById);

// usersRoutes.post('/users', express.json(), createUser);

usersRoutes.patch('/users/me', updateProfile);

usersRoutes.patch('/users/me/avatar', updateAvatar);

export default usersRoutes;
