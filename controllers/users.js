import userSchema from "../models/user.js";

export const getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: "Ошибка на сервере" });
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
        .status(400)
        .send({ message: "Пользователь с указанным id не найден" });
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный Id пользователя" });
      } else if (err.message === "IncorrectId") {
        return res.status(404).send({ message: "Пользователь по этому id не найден" });
      } else {
        res.status(500).send( {message: "Ошибка на сервере"} )
      }
    });
};

export const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Ошибка валидации" });
      } else {
        res.status(500).send({ message: "Ошибка на сервере" });
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
    .orFail(() => res.status(404).send({ message: "Пользователь не найден" }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Неверные данные" });
      } else {
        return res.status(500).send({ message: "Ошибка на сервере" });
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
    .orFail(() => res.status(404).send({ message: "Пользователь не найден" }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Неверные данные" });
      } else if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Вставьте корректную ссылку" });
      } else {
        res.status(500).send({ message: "Ошибка на сервере" });
      }
    })
    .catch(next);
};
