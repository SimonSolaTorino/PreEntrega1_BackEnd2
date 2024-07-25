import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            _id: false,
            quantity: {type: Number, default: 1},
            product: {type: Schema.Types.ObjectId, ref: "products"}
        }
    ]
})

export const cartModel = model("carts", cartSchema)