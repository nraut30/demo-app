import Book from "../../model/book"
import User from "../../model/user"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const user = async (userId: any): Promise<any> => {
    try {
        const user: any = await User.findById(userId)
        return { ...user._doc, _id: user.id, booksOwned: books.bind(this, ...user._doc.booksOwned) }
    } catch (err) {
        console.log(err, " Error");
        throw err;
    }
}

const books = async (booksId: any): Promise<any> => {
    try {
        const books = await Book.find({ _id: { $in: booksId } })
        books.sort((a, b) => {
            return (
                booksId.indexOf(a._id.toString()) - booksId.indexOf(b._id.toString())
            );
        });
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
    books: async (args: any, req: any) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
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
    createBook: async (args: any, req: any) => {
        console.log(req.userId, req.isAuth, " reqqq");

        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const book: any = new Book({
                title: args.bookInput.title,
                description: args.bookInput.description,
                price: +args.bookInput.price,
                date: new Date(args.bookInput.date),
                owner: req.userId
            })
            let createdBook: any;
            const result: any = await book.save();
            createdBook = {
                ...result._doc,
                _id: result._doc._id.toString(),
                owner: user.bind(this, result._doc.owner)
            }
            const userFounded = await User.findById(req.userId)
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
    },
    login: async ({ email, password }: { email: String, password: any }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            {
                expiresIn: '1h'
            }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 };
    }
}

export default graphQLResolver;