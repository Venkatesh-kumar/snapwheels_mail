const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')

const MailsRoute = require("./routes/mail");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/mail',MailsRoute)
app.get("/",(req,res)=>{
    res.send("Welcome to snapwheels mailer app!")
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server started in port ${port}`)
})