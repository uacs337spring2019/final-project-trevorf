var express = require("express");
var path = require("path");
var app = express();

app.use("/static", express.static("public"))


app.get('/', function (req, res) {
	res.sendFile("final_project.html", {root: path.join(__dirname, "")})
})

var server = app.listen(3000);