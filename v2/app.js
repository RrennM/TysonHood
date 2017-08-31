var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
// make Mongoose error go away
mongoose.Promise = global.Promise; 

// connect to mongoose, make db, and make next error go away
mongoose.connect("mongodb://localhost/tyson_hood", {useMongoClient: true});

// Tell our app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Auto look for .ejs files
app.set("view engine", "ejs");


// Schema set up
var adventureSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Adventure = mongoose.model("Adventure", adventureSchema);

// Root Route
app.get("/", function(req, res) {
   res.render("landing"); 
});

// POST route
app.post("/adventures", function(req, res) {
    // get data from form and add to adventures array
    var name = req.body.name;
    var image = req.body.image;
    var newAdventure = {name: name, image: image};
    // create a new adventure and save to db
    Adventure.create(newAdventure, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to adventure page
            res.redirect("/adventures")
        }
    })
});

// adventures page
app.get("/adventures", function(req, res) {
    // get all adventures from DB
    Adventure.find({}, function(err, allAdventures) {
        if(err) {
            console.log(err);
        } else {
            res.render("adventures", {adventures: allAdventures})
        }
    });
});

// Page to add new adventures
app.get("/adventures/new", function(req, res) {
    res.render("new")
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The server is listening") ;
});