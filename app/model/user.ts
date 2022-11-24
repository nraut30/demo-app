import mongoose from 'mongoose'

const Schema = mongoose.Schema

//single user schema for mongoDB
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    booksOwned: [
        {
            type: Schema.Types.ObjectId,
        }
    ]
})

const User = mongoose.model('User', userSchema)
export default User;
