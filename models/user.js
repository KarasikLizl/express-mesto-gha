import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'E k'
  },
  about: {
    type: String,
    required: true,
    default: 'sad sad',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: "https://sun9-23.userapi.com/impg/eUWjlmFPXMh4307NhHP2r24enkdyamNZTMR1Pg/-KdYFXBGwoQ.jpg?size=691x691&quality=96&sign=a1f0d8e1f6f55dfbe3aa562577848ae5&type=album",
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: 'Ошибка валидации',
    },
  }
})

export default mongoose.model('user', userSchema);