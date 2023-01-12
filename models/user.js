import mongoose from 'mongoose';
import { urlRegExp } from '../constants/validator.js';
// import { validator } from 'validator';
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле должно быть валидным url-адресом.',
      },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь океана',
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле должно быть валидным url-адресом.',
      },
  },
});

export default mongoose.model('user', userSchema);
