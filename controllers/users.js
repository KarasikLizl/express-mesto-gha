import userSchema from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MONGO_DUPLICATE_ERROR, OK } from '../constants/errors.js';
import { SOLT_ROUNDS } from '../constants/solt.js';

import BadRequestError from "../errors/bad_req.js";
import NotFoundError from "../errors/not_found.js";
import ConflictError from '../errors/conflict.js';
import NotAuthorizedError from '../errors/unauthorized.js';

export const getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
        next(err);
    });
};

export const getUserById = (req, res, next) => {
  userSchema
    .findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным id не найден');
    })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('id не найден');
      } else {
        next(err);
      }
    });
};

export const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не указан email или пароль');
  }
  userSchema.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('Этот email уже зарегестрирован'));
      }
    });
    bcrypt
      .hash(req.body.password, SOLT_ROUNDS)
      .then((hash) => userSchema.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
        .then((user) => {
          res.status(OK).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Ошибка при создании пользователя'));
          } else if (err.code === MONGO_DUPLICATE_ERROR) {
            next(new ConflictError('Такой пользователь уже существует'));
          } else next(err);
        }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Введены некорректные данные'));
        } else if (err.code === MONGO_DUPLICATE_ERROR) {
          next(new ConflictError('Такой пользователь уже существует'));
        } else next(err);
      });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Проверьте введенные данные');
  } else {
    userSchema.findOne({ email }).select('+password')
      .orFail(() => {
        throw new NotAuthorizedError('Неверный email или пароль');
      })
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new NotAuthorizedError('Неверный email или пароль');
            } else {
              const token = jwt.sign({ _id: user._id }, 'super-strong-secret-key', { expiresIn: '7d' });
              res.send({ token });
            }
          })
          .catch((err) => next(err));
      })
      .catch(next);
  }
};

export const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() =>{ throw new NotFoundError('Пользователь не найден') })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

export const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => { throw new NotFoundError('Пользователь не найден') })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Вставьте корректную ссылку'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
