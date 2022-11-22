import Book from "../../model/book"
import User from "../../model/user"
import bcrypt from "bcryptjs";

const user = async (userId: any): Promise<any> => {
    try {
        const user: any = await User.findById(userId)
        return { ...user._doc, _id: user.id, booksOwned: books.bind(this, user._doc.booksOwned) }
    } catch (err) {
        console.log(err, " Error");
        throw err;
    }
}

const books = async (booksId: any): Promise<any> => {
    try {
        const books = await Book.find({ _id: { $in: booksId } })
        return books.map((book: any) => {
            return {
                ...book._doc,
                _id: book.id,
                date: new Date(book._doc.date).toISOString(),
                owner: user.bind(this, book.owner)
            }
        })
    } catch (error) {
        console.log(error, " Error");
        throw error;
    }
}

const graphQLResolver = {
    books: async () => {
        try {
            const books: any = await Book.find()
            return books.map((book: any) => {
                return {
                    ...book._doc,
                    _id: book.id,
                    date: new Date(book._doc.date).toISOString(),
                    owner: user.bind(this, book._doc.owner)
                }
            })
        }
        catch (err) {
            console.log(err, ' error')
            throw err
        }
    },
    createBook: async (args: any) => {
        try {
            const book: any = new Book({
                title: args.bookInput.title,
                description: args.bookInput.description,
                price: +args.bookInput.price,
                date: new Date(args.bookInput.date),
                owner: '637c644b77fcca15809becb9'
            })
            let createdBook: any;
            const result: any = await book.save();
            createdBook = {
                ...result._doc,
                _id: result._doc._id.toString(),
                owner: user.bind(this, result._doc.owner)
            }
            const userFounded = await User.findById('637c644b77fcca15809becb9')
            if (!userFounded) {
                throw new Error("User Doesn't Exist...")
            }
            userFounded.booksOwned.push(book)
            await userFounded.save();
            return createdBook;
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    createUser: async (args: any) => {
        try {
            const userFound: any = await User.findOne({ email: args.userInput.email })
            if (userFound) {
                throw new Error("User Exist Already...")
            }
            const hashedPassword: any = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            })
            const result: any = await user.save()
            return { ...result._doc, password: null, _id: result._id }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export default graphQLResolver;