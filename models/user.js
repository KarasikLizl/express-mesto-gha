import mongoose from 'mongoose';
import { urlRegExp } from '../constants/validator.js';
// import validator from 'validator';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'Поле "link" должно быть валидным url-адресом.',
      },
  },
});

export default mongoose.model('user', userSchema);
