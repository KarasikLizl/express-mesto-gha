import cardSchema from "../models/card.js";

export const getCards = (res, next) => {
  cardSchema.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(res.status(500).send({message: 'Ошибка на сервере'}))
};

export const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Необходимо проверить заполненные поля" });
      } else {
        res.status(500).send( {message: "Ошибка на сервере"} )
      }
    })
    .catch(next)
};

export const deleteCard = (req, res, next) => {
  cardSchema.findById(req.params.cardId)
    .orFail(() => {
      throw new Error("IncorrectId");
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        cardSchema.deleteOne(card).then(() => {
          return res.status(200).send({ message: "Карточка удалена" });
        });
      } else {
        res.status(403).send({ message: "Вы не можете удалить эту карточку" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Карточка не найдена" });
      } else if (err.message === "IncorrectId") {
        return res.status(404).send({ message: "Карточка по этому id не найдена" });
      } else {
        res.status(500).send( {message: "Ошибка на сервере"} )
      }
    });
};

export const putLikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error('IncorrectId');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Карточка не найдена" });
      } else if (err.message === 'IncorrectId') {
        res.status(404).send({ message: "Карточка по этому id не найдена" });
      } else {
        res.status(500).send( {message: "Ошибка на сервере"} )
      }
    })
    .catch(next);
};

export const deleteLikeCard = (req, res, next) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error('IncorrectId');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Карточка не найдена" });
      } else if (err.message === 'IncorrectId') {
        res.status(404).send({ message: "Карточка по этому id не найдена" });
      } else {
        res.status(500).send( {message: "Ошибка на сервере"} )
      }
    })
    .catch(next);
};