import cardSchema from '../models/card.js';
import { OK } from '../constants/errors.js';

import BadRequestError from "../errors/bad_req.js";
import NotFoundError from "../errors/not_found.js";
import ForbiddenError from '../errors/forbidden.js';

export const getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      next(err);
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
        throw new BadRequestError('Введены некорректные данные')
      } else {
        next(err);
      }
    })
    // .catch(next);
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
       throw new ForbiddenError('Вы не можете удалить эту карточку');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      } else if (err.message === 'IncorrectId') {
        throw new NotFoundError('Карточка по этому id не найдена');
      } else {
        next(err);
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
        throw new BadRequestError('Карточка не найдена');
      } else if (err.message === 'IncorrectId') {
        throw new NotFoundError('Карточка по этому id не найдена');
      } else {
       next(err);
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
        throw new BadRequestError('Карточка не найдена');
      } else if (err.message === 'IncorrectId') {
        throw new NotFoundError('Карточка по этому id не найдена');
      } else {
        next(err);
      }
    })
    .catch(next);
};
