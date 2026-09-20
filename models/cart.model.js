const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Cart Maincategory Field is Mendatory"],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Cart Subcategory Field is Mendatory"],
    },
    quantity: {
        type: Number,
        required: "Quantity Field is Mendatory"
    },
    color: {
        type: String,
        required:[true, "Color Field is Mendatory"],
    },
    size: {
        type: String,
        required:[true, "Size Field is Mendatory"],
    },
    total: {
        type: Number,
        required: "Total Amount Field is Mendatory"
    }
})

const Cart = new mongoose.model("Cart", CartSchema)
module.exports = Cart