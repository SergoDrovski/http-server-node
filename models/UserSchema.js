import {connectDb, Schema} from '../libs/db.js';
const db = connectDb();
export const userScheme = new Schema("User", {
    username: {
        type: "string",
        required: true
    },
    age: {
        type: "number",
        required: true
    },
    hobbies: {
        type: "object",
        required: true
    }
}, db);