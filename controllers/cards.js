import cardSchema from '../models/card.js';
import {
  OK,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../constants/errors.js';

export const getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      if (err) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка на сервере' });
      } else {
        next();
      }
    });
};

export const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Необходимо проверить заполненные поля' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка на сервере' });
      }
    })
    .catch(next);
};

export const deleteCard = (req, res) => {
  cardSchema
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('IncorrectId');
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        cardSchema.deleteOne(card).then(() => {
          res.status(OK).send({ message: 'Карточка удалена' });
        });
      } else {
        res
          .status(FORBIDDEN)
          .send({ message: 'Вы не можете удалить эту карточку' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.message === 'IncorrectId') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка по этому id не найдена' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка на сервере' });
      }
    });
};

export const putLikeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      throw new Error('IncorrectId');
    })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.message === 'IncorrectId') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка по этому id не найдена' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка на сервере' });
      }
    })
    .catch(next);
};

export const deleteLikeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(() => {
      throw new Error('IncorrectId');
    })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.message === 'IncorrectId') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка по этому id не найдена' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка на сервере' });
      }
    })
    .catch(next);
};
