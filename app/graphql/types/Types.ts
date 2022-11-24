import { ObjectId } from "mongoose"

export type BookType = {
    title: string,
    description: string,
    price: number,
    date: Date,
    owner: ObjectId,
}

export type User = {
    email: string,
    password: string,
    booksOwned: [BookType]
}