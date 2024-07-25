import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {type: String, require: true},
    last_name: {type: String, require:true},
    password: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    age: {type: Number, require: true},
    role: {type: String, enum: ["admin", "user"], default: "user"},
    cart: { type: Schema.Types.ObjectId, ref: "carts" } //ojo aca con ref: "carts" tiene que llamarse igual que la coleccion de mongo.
})

export const userModel = model("users", userSchema)