import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js';
import notFoundRouter from './routes/notFoud.js';
import path from 'path';

const __dirname = path.resolve();
const app = express();
const {
    PORT = 3000,
    MONGO_URL = 'mongodb://localhost:27017/mestodb'
} = process.env;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use((req,res, next) => {
  req.user = {
    _id: '63a71829f4b3fca339abfbbe' // вставьте сюда _id созданного в предыдущем пункте пользователя
  }
  next()
});

app.use(usersRoutes);
app.use(cardRoutes);
app.use(notFoundRouter);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  console.log(`Server connect db ${MONGO_URL}`);
  app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

connect();
