const User = require("../models/user.model")
const fs = require("fs")
const jwt = require("jsonwebtoken")

const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const bcrypt = require('bcrypt');

const mailer = require("../helper/mailer.helper")


// Add properties to it
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123', 'Admin@123', 'Password@123']);

async function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                res.status(400).send({
                    result: "Fail",
                    reason: "Internal Server Error"
                })
            }
            else {
                try {
                    let data = new User(req.body)
                    data.password = hash
                    await data.save()
                    res.send({
                        result: "Done",
                        data: data
                    })

                    mailer.sendMail({
                        from: process.env.MAIL_USERNAME,
                        to: data.email,
                        subject: `Your Account Has Been Created : Team ${process.env.SITE_NAME}`,
                        html: `
                                <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#333333;">

                                    <div style="max-width:600px;margin:30px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

                                        <!-- Header -->
                                        <div style="background:#0d6efd;padding:25px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>
                                            <p style="margin:8px 0 0;color:#e8f1ff;font-size:15px;">
                                                Welcome to Our Shopping Community
                                            </p>
                                        </div>

                                        <!-- Content -->
                                        <div style="padding:35px 30px;">

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                Welcome to ${process.env.SITE_NAME}! 🎉
                                            </h2>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">
                                                Hi <strong>${data.name}</strong>,
                                            </p>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">
                                                Thank you for creating an account with <strong>${process.env.SITE_NAME}</strong>.
                                                Your account has been successfully registered, and you can now enjoy
                                                a simple, secure, and convenient online shopping experience.
                                            </p>

                                            <!-- Account Details -->
                                            <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:18px 20px;margin:25px 0;">

                                                <p style="margin:0 0 10px;font-size:15px;">
                                                    <strong>Name:</strong> ${data.name}
                                                </p>

                                                <p style="margin:0;font-size:15px;">
                                                    <strong>Email:</strong> ${data.email}
                                                </p>
                                            </div>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">
                                                With your new account, you can easily explore our products, add
                                                items to your cart, manage your profile, track orders, and enjoy
                                                exciting offers available at ${process.env.SITE_NAME}.
                                            </p>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 25px;">
                                                We're happy to have you with us and look forward to providing you
                                                with a great shopping experience.
                                            </p>

                                            <!-- Button -->
                                            <div style="text-align:center;margin:30px 0;">
                                                <a href="${process.env.SITE_URL}"
                                                style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                    Start Shopping
                                                </a>
                                            </div>

                                            <p style="font-size:15px;line-height:1.7;margin:25px 0 5px;">
                                                Thank you for choosing <strong>${process.env.SITE_NAME}</strong>.
                                            </p>

                                            <p style="font-size:15px;line-height:1.7;margin:0;">
                                                Best Regards,<br>
                                                <strong>${process.env.SITE_NAME} Team</strong>
                                            </p>

                                        </div>

                                        <!-- Footer -->
                                        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">

                                            <p style="margin:0;font-size:13px;color:#777777;">
                                                © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                                            </p>

                                            <p style="margin:8px 0 0;font-size:12px;color:#999999;">
                                                This is an automated confirmation email. Please do not reply to this email.
                                            </p>

                                        </div>

                                    </div>

                                </body> `
                    })

                } catch (error) {
                    let errormessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User With This ${key} Already Exists`])) : (error.errors ? Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message])) : {})
                    res.status(Object.values(errormessage).length !== 0 ? 400 : 500).send({
                        result: "Fail",
                        reason: Object.values(errormessage).length !== 0 ? errormessage : "Internal Server Error"
                    })
                }
            }
        })
    }
    else {
        res.status(400).send({
            result: "Fail",
            reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "password")).join("|")
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        console.log(req.params)
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
        let data = await User.findOne({ _id: req.params._id })
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
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.address = req.body.address ?? data.address
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
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
        let errormessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User With This ${key} Already Exists`])) : (error.errors ? Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message])) : {})
        res.status(Object.values(errormessage).length !== 0 ? 400 : 500).send({
            result: "Fail",
            reason: Object.values(errormessage).length !== 0 ? errormessage : "Internal Server Error"
        })
    }
}
async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let token = jwt.sign({ data }, process.env.JWT_SECRET_TOKEN, { expiresIn: "15 days" })
                res.send({
                    result: "Done",
                    data: data,
                    token: token
                })
            }
            else {
                res.status(401).send({
                    result: "Fail",
                    reason: "Invalid Username or password"
                })
            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or password"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Math.random().toString().slice(2, 8).toString().padEnd(6, "1"))
            data.passwordResetOptions = {
                otp: otp,
                date: new Date()
            }
            await data.save()
            res.send({
                result: "Done",
                reason: "OTP Has Been Sent To Your Registered Email Address"
            })
            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: data.email,
                subject: `OTP For Password Reset : Team ${process.env.SITE_NAME}`,
                html: `
                            <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#333333;">

                                    <div style="max-width:600px;margin:30px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

                                        <!-- Header -->
                                        <div style="background:#0d6efd;padding:25px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>
                                            <p style="margin:8px 0 0;color:#e8f1ff;font-size:15px;">
                                                Password Reset Request
                                            </p>
                                        </div>

                                        <!-- Content -->
                                        <div style="padding:35px 30px;">

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                Reset Your Password
                                            </h2>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">
                                                Hi <strong>${data.name}</strong>,
                                            </p>

                                            <p style="font-size:16px;line-height:1.8;margin:0 0 20px;">
                                                We received a request to reset the password for your
                                                <strong>${process.env.SITE_NAME}</strong> account. Use the One-Time Password
                                                (OTP) below to continue with the password reset process.
                                            </p>

                                            <!-- OTP Box -->
                                            <div style="text-align:center;background:#f8f9fa;border:1px solid #e5e7eb;border-radius:6px;padding:25px;margin:25px 0;">

                                                <p style="margin:0 0 10px;font-size:14px;color:#666666;">
                                                    Your OTP
                                                </p>

                                                <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0d6efd;">
                                                    ${otp}
                                                </div>

                                            </div>

                                            <p style="font-size:15px;line-height:1.7;margin:0 0 15px;">
                                                This OTP is valid for <strong>10 minutes</strong>. Please do not
                                                share this code with anyone.
                                            </p>

                                            <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:15px 18px;margin:20px 0;">
                                                <p style="margin:0;font-size:14px;line-height:1.6;color:#664d03;">
                                                    <strong>Security Notice:</strong> If you did not request a
                                                    password reset, you can safely ignore this email. Your account
                                                    password will not be changed unless the OTP is verified.
                                                </p>
                                            </div>

                                            <p style="font-size:15px;line-height:1.7;margin:25px 0 5px;">
                                                Best Regards,
                                            </p>

                                            <p style="font-size:15px;line-height:1.7;margin:0;">
                                                <strong>${process.env.SITE_NAME} Team</strong>
                                            </p>

                                        </div>

                                        <!-- Footer -->
                                        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">

                                            <p style="margin:0;font-size:13px;color:#777777;">
                                                © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                                            </p>

                                            <p style="margin:8px 0 0;font-size:12px;color:#999999;">
                                                This is an automated security email. Please do not reply to this email.
                                            </p>

                                        </div>

                                    </div>

                            </body> `
            })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "No User Record Found"
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

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (data.passwordResetOptions && data.passwordResetOptions.otp == req.body.otp) {
                if ((Date.now() - new Date(data.passwordResetOptions.date).getTime()) > 600000) {
                    return res.status(400).send({
                        result: "Fail",
                        reason: "OTP Has Been Expired, Please Try Again"
                    })
                }
                else {
                    return res.send({
                        result: "Done",
                    })
                }
            }
            else {
                return res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
            }
        }
        else {
            return res.status(404).send({
                result: "Fail",
                reason: "No User Record Found"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        return res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        data.passwordResetOptions = {}
                        await data.save()
                        res.send({
                            result: "Done",
                            data: data
                        })

                        mailer.sendMail({
                            from: process.env.MAIL_USERNAME,
                            to: data.email,
                            subject: `Password Reset Successful : Team ${process.env.SITE_NAME}`,
                            html: `
                                <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#333333;">
                                    <div style="max-width:600px;margin:30px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                                        <div style="background:#0d6efd;padding:25px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">${process.env.SITE_NAME}</h1>
                                            <p style="margin:8px 0 0;color:#e8f1ff;font-size:15px;">Password Reset Confirmation</p>
                                        </div>
                                        <div style="padding:35px 30px;">
                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">Password Changed Successfully</h2>
                                            <p style="font-size:16px;line-height:1.8;margin:0 0 18px;">Hi <strong>${data.name}</strong>,</p>
                                            <p style="font-size:16px;line-height:1.8;margin:0 0 20px;">Your password for your <strong>${process.env.SITE_NAME}</strong> account has been successfully updated. You can now log in with your new password.</p>
                                            <p style="font-size:15px;line-height:1.7;margin:25px 0 5px;">Best Regards,<br><strong>${process.env.SITE_NAME} Team</strong></p>
                                        </div>
                                        <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
                                            <p style="margin:0;font-size:13px;color:#777777;">© 2026 ${process.env.SITE_NAME}. All Rights Reserved.</p>
                                        </div>
                                    </div>
                                </body>
                            `
                        })
                    }
                })
            }
            else {
                return res.status(400).send({
                    result: "Fail",
                    reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "password")).join("|")
                })
            }
        }
        else {
            return res.status(404).send({
                result: "Fail",
                reason: "No User Record Found"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
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
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}