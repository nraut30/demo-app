import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'
import graphQLSchema from './graphql/schema'
import graphQLResolver from './graphql/resolvers'
import isAuth from "./middleware/is-auth";

const app = express()

app.use(bodyParser.json())

//isAuth middleware
app.use(isAuth);

//CORS allow and other Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    next();
  }
})

//graphQL API with schema
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true
  })
)

//mongoDB connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.b3mu90y.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('DATABASE CONNECTED')
    app.listen(3000)
  })
  .catch((err: Error) => {
    console.error(err)
  })
