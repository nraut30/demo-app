import mongoose from 'mongoose'

const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const Book = mongoose.model('Book', bookSchema)
export default Book;
