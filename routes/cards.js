import express from "express";
import {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} from "../controllers/cards.js";

const cardRoutes = express.Router();

cardRoutes.get("/cards", express.json(), getCards);

cardRoutes.post("/cards", express.json(), createCard);

cardRoutes.delete("/cards/:cardId", deleteCard);

cardRoutes.put("/cards/:cardId/likes", putLikeCard);

cardRoutes.delete("/cards/:cardId/likes", deleteLikeCard);

export default cardRoutes;
