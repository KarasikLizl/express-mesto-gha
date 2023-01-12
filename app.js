import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import usersRoutes from './routes/users.js';
import cardRoutes from './routes/cards.js';
import notFoundRouter from './routes/notFoud.js';
import {createUser, login} from './controllers/users.js'
import { auth } from './middlewares/auth.js';
import { errorHandler } from './middlewares/error-handler.js';

const __dirname = path.resolve();
const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/signin', login);
app.post('/signup', express.json(), createUser);

app.use(auth);

app.use(usersRoutes);
app.use(cardRoutes);
app.use(notFoundRouter);

app.use(errorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

connect();
