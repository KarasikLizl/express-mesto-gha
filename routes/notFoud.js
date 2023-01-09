import express from 'express';

const notFoundRouter = express.Router();

notFoundRouter.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

export default notFoundRouter;
