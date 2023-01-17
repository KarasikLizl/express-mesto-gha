const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка на сервере';

  // eslint-disable-next-line object-shorthand
  res.status(statusCode).send({ message: message });

  next();
};

export default errorHandler;
