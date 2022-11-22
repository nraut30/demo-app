import { buildSchema } from "graphql";

const graphQLSchema = buildSchema(`
type Book {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    owner: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  booksOwned: [Book!]
}

input BookInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    books: [Book!]!
    users: [User]
}
type RootMutation {
     createBook(bookInput: BookInput): Book
     createUser(userInput: UserInput): User
} 
schema {
    query: RootQuery
    mutation: RootMutation
}
`)

export default graphQLSchema;