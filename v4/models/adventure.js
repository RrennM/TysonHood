var mongoose = require("mongoose");

// Temp adventure creation
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

// Schema set up
var adventureSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Adventure", adventureSchema);