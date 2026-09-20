const jwt = require("jsonwebtoken")

function verifyPublic(req, res, next) {
    next()
}

function verifySuperAdmin(req, res, next) {
    let token = req.headers.authorization
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        if (["Super Admin"].includes(decode.data.role))
            next()
        else {
            res.status(401).send({
                result: "Fail",
                reason: "You Are Not Authorised To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            result: "Fail",
            reason: error.message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your Login Session Has Been Expired, Please Login Again"
        })

    }

}

function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        if (["Super Admin", "Admin"].includes(decode.data.role))
            next()
        else {
            res.status(401).send({
                result: "Fail",
                reason: "You Are Not Authorised To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            result: "Fail",
            reason: error.message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your Login Session Has Been Expired, Please Login Again"
        })

    }

}

function verifyBuyer(req, res, next) {
    let token = req.headers.authorization
    try {
        let decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        if (["Super Admin", "Admin", "Buyer"].includes(decode.data.role))
            next()
        else {
            res.status(401).send({
                result: "Fail",
                reason: "You Are Not Authorised To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            result: "Fail",
            reason: error.message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your Login Session Has Been Expired, Please Login Again"
        })

    }

}

module.exports = {
    verifyPublic,
    verifySuperAdmin,
    verifyAdmin,
    verifyBuyer
}