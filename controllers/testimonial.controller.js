const Testimonial = require("../models/testimonial.model")
const fs = require("fs")
const path = require("path")

async function createRecord(req, res) {
    try {
        let data = new Testimonial(req.body)
        await data.save()

        let finalData = await Testimonial.findOne({ _id: data._id })
            .populate("user", ["name",])
            .populate("product", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {
        console.log(error)
        let errormessage = error.errors ? Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message])) : {}
        res.status(Object.values(errormessage).length !== 0 ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errormessage).length !== 0 ? errormessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Testimonial.find()
            .populate("user", ["name",])
            .populate("product", { name: 1, _id: 0 })
        console.log(data)

        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
            .populate("user", ["name",])
            .populate("product", ["name"])
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
            .populate("user", ["name",])
            .populate("product", ["name"])
        if (data) {
            data.message = req.body.message ?? data.message
            data.star = req.body.star ?? data.star
            await data.save()

            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        let errormessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errormessage).length !== 0 ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errormessage).length !== 0 ? errormessage : "Internal Server Error"
        })
    }
}
async function deleteRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.send({
            result: "Done"
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}