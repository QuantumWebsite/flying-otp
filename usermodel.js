import { model, Schema } from "mongoose";

const userSchena = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    }
})

const User = model('User', userSchena);
export default User;