import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlenght: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    default: [],
    type: mongoose.Schema.Types.Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('card', cardSchema);