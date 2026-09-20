const multer = require("multer")
const Maincategory = require("../models/maincategory.model")

function generateUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}

module.exports = {
    maincategoryUploader: generateUploader('maincategory'),
    subcategoryUploader: generateUploader('subcategory'),
    brandUploader: generateUploader('brand'),
    productUploader: generateUploader('product'),
}