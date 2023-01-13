import express from 'express';
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

usersRoutes.get('/users/:userId', express.json(), getUserById);

usersRoutes.patch('/users/me', updateProfile);

usersRoutes.patch('/users/me/avatar', updateAvatar);

export default usersRoutes;
