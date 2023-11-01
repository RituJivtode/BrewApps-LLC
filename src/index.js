const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("../src/routes/route");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

let connectionString = process.env.MONGO_URL || "mongodb+srv://AAbhishek2022:1ESrG6kzyaqzUE3p@cluster0.am17a.mongodb.net/BrewApps-LLC"
mongoose.connect(connectionString,{
    useNewUrlParser : true
})
.then(() => console.log("MongoDB is connected..!"))
.catch(err => console.log(err))

app.use('/',route);


app.listen(process.env.PORT || 3000 , function(){
    console.log("Express app is running on port :",(process.env.PORT || 3000))
});