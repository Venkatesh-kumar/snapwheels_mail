const express = require('express')
const serverless = require('serverless-http')
require("dotenv").config()
const nodemailer = require("nodemailer")

const app = express()
const router = express.Router();

let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    // service: 'Godaddy',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
        // user: "support@snapwheels.co.in", // generated ethereal user
        // pass: "Snapwheels1405", // generated ethereal password
    },
});

router.get('/',(req,res)=>{
    res.send("Hello welcome to snapwheels netlify mailer")
})


router.get("/verify",async(req,res)=>{
    let response = await transporter.verify()
    .then(()=>{
        res.send({"status":"success"})
        console.log("Server is ready to take our messages");
    })
    .catch(err => {
        res.send({"status":"failed"})
        res.send(err)
        console.log(err);
    })
})
router.post("/sendOTP",async(req,res)=>{
    var body = JSON.parse(req.body)
    var response = {"status":"failed"}
    let mailOptions = {
        from:  `Snapwheels <support@snapwheels.co.in>`, // sender address
        to: body.email, // list of receivers
        subject: `Security Alert: Your one-time sign in code is ${body.code}`, // Subject line
        html: `<p>Please verify you're really you by entering this 4-digit code when you sign in. Just a heads up, this code will expire in 20 minutes for security reasons.</p><br /><h1>Your one-time code is: ${body.code}</h1>`, // html body
    }

    let data = await transporter.sendMail(mailOptions)
    .then((response)=>{
        response = {"status":"success"}
        res.send(response);
        console.log('Email sent: ' + info.response);
    })
    .catch(error => {
        res.send(response)
        console.log(error);
    })
})


router.post("/sendOrderMail",async(req,res)=>{
    var body = JSON.parse(req.body)
    var mailList = [
        body.customerEmail,
        'venkateshkumar1405@gmail.com'
    ]
    var response = {"status":"failed"}
    let mailOptions = {
        from:  `Snapwheels <support@snapwheels.co.in>`, // sender address
        to: mailList, // list of receivers
        subject: `Order Created: Thanks for booking your ride with Snapwheels`, // Subject line
        html:`<div style=" padding: 20px;margin-left: 5%;margin-right: 5%;">
        
        <h1 style="color: #009387;font-size: 48px;">snapwheels</h1>
        <hr />
        
        <p>Hello,</p>
        <p>Thanks for booking your ride with Snapwheels. We have received your order.</p>
        <h3>Order Details:</h3>
        <table style="width:80%">
            <tr>
              <td style="border: 1px solid grey;">orderID</td>
              <td style="border: 1px solid grey;">${body.orderID}</td>
            </tr>
            <tr>
              <td style="border: 1px solid grey;">Start Date</td>
              <td style="border: 1px solid grey;">${body.startDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">End Date</td>
                <td style="border: 1px solid grey;">${body.endDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">Home Delivery Opted</td>
                <td style="border: 1px solid grey;">${body.homeDelivery}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">Total Bike Fare</td>
                <td style="border: 1px solid grey;font-size: large;font-weight: bold;">${body.bikeFare}</td>
            </tr>
          </table>
          <h3 style="color:#009387">Wishing you a Happy and Safe ride</h3>
          <br />
          <br />
          <h3>HELP US IMPROVE BY PROVIDING FEEDBACK</h3>

         <p> We are committed to providing the highest levels of service to you at all times. We would love to hear how we did.</p>
          
          <p>Your feedback will help us create a better experience for you and all our customers.</p>
          
         <p> Please feel free to write to us at support@snapwheels.co.in</p>
    </div>`, // html body
    }

    let data = await transporter.sendMail(mailOptions)
    .then((response)=>{
        response = {"status":"success"}
        res.send(response);
        console.log('Email sent: ' + info.response);
    })
    .catch(error => {
        res.send(response)
        console.log(error);
    })
})

app.use('/.netlify/functions/api',router)
module.exports.handler = serverless(app)