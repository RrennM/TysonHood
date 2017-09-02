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
    image: String,
    description: String
});

var Adventure = mongoose.model("Adventure", adventureSchema);

// Adventure.create(
//     {
//         name: "Blue Pool", 
//         image: "https://scontent-sea1-1.xx.fbcdn.net/v/t31.0-8/18278902_10209177208042950_1133499116197092643_o.jpg?oh=6db1bda102f36918dc543cbb2d6800d7&oe=5A300743",
//         description: "Serene pool with a special, toxic algae which makes this look like nothing you've ever seen!"
        
//     }, function(err, adventure) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created adventure");
//             console.log(adventure);
//         }
//     });

// Root Route/Landing page
app.get("/", function(req, res) {
   res.render("landing"); 
});

// INDEX route - Show all adventures
app.post("/adventures", function(req, res) {
    // get data from form and add to adventures array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newAdventure = {name: name, image: image, description: desc};
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

// CREATE route - add new adventure to db
app.get("/adventures", function(req, res) {
    // get all adventures from DB
    Adventure.find({}, function(err, allAdventures) {
        if(err) {
            console.log(err);
        } else {
            res.render("advenIndex", {adventures: allAdventures})
        }
    });
});

// NEW route - show form to create a new adventure
app.get("/adventures/new", function(req, res) {
    res.render("advenNew")
});

// SHOW route - shows info about one adventure
app.get("/adventures/:id", function(req, res) {
    // find the adventure with the provided id
    Adventure.findById(req.params.id, function(err, foundAdventure) {
        if(err) {
            console.log(err);
        } else {
            res.render("advenShow", {adventure: foundAdventure});
        }
    })
});



// BLOG PAGE
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Temporary blog post
// Blog.create({
//     title: "First Blog",
//     image: "https://amazinganimalphotos.com/wp-content/uploads/2013/04/cutest-cat-picture-ever.jpg",
//     body: "Today, I have officially started my own blog for my own site!"
// })

// RESTful routing - Blog page
// INDEX Route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
            res.redirect("/")
        } else {
            res.render("blogIndex", {blogs: blogs});
        }
    });
});

// NEW route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The server is listening") ;
});