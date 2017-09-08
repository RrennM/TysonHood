var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    Adventure           = require("./models/adventure"),
    Blog                = require("./models/blog"),
    Comment             = require("./models/comment");
    
// make Mongoose error go away
mongoose.Promise = global.Promise; 

// connect to mongoose, make db, and make next error go away
mongoose.connect("mongodb://localhost/tyson_hood_v4", {useMongoClient: true});

// Tell our app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Auto look for .ejs files
app.set("view engine", "ejs");

// Contains stylesheets
app.use(express.static("public"));

// include method-override in our app
app.use(methodOverride("_method"));

// "sanitize" script tags from editable text areas
app.use(expressSanitizer());

// ROOT Route/Landing page
app.get("/", function(req, res) {
   res.render("landing"); 
});


// =================================================================
// ======================ADVENTURES=================================
// =================================================================

// INDEX route - Show all adventures
app.get("/adventures", function(req, res) {
    // get all adventures from DB
    Adventure.find({}, function(err, allAdventures) {
        if(err) {
            console.log(err);
        } else {
            res.render("adventures/index", {adventures: allAdventures});
        }
    });
});

// CREATE route - add new adventure to db
app.post("/adventures", function(req, res) {
    // "Sanitize" and script tags from editable text boxes
    // req.body.adventure.desc = req.sanitize(req.body.adventure.desc);
    // create a new adventure and save to db
    Adventure.create(req.body.adventure, function(err, newAdventure) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to adventure page
            res.redirect("/adventures");
        }
    });
});

// NEW route - show form to create a new adventure
app.get("/adventures/new", function(req, res) {
    res.render("adventures/new");
});

// SHOW route - shows info about one adventure
app.get("/adventures/:id", function(req, res) {
    // find the adventure with the provided id
    Adventure.findById(req.params.id).populate("comments").exec(function(err, foundAdventure) {
        if(err) {
            console.log(err);
        } else {
            res.render("adventures/show", {adventure: foundAdventure});
        }
    });
});

// EDIT Route
app.get("/adventures/:id/edit", function(req, res) {
    // "Sanitize" and script tags from editable text boxes
    // req.body.adventure.desc = req.sanitize(req.body.adventure.desc);
    Adventure.findById(req.params.id, function(err, foundAdventure) {
        if(err) {
            console.log(err);
            res.redirect("/adventures");
        } else {
            res.render("adventures/edit", {adventure: foundAdventure});
        }
    });
});

// UPDATE Route
app.put("/adventures/:id", function(req, res) {
    // "Sanitize" and script tags from editable text boxes
    // req.body.adventure.desc = req.sanitize(req.body.adventure.desc);
    Adventure.findByIdAndUpdate(req.params.id, req.body.adventure, function(err, updatedAdventure) {
        if(err) {
            console.log(err);
            res.redirect("/adventures");
        } else {
            res.redirect("/adventures/" + req.params.id);
        }
    });
});

// DESTROY Route
app.delete("/adventures/:id", function(req, res) {
    Adventure.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/adventures");
        } else {
            res.redirect("/adventures");
        }
    })
})


// =================================================================
// ======================ADVENTURES=================================
// =======================COMMENTS==================================
// =================================================================

app.post("/adventures/:id/comments", function(req, res) {
    // look up adventure using is
    Adventure.findById(req.params.id, function(err, adventure) {
        if(err) {
            console.log(err);
            res.redirect("/adventures");
        } else {
            // create new comments
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // connect new comment to adventure
                    adventure.comments.push(comment);
                    adventure.save();
                    // redirect to show page
                    res.redirect("/adventures/" + adventure._id);
                }
            });
        }
    });
})


// =================================================================
// =========================BLOG====================================
// =================================================================

// RESTful routing - Blog page
// INDEX Route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("blog/index", {blogs: blogs});
        }
    });
});

// NEW route
app.get("/blogs/new", function(req, res) {
    res.render("blog/new");
});

// CREATE Route
app.post("/blogs", function(req, res) {
    // create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if(err) {
            // if error, go back to new page
            res.render("blogs/new");
        } else {
            // redirect
            res.redirect("/blogs");
        }
    });
});

// SHOW Route
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("blog/show", {blog: foundBlog});
       }
   });
});

// EDIT route
app.get("/blogs/:id/edit", function (req, res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("blog/edit", {blog: foundBlog});
       }
   });
});

// UPDATE Route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY Route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


// =================================================================
// =========================BLOG====================================
// =======================COMMENTS==================================
// =================================================================

// CREATE Route
app.post("/blogs/:id/comments", function(req, res) {
    // lookup blog using id
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // create new comments
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // connect new comment to blog
                    blog.comments.push(comment);
                    blog.save();
                    // redirect to show page
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The server is listening") ;
});