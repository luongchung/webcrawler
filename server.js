var express =require("express");
var app =express();
app.use(express.static("public")); 
app.set("view engine","ejs");
app.set("views","./views")
var server =require("http").Server(app);

const fs = require('fs');
var port = process.env.PORT || 5000;
server.listen(port);
app.get("/",function (req,res) {
    res.render("trangchu");
})
