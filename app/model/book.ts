import mongoose from 'mongoose'

const Schema = mongoose.Schema

//single book schema for mongoDB
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  }
})

const Book = mongoose.model('Book', bookSchema)
export default Book;
