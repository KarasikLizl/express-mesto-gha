import userSchema from "../models/user.js";
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../constants/errors.js";

export const getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      if (err) {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на сервере" });
      } else {
        next();
      }
    });
};

export const getUserById = (req, res, next) => {
  userSchema
    .findById(req.params.userId)
    .orFail(() => {
      res
        .status(NOT_FOUND)
        .send({ message: "Пользователь с указанным id не найден" });
    })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "id не найдет", ...err });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на сервере" });
      }
    });
};

export const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Ошибка валидации" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на сервере" });
      }
    });
};

export const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .orFail(() => res.status(NOT_FOUND).send({ message: "Пользователь не найден" }))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Неверные данные" });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на сервере" });
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
      { new: true, runValidators: true }
    )
    .orFail(() => res.status(NOT_FOUND).send({ message: "Пользователь не найден" }))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Неверные данные" });
      } else if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Вставьте корректную ссылку" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка на сервере" });
      }
    })
    .catch(next);
};
