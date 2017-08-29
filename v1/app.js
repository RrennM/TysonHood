var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Tell our app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Auto look for .ejs files
app.set("view engine", "ejs");

// make temporary travels array global
var travels = [
    {name: "Blue Pool", image: "https://scontent-sea1-1.xx.fbcdn.net/v/t31.0-8/18278902_10209177208042950_1133499116197092643_o.jpg?oh=6db1bda102f36918dc543cbb2d6800d7&oe=5A300743"},
    {name: "Abiqua Falls", image: "https://scontent-sea1-1.xx.fbcdn.net/v/t31.0-8/13316996_10206619225574987_6949561963416430381_o.jpg?oh=b78fcf0e7a8f866e1224cd2ed67645d4&oe=5A1E3701"},
    {name: "South Sister", image: "https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-9/11863440_10205188835896139_8324192679122626296_n.jpg?oh=a363ebf947350cc5f3ccb9e167374214&oe=5A5850DE"},
];

// Root Route
app.get("/", function(req, res) {
   res.render("landing"); 
});

// POST route
app.post("/travels", function(req, res) {
    // get data from form and add to travels array
    var name = req.body.name;
    var image = req.body.image;
    var newTravel = {name: name, image: image};
    travels.push(newTravel);
    // redirect back to travel page
    res.redirect("/travels")
});

// travels page
app.get("/travels", function(req, res) {
    
    res.render("travels", {travels: travels});
    
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The server is listening") ;
});