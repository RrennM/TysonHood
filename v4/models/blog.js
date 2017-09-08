var mongoose = require("mongoose");

// Temporary blog post
// Blog.create({
//     title: "First Blog",
//     image: "https://amazinganimalphotos.com/wp-content/uploads/2013/04/cutest-cat-picture-ever.jpg",
//     body: "Today, I have officially started my own blog for my own site!"
// })


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", blogSchema);