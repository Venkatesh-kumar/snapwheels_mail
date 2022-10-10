const express = require('express');
const Router = express.Router();
require("dotenv").config()
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    service: 'Godaddy',
    port: 587,
    secure: false, // true for 465, false for other ports
    ignoreTLS: true, // add this ,
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
    },
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });


Router.get("/verify",async(req,res)=>{
    transporter.verify(function(error, success) {
    if (error) {
        res.send({"status":"failed"})
        res.send(error)
        console.log(error);
    } else {
        res.send({"status":"success"})
        console.log("Server is ready to take our messages");
    }
    });
})
Router.post("/sendOTP",async(req,res)=>{
    var response = {"status":"failed"}
    let mailOptions = {
        from:  `Snapwheels <support@snapwheels.online>`, // sender address
        to: req.body.email, // list of receivers
        subject: `Security Alert: Your one-time sign in code is ${req.body.code}`, // Subject line
        html: `<p>Please verify you're really you by entering this 4-digit code when you sign in. Just a heads up, this code will expire in 20 minutes for security reasons.</p><br /><h1>Your one-time code is: ${req.body.code}</h1>`, // html body
    }

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send(response)
            console.log(error);
        } else {
            response = {"status":"success"}
            res.send(response);
            console.log('Email sent: ' + info.response);
        }
    })
})

Router.post("/sendOrderMail",async(req,res)=>{
    var response = {"status":"failed"}
    let mailOptions = {
        from:  `Snapwheels <support@snapwheels.online>`, // sender address
        to: req.body.customerEmail, // list of receivers
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
              <td style="border: 1px solid grey;">${req.body.orderID}</td>
            </tr>
            <tr>
              <td style="border: 1px solid grey;">Start Date</td>
              <td style="border: 1px solid grey;">${req.body.startDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">End Date</td>
                <td style="border: 1px solid grey;">${req.body.endDate}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">Home Delivery Opted</td>
                <td style="border: 1px solid grey;">${req.body.homeDelivery}</td>
            </tr>
            <tr>
                <td style="border: 1px solid grey;">Total Bike Fare</td>
                <td style="border: 1px solid grey;font-size: large;font-weight: bold;">${req.body.bikeFare}</td>
            </tr>
          </table>
          <h3 style="color:#009387">Wishing you a Happy and Safe ride</h3>
          <br />
          <br />
          <h3>HELP US IMPROVE BY PROVIDING FEEDBACK</h3>

         <p> We are committed to providing the highest levels of service to you at all times. We would love to hear how we did.</p>
          
          <p>Your feedback will help us create a better experience for you and all our customers.</p>
          
         <p> Please feel free to write to us at support@snapwheels.online</p>
    </div>`, // html body
    }

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send(response)
            console.log(error);
        } else {
            response = {"status":"success"}
            res.send(response);
            console.log('Email sent: ' + info.response);
        }
    })
})

module.exports = Router;