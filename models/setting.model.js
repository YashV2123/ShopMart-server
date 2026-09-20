const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema({
    siteName: {
        type: String
    },
    map1: {
        type: String
    },
    map2: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    whatsapp: {
        type: Number
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    linkedin: {
        type: String
    },
    instagram: {
        type: String
    },
    youtube: {
        type: String
    },
    privacyPolicy: {
        type: String
    },
    termsAndCondition: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
})

const Setting = new mongoose.model("Setting", SettingSchema)
module.exports = Setting