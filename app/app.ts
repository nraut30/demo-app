import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'
import graphQLSchema from './graphql/schema'
import graphQLResolver from './graphql/resolvers'

const app = express()

app.use(bodyParser.json())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
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
