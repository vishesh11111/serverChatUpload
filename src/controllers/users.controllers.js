const express = require("express");
const app = express();
const ObjectId = require("mongoose").ObjectId;
const UserModel = require("../models/user.model")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const accountSid = 'AC13bd946106161f035e51fa23d252b6a0';
// "AC13bd946106161f035e51fa23d252b6a0";
const authToken = '0a3c7c62fe3f330d24ebf14e7fe1365e';
// "0a3c7c62fe3f330d24ebf14e7fe1365e";
const twilio = require("twilio")(accountSid, authToken)



const GetWebToken = (user) => {
    return jwt.sign({ user }, "hello");
}

const Signup = async (req, res) => {
    try {
        const body = req.body;
        const user = await UserModel.aggregate([
            {
                $match: { 'user.email': body.email }
            }
        ])
        if (user.length !== 0) {
            res.status(400).send({ status: false, message: "User already Exist" });
        } else {
            // console.log(re)

            let smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                // pool: true,
                // secure: true,
                auth: {
                    user: "cti.1234testing@gmail.com",
                    pass: "vspqczeetzwwrehk",
                }
            });

            /////////////////////////////////////////////////-->BY Twilio send OTP<----------//////////
            const OTPMSG = Math.floor((1000 + Math.random() * 9000))
            const data = {
                "name": body?.name,
                "user": [
                    {
                        "email": body?.email,
                        "number": body?.number,
                    }
                ],
                "phone": body?.number,
                "Otp": OTPMSG,
                "password": body?.password,
                "avatar": req?.file?.filename
            }

            twilio.messages.create({
                from: "+15096523120",
                // messagingServiceSid: `MG870ccb67f87d1fd6c400e7a97ea5d86f`, 
                to: `+91${body?.number}`,
                body: `this is your OTP from Practice code: ${OTPMSG}, This code will be valid only for next 5min`
            })
                .then((resl) => { console.log("message has send!", resl) })
                .catch((err) => { console.log(err) })

            let emaildata = {
                from: "admin@gmail.com",
                to: body?.email,
                subject: "text Mail",
                html: `<html>
                <head>
                  <h2>Verify Mail from here</h2>
                    <h3>helo ${body?.name}</h3>
                    <a href="http://localhost:3040/users?email=${body?.email}">Go</a>
                </head>
            </html>`
            }
            await smtpTransport.sendMail(emaildata, (err, data) => {
                if (err) {
                    res.send({ status: false, message: "Error while sending Mail", err })
                }
                else {
                    // console.log("maile send", data)
                }
            })

            const users = await UserModel.create(data)
            // let users = [];
            const webToken = GetWebToken(users)
            res.status(200).send({ status: true, message: "Please check Email for Verify account! User create Succefully", users, token: webToken })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: "Somthing went wrong" });
    }
};


const SignIn = async (req, res) => {
    try {
        const body = req.body;
        const user = await UserModel.findOne({ 'user.email': body.email });

        if (user == null) {
            return res.status(400).send({ status: false, message: "SignUp Frist" })
        } else if (user == null) {
            return res.status(200).send({ status: true, message: "login succefully", user })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Somthing went wrong" });
    }
}

const Users = async (req, res) => {
    const user = await UserModel.find({ 'user.email': req?.query?.email });
    let ID = String(user[0]?._id)

    const findByIDANDUpdate = await UserModel.findByIdAndUpdate(ID, { verify: true })
    // console.log("___", req.query.email)

    //    res.sendFile()
    let check = await UserModel.findById(ID);
    // console.log("l;g;dfgldf", check.verify)
    if (check?.verify) {
        res.send(`<html style="height: 100%; width: 100%; background-color: coral;">
      <body style="height: 200px; width: 300px; border: 1px solid; margin: auto; margin-top: 50px">
       <div>
       <h2 style="height: 100px; margin: auto; margin-top: 20px; text-align: center;">User verify succefully</h2>
       </div>
      </body>
      </html>`)
    } else {
        res.send(`<html style="height: 100%; width: 100%; background-color: coral;">
      <body style="height: 200px; width: 300px; border: 1px solid; margin: auto; margin-top: 50px">
       <div>
       <h2 style="height: 100px; margin: auto; margin-top: 20px; text-align: center;">User Not verify succefully</h2>
       </div>
      </body>
      </html>`)
    }
}


const VerifyByOtp = async (req, res) => {
    try {
        const OPTCheck = await UserModel.findOne({ 'user.email': req?.body?.email })
        if (Number(OPTCheck?.Otp) === Number(req?.body?.Otp)) {
            const updateData = await UserModel.findByIdAndUpdate(OPTCheck?._id, {Otpverify: true, $unset: { Otp: OPTCheck?.Otp }});
            UserDataByEmail = await UserModel.findOne({ 'user.email': req?.body?.email })
            res.status(200).send({ status: true, message: "user verify succefully", user: UserDataByEmail })
        } else {
            res.status(400).send({ status: false, message: "Enter valid Otp" })

        }
    } catch (error) {
        res.send(500).send({ status: false, message: error.message })
    }
}

module.exports = { Signup, SignIn, Users, VerifyByOtp }