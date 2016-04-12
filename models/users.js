var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shortid = require("shortid");

var Poll = require("./poll");
var Option = require("./poll_options");


var userSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    ip: String,
    created: { 
        type: Date, 
        default: Date.now 
    }
});

var User = mongoose.model("User", userSchema);

module.exports = User;

