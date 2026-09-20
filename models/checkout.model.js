const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Checkout Maincategory Field is Mendatory"],
    },
    deliveryAddress: {
        type: Object,
        required: [true, "Delivery Address Field is Mendatory"],
    },
    orderStatus: {
        type: String,
        default: "Order Has Been Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: "Subtotal Amount Field is Mendatory"
    },
    shipping: {
        type: Number,
        required: "Shipping Amount Field is Mendatory"
    },
    total: {
        type: Number,
        required: "Total Amount Field is Mendatory"
    },
    rppid: {
        type: String,
        default: ""
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Id is Mendatory"],
            },
            color: {
                type: String,
                required: [true, "Product Color is Mendatory"],
            },
            size: {
                type: String,
                required: [true, "Product Size is Mendatory"],
            },
            quantity: {
                type: String,
                required: [true, "Product Quantity is Mendatory"],
            },
            total: {
                type: Number,
                required: [true, "Product Total is Mendatory"],
            },

        }],
        required: [true, "Cart Product Is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Cart Product"
        },
    }
}, { timestamps: true })

const Checkout = new mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout