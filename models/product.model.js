const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Product Name Field is Mendatory"
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Product Maincategory Field is Mendatory"],
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Product Subcategory Field is Mendatory"],
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Product Brand Field is Mendatory"],
    },
    color: {
        type: [String],
        required: [true, "Product Color Is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Color"
        },
    },
    size: {
        type: [String],
        required: [true, "Product size Is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Color"
        },
    },
    basePrice: {
        type: Number,
        required: "Product basePrice Field is Mendatory"
    },
    discount: {
        type: Number,
        required: "Product Discount Field is Mendatory"
    },
    finalPrice: {
        type: Number,
        required: "Product Final Price Field is Mendatory"
    },
    stock: {
        type: Boolean,
        required: "Product Stock Field is Mendatory"
    },
    stockQuantity: {
        type: Number,
        required: "Product Stock Quantity Field is Mendatory"
    },
    description: {
        type: String,
        default: ""
    },
    pic: {
        type: [String],
        required: [true, "Product Pic Is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "Please Provide Atleast One Product Pic"
        },
    },
    status: {
        type: Boolean,
        default: true
    }
})

const Product = new mongoose.model("Product", ProductSchema)
module.exports = Product