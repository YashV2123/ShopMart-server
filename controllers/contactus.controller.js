const ContactUs = require("../models/contactus.model")
const mailer = require("../helper/mailer.helper")

const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data.email,
            subject: `New Contact Us Query Has Been Received : Team ${process.env.SITE_NAME}`,
            html: `
                <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#333333;">

                    <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">

                    <!-- Header -->
                    <div style="background:#0d6efd;padding:25px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                    ${process.env.SITE_NAME}
                    </h1>
                    <p style="margin:8px 0 0;color:#e8f1ff;font-size:15px;">
                    Thank You for Contacting Us
                    </p>
                    </div>

                    <!-- Body -->
                    <div style="padding:35px 30px;">

                    <h2 style="margin-top:0;color:#222222;font-size:24px;">
                    We've Received Your Query!
                    </h2>

                    <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                    Hi <strong>${data.name}</strong>,
                    </p>

                    <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                    Thank you for reaching out to <strong>${process.env.SITE_NAME}</strong>. This email confirms that we have successfully received your query. Our customer support team is currently reviewing your request and will get back to you as soon as possible.
                    </p>

                    <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                    We strive to respond to all customer inquiries promptly. Depending on the nature of your request, you can generally expect a response within <strong>24–48 business hours</strong>.
                    </p>

                    <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:18px 20px;margin:25px 0;">
                    <p style="margin:0;font-size:15px;line-height:1.7;">
                        <strong>Your Query Details</strong><br><br>
                        <strong>Name:</strong> ${data.name}<br>
                        <strong>Email:</strong> ${data.email}<br>
                        <strong>Subject:</strong> ${data.subject}<br>
                        <strong>Message:</strong><br>
                        ${data.message}
                    </p>
                    </div>

                    <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                    If you need to share any additional information regarding your request, simply reply to this email and our team will be happy to assist you.
                    </p>

                    <div style="text-align:center;margin:35px 0;">
                    <a href=${process.env.SITE_URL}
                    style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:5px;font-size:16px;font-weight:bold;">
                        Visit ${process.env.SITE_NAME}
                    </a>
                    </div>

                    <p style="font-size:16px;line-height:1.8;margin-bottom:5px;">
                    Thank you for choosing <strong>${process.env.SITE_NAME}</strong>.
                    </p>

                    <p style="font-size:16px;line-height:1.8;">
                    Best Regards,<br>
                    <strong>Customer Support Team</strong><br>
                    ${process.env.SITE_NAME}
                    </p>

                    </div>

                    <!-- Footer -->
                    <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:14px;color:#666666;">
                    © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                    </p>

                    <p style="margin:10px 0 0;font-size:13px;color:#888888;">
                    This is an automated confirmation email. Please do not reply unless you need to provide additional information regarding your query.
                    </p>
                    </div>

                    </div>

                </body> `
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: `New Contact Us Query Received : Team ${process.env.SITE_NAME}`,
            html: `
                <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#333333;">

            <div style="max-width:600px;margin:30px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

                <!-- Header -->
                <div style="background:#0d6efd;padding:25px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:26px;">
                        ${process.env.SITE_NAME}
                    </h1>
                    <p style="margin:8px 0 0;color:#eaf2ff;font-size:14px;">
                        New Contact Query Notification
                    </p>
                </div>

                <!-- Content -->
                <div style="padding:30px;">

                    <h2 style="margin:0 0 20px;color:#222222;font-size:22px;">
                        New Contact Query Received
                    </h2>

                    <p style="font-size:15px;line-height:1.7;margin:0 0 20px;">
                        A new contact query has been submitted through the
                        <strong>${process.env.SITE_NAME}</strong> website. Please review the
                        customer's message and respond accordingly.
                    </p>

                    <!-- Query Details -->
                    <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:20px;margin:20px 0;">

                        <p style="margin:0 0 12px;font-size:15px;">
                            <strong>Customer Name:</strong> ${data.name}
                        </p>

                        <p style="margin:0 0 12px;font-size:15px;">
                            <strong>Customer Email:</strong> ${data.email}
                        </p>

                        <p style="margin:0 0 12px;font-size:15px;">
                            <strong>Subject:</strong> ${data.subject}
                        </p>

                        <p style="margin:0;font-size:15px;line-height:1.7;">
                            <strong>Message:</strong><br>
                            ${data.message}
                        </p>

                    </div>

                    <p style="font-size:15px;line-height:1.7;margin:20px 0;">
                        Please review the query and contact the customer as soon as possible.
                        Make sure the customer's concern is properly addressed.
                    </p>

                    <div style="text-align:center;margin:30px 0;">
                        <a href="${process.env.SITE_URL}/admin"
                        style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;padding:13px 25px;border-radius:5px;font-size:15px;font-weight:bold;">
                            Open ${process.env.SITE_NAME}
                        </a>
                    </div>

                    <p style="font-size:14px;line-height:1.6;color:#666666;margin:0;">
                        This is an automated notification generated by the ${process.env.SITE_NAME}
                        contact form.
                    </p>

                </div>

                <!-- Footer -->
                <div style="background:#f8f9fa;padding:18px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#777777;font-size:13px;">
                        © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                    </p>
                </div>

            </div>

        </body> `
        })

    } catch (error) {
        let errormessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `ContactUs With This Name is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errormessage).length !== 0 ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errormessage).length !== 0 ? errormessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await ContactUs.find();
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.status = req.body.status ?? data.status
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
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}
async function deleteRecord(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
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