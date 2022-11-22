import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'

const app = express()

import Book from "./model/book"

app.use(bodyParser.json())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type Book {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input BookInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        books: [Book!]!
    }
    type RootMutation {
         createBook(bookInput: BookInput):Book
    } 
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      books: () => {
        return Book.find()
          .then((books: any) => {
            return books.map((book: any) => {
              return { ...book._doc, _id: book.id }
            })
          })
          .catch((err: Error) => {
            console.log(err, ' error')
            throw err
          })
      },
      createBook: (args: any) => {
        const book = new Book({
          title: args.bookInput.title,
          description: args.bookInput.description,
          price: +args.bookInput.price,
          date: new Date(args.bookInput.date)
        })
        book
          .save()
          .then((result: any) => {
            return { ...result._doc }
          })
          .catch((err: Error) => {
            console.log(err)
            throw err
          })
        return book
      }
    },
    graphiql: true
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.b3mu90y.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('DATABASE CONNECTED')
    app.listen(3000)
  })
  .catch((err: Error) => {
    console.log(err)
  })
